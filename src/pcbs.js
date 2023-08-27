const m = require('makerjs')
const yaml = require('js-yaml')

const u = require('./utils')
const a = require('./assert')
const prep = require('./prepare')
const anchor = require('./anchor').parse
const filter = require('./filter').parse

const footprint_types = require('./footprints')
const template_types = require('./templates')

exports.inject_footprint = (name, fp) => {
    footprint_types[name] = fp
}

exports.inject_template = (name, t) => {
    template_types[name] = t
}

const xy_obj = (x, y) => {
    return {
        x,
        y,
        str: `${x} ${y}`,
        toString: function() { return this.str }
    }
}

const net_obj = (name, index) => {
    return {
        name,
        index,
        str: `(net ${index} "${name}")`,
        toString: function() { return this.str }
    }
}

const footprint = exports._footprint = (points, net_indexer, component_indexer, units, extra) => (config, name, point) => {

    // config sanitization
    a.unexpected(config, name, ['what', 'params'])
    const what = a.in(config.what, `${name}.what`, Object.keys(footprint_types))
    const fp = footprint_types[what]
    const original_params = config.params || {}

    // param sanitization
    // we unset the mirror config, as it would be an unexpected field
    let params = u.deepcopy(original_params)
    delete params.mirror
    // but still override with it when applicable
    if (point.meta.mirrored && original_params.mirror !== undefined) {
        const mirror_overrides = a.sane(original_params.mirror, `${name}.params.mirror`, 'object')()
        params = prep.extend(params, mirror_overrides)
    }
    a.unexpected(params, `${name}.params`, Object.keys(fp.params))

    // parsing parameters
    const parsed_params = {}
    for (const [param_name, param_def] of Object.entries(fp.params)) {

        // expand param definition shorthand
        let parsed_def = param_def
        let def_type = a.type(param_def)(units)
        if (def_type == 'string') {
            parsed_def = {type: 'string', value: param_def}
        } else if (def_type == 'number') {
            parsed_def = {type: 'number', value: a.mathnum(param_def)(units)}
        } else if (def_type == 'boolean') {
            parsed_def = {type: 'boolean', value: param_def}
        } else if (def_type == 'array') {
            parsed_def = {type: 'array', value: param_def}
        } else if (def_type == 'object') {
            // parsed param definitions also expand to an object
            // so to detect whether this is an arbitrary object,
            // we first have to make sure it's not an expanded param def
            // (this has to be a heuristic, but should be pretty reliable)
            const defarr = Object.keys(param_def)
            const already_expanded = defarr.length == 2 && defarr.includes('type') && defarr.includes('value')
            if (!already_expanded) {
                parsed_def = {type: 'object', value: param_def}
            }
        } else {
            parsed_def = {type: 'net', value: undefined}
        }

        // combine default value with potential user override
        let value = params[param_name] !== undefined ? params[param_name] : parsed_def.value
        const type = parsed_def.type

        // templating support, with conversion back to raw datatypes
        const converters = {
            string: v => v,
            number: v => a.sane(v, `${name}.params.${param_name}`, 'number')(units),
            boolean: v => v === 'true' || a.mathnum(v)(units) === 1,
            array: v => yaml.load(v),
            object: v => yaml.load(v),
            net: v => v,
            anchor: v => yaml.load(v)
        }
        a.in(type, `${name}.params.${param_name}.type`, Object.keys(converters))
        if (a.type(value)() == 'string') {
            value = u.template(value, point.meta)
            value = converters[type](value)
        }

        // type-specific postprocessing
        if (['string', 'number', 'boolean', 'array', 'object'].includes(type)) {
            parsed_params[param_name] = value
        } else if (type == 'net') {
            const net = a.sane(value, `${name}.params.${param_name}`, 'string')(units)
            const index = net_indexer(net)
            parsed_params[param_name] = net_obj(net, index)
        } else { // anchor
            let parsed_anchor = anchor(value, `${name}.params.${param_name}`, points, point)(units)
            parsed_anchor.y = -parsed_anchor.y // kicad mirror, as per usual
            parsed_params[param_name] = parsed_anchor
        }
    }

    // reference
    const component_ref = parsed_params.ref = component_indexer(parsed_params.designator || '_')
    parsed_params.ref_hide = extra.references ? '' : 'hide'

    // footprint positioning
    parsed_params.x = point.x
    parsed_params.y = -point.y
    parsed_params.r = point.r
    parsed_params.rot = point.r // to be deprecated
    parsed_params.xy = `${point.x} ${-point.y}`
    parsed_params.at = `(at ${point.x} ${-point.y} ${point.r})`

    const internal_xyfunc = (x, y, resist) => {
        const sign = resist ? 1 : (point.meta.mirrored ? -1 : 1)
        return xy_obj(sign * x, y)
    }
    parsed_params.isxy = (x, y) => internal_xyfunc(x, y, false)
    parsed_params.iaxy = (x, y) => internal_xyfunc(x, y, true)

    const external_xyfunc = (x, y, resist) => {
        const new_anchor = anchor({
            shift: [x, -y],
            resist: resist
        }, '_internal_footprint_xy', points, point)(units)
        return xy_obj(new_anchor.x, -new_anchor.y)
    }
    parsed_params.esxy = (x, y) => external_xyfunc(x, y, false)
    parsed_params.eaxy = (x, y) => external_xyfunc(x, y, true)

    // allowing footprints to add dynamic nets
    parsed_params.local_net = suffix => {
        const net = `${component_ref}_${suffix}`
        const index = net_indexer(net)
        return net_obj(net, index)
    }

    return fp.body(parsed_params)
}

exports.parse = (config, points, outlines, units) => {

    const pcbs = a.sane(config.pcbs || {}, 'pcbs', 'object')()
    const results = {}

    for (const [pcb_name, pcb_config] of Object.entries(pcbs)) {

        // config sanitization
        a.unexpected(pcb_config, `pcbs.${pcb_name}`, ['outlines', 'footprints', 'references', 'template', 'params'])
        const references = a.sane(pcb_config.references || false, `pcbs.${pcb_name}.references`, 'boolean')()
        const template = template_types[a.in(pcb_config.template || 'kicad5', `pcbs.${pcb_name}.template`, Object.keys(template_types))]

        // outline conversion
        if (a.type(pcb_config.outlines)() == 'array') {
            pcb_config.outlines = {...pcb_config.outlines}
        }
        const config_outlines = a.sane(pcb_config.outlines || {}, `pcbs.${pcb_name}.outlines`, 'object')()
        const kicad_outlines = {}
        for (const [outline_name, outline] of Object.entries(config_outlines)) {
            const ref = a.in(outline.outline, `pcbs.${pcb_name}.outlines.${outline_name}.outline`, Object.keys(outlines))
            const layer = a.sane(outline.layer || 'Edge.Cuts', `pcbs.${pcb_name}.outlines.${outline_name}.outline`, 'string')()
            kicad_outlines[outline_name] = template.convert_outline(outlines[ref], layer)
        }

        // making a global net index registry
        const nets = {"": 0}
        const net_indexer = net => {
            if (nets[net] !== undefined) return nets[net]
            const index = Object.keys(nets).length
            return nets[net] = index
        }
        // and a component indexer
        const component_registry = {}
        const component_indexer = _class => {
            if (!component_registry[_class]) {
                component_registry[_class] = 0
            }
            component_registry[_class]++
            return `${_class}${component_registry[_class]}`
        }

        const footprints = []
        const footprint_factory = footprint(points, net_indexer, component_indexer, units, {references})

        // generate footprints
        if (a.type(pcb_config.footprints)() == 'array') {
            pcb_config.footprints = {...pcb_config.footprints}
        }
        const footprints_config = a.sane(pcb_config.footprints || {}, `pcbs.${pcb_name}.footprints`, 'object')()
        for (const [f_name, f] of Object.entries(footprints_config)) {
            const name = `pcbs.${pcb_name}.footprints.${f_name}`
            a.sane(f, name, 'object')()
            const asym = a.asym(f.asym || 'source', `${name}.asym`)
            const where = filter(f.where, `${name}.where`, points, units, asym)
            const original_adjust = f.adjust // need to save, so the delete's don't get rid of it below
            const adjust = start => anchor(original_adjust || {}, `${name}.adjust`, points, start)(units)
            delete f.asym
            delete f.where
            delete f.adjust
            for (const w of where) {
                const aw = adjust(w.clone())
                footprints.push(footprint_factory(f, name, aw))
            }
        }

        // finalizing nets
        const nets_arr = []
        for (const [net, index] of Object.entries(nets)) {
            nets_arr.push(net_obj(net, index))
        }

        results[pcb_name] = template.body({
            name: pcb_name,
            version: config.meta && config.meta.version || 'v1.0.0',
            author: config.meta && config.meta.author || 'Unknown',
            nets: nets_arr,
            footprints: footprints,
            outlines: kicad_outlines,
            custom: pcb_config.params
        })
    }

    return results
}