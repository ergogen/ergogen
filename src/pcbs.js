const m = require('makerjs')
const a = require('./assert')
const prep = require('./prepare')
const anchor_lib = require('./anchor')

const kicad_prefix = `
(kicad_pcb (version 20171130) (host pcbnew 5.1.6)

  (page A3)
  (title_block
    (title KEYBOARD_NAME_HERE)
    (rev VERSION_HERE)
    (company YOUR_NAME_HERE)
  )

  (general
    (thickness 1.6)
  )

  (layers
    (0 F.Cu signal)
    (31 B.Cu signal)
    (32 B.Adhes user)
    (33 F.Adhes user)
    (34 B.Paste user)
    (35 F.Paste user)
    (36 B.SilkS user)
    (37 F.SilkS user)
    (38 B.Mask user)
    (39 F.Mask user)
    (40 Dwgs.User user)
    (41 Cmts.User user)
    (42 Eco1.User user)
    (43 Eco2.User user)
    (44 Edge.Cuts user)
    (45 Margin user)
    (46 B.CrtYd user)
    (47 F.CrtYd user)
    (48 B.Fab user)
    (49 F.Fab user)
  )

  (setup
    (last_trace_width 0.25)
    (trace_clearance 0.2)
    (zone_clearance 0.508)
    (zone_45_only no)
    (trace_min 0.2)
    (via_size 0.8)
    (via_drill 0.4)
    (via_min_size 0.4)
    (via_min_drill 0.3)
    (uvia_size 0.3)
    (uvia_drill 0.1)
    (uvias_allowed no)
    (uvia_min_size 0.2)
    (uvia_min_drill 0.1)
    (edge_width 0.05)
    (segment_width 0.2)
    (pcb_text_width 0.3)
    (pcb_text_size 1.5 1.5)
    (mod_edge_width 0.12)
    (mod_text_size 1 1)
    (mod_text_width 0.15)
    (pad_size 1.524 1.524)
    (pad_drill 0.762)
    (pad_to_mask_clearance 0.05)
    (aux_axis_origin 0 0)
    (visible_elements FFFFFF7F)
    (pcbplotparams
      (layerselection 0x010fc_ffffffff)
      (usegerberextensions false)
      (usegerberattributes true)
      (usegerberadvancedattributes true)
      (creategerberjobfile true)
      (excludeedgelayer true)
      (linewidth 0.100000)
      (plotframeref false)
      (viasonmask false)
      (mode 1)
      (useauxorigin false)
      (hpglpennumber 1)
      (hpglpenspeed 20)
      (hpglpendiameter 15.000000)
      (psnegative false)
      (psa4output false)
      (plotreference true)
      (plotvalue true)
      (plotinvisibletext false)
      (padsonsilk false)
      (subtractmaskfromsilk false)
      (outputformat 1)
      (mirror false)
      (drillshape 1)
      (scaleselection 1)
      (outputdirectory ""))
  )
`

const kicad_suffix = `
)
`

const kicad_netclass = `
  (net_class Default "This is the default net class."
    (clearance 0.2)
    (trace_width 0.25)
    (via_dia 0.8)
    (via_drill 0.4)
    (uvia_dia 0.3)
    (uvia_drill 0.1)
    __ADD_NET
  )
`

const makerjs2kicad = exports._makerjs2kicad = (model, layer='Edge.Cuts') => {
    const grs = []
    const xy = val => `${val[0]} ${-val[1]}`
    m.model.walk(model, {
        onPath: wp => {
            const p = wp.pathContext
            switch (p.type) {
                case 'line':
                    grs.push(`(gr_line (start ${xy(p.origin)}) (end ${xy(p.end)}) (angle 90) (layer ${layer}) (width 0.15))`)
                    break
                case 'arc':
                    const arc_center = p.origin
                    const angle_start = p.startAngle > p.endAngle ? p.startAngle - 360 : p.startAngle
                    const angle_diff = Math.abs(p.endAngle - angle_start)
                    const arc_end = m.point.rotate(m.point.add(arc_center, [p.radius, 0]), angle_start, arc_center)
                    grs.push(`(gr_arc (start ${xy(arc_center)}) (end ${xy(arc_end)}) (angle ${-angle_diff}) (layer ${layer}) (width 0.15))`)
                    break
                case 'circle':
                    const circle_center = p.origin
                    const circle_end = m.point.add(circle_center, [p.radius, 0])
                    grs.push(`(gr_circle (center ${xy(circle_center)}) (end ${xy(circle_end)}) (layer ${layer}) (width 0.15))`)
                    break
                default:
                    throw new Error(`Can't convert path type "${p.type}" to kicad!`)
            }
        }
    })
    return grs.join('\n')
}

const footprint_types = require('./footprints')

exports.inject_footprint = (name, fp) => {
    footprint_types[name] = fp
}

const footprint = exports._footprint = (config, name, points, point, net_indexer, component_indexer, units, extra) => {

    if (config === false) return ''

    // config sanitization
    a.unexpected(config, name, ['type', 'anchor', 'nets', 'anchors', 'params'])
    const type = a.in(config.type, `${name}.type`, Object.keys(footprint_types))
    let anchor = anchor_lib.parse(config.anchor || {}, `${name}.anchor`, points, true, point)(units)
    const nets = a.sane(config.nets || {}, `${name}.nets`, 'object')()
    const anchors = a.sane(config.anchors || {}, `${name}.anchors`, 'object')()
    const params = a.sane(config.params || {}, `${name}.params`, 'object')()

    // basic setup
    const fp = footprint_types[type]
    const parsed_params = {}

    // connecting other, non-net, non-anchor parameters
    parsed_params.param = {}
    for (const [param_name, param_value] of Object.entries(prep.extend(fp.params || {}, params))) {
        let value = param_value
        if (a.type(value)() == 'string' && value.startsWith('=') && point) {
            const indirect = value.substring(1)
            value = point.meta[indirect]
            if (value === undefined) {
                throw new Error(`Indirection "${name}.params.${param}" --> "${point.meta.name}.${indirect}" to undefined value!`)
            }
        }
        parsed_params.param[param_name] = value
    }

    // reference
    const component_ref = parsed_params.ref = component_indexer(parsed_params.param.class || '_')
    parsed_params.ref_hide = extra.references ? '' : 'hide'

    // footprint positioning
    parsed_params.at = `(at ${anchor.x} ${-anchor.y} ${anchor.r})`
    parsed_params.rot = anchor.r
    parsed_params.xy = (x, y) => {
        const new_anchor = anchor_lib.parse({
            shift: [x, -y]
        }, '_internal_footprint_xy', points, true, anchor)(units)
        return `${new_anchor.x} ${-new_anchor.y}`
    }

    // connecting nets
    parsed_params.net = {}
    for (const [net_name, net_value] of Object.entries(prep.extend(fp.nets || {}, nets))) {
        let net = a.sane(net_value, `${name}.nets.${net_name}`, 'string')()
        if (net.startsWith('=') && point) {
            const indirect = net.substring(1)
            net = point.meta[indirect]
            net = a.sane(net, `${name}.nets.${net_name} --> ${point.meta.name}.${indirect}`, 'string')()
        }
        const index = net_indexer(net)
        parsed_params.net[net_name] = {
            name: net,
            index: index,
            str: `(net ${index} "${net}")`
        }
    }

    // allowing footprints to add dynamic nets
    parsed_params.local_net = suffix => {
        const net = `${component_ref}_${suffix}`
        const index = net_indexer(net)
        return {
            name: net,
            index: index,
            str: `(net ${index} "${net}")`
        }
    }

    // parsing anchor-type parameters
    parsed_params.anchors = {}
    for (const [anchor_name, anchor_config] of Object.entries(prep.extend(fp.anchors || {}, anchors))) {
        let parsed_anchor = anchor_lib.parse(anchor_config || {}, `${name}.anchors.${anchor_name}`, points, true, anchor)(units)
        parsed_anchor.y = -parsed_anchor.y
        parsed_params.anchors[anchor_name] = parsed_anchor
    }

    return fp.body(parsed_params)
}

exports.parse = (config, points, outlines, units) => {

    const pcbs = a.sane(config.pcbs || {}, 'pcbs', 'object')()
    const results = {}

    for (const [pcb_name, pcb_config] of Object.entries(pcbs)) {

        // config sanitization
        a.unexpected(pcb_config, `pcbs.${pcb_name}`, ['outlines', 'footprints', 'references'])
        const references = a.sane(pcb_config.references || false, `pcbs.${pcb_name}.references`, 'boolean')()

        // outline conversion
        if (a.type(pcb_config.outlines)() == 'array') {
            pcb_config.outlines = {...pcb_config.outlines}
        }
        const config_outlines = a.sane(pcb_config.outlines || {}, `pcbs.${pcb_name}.outlines`, 'object')()
        const kicad_outlines = {}
        for (const [outline_name, outline] of Object.entries(config_outlines)) {
            const ref = a.in(outline.outline, `pcbs.${pcb_name}.outlines.${outline_name}.outline`, Object.keys(outlines))
            const layer = a.sane(outline.layer || 'Edge.Cuts', `pcbs.${pcb_name}.outlines.${outline_name}.outline`, 'string')()
            kicad_outlines[outline_name] = makerjs2kicad(outlines[ref], layer)
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

        // key-level footprints
        for (const [p_name, point] of Object.entries(points)) {
            for (const [f_name, f] of Object.entries(point.meta.footprints || {})) {
                footprints.push(footprint(f, `${p_name}.footprints.${f_name}`, points, point, net_indexer, component_indexer, units, {references}))
            }
        }

        // global one-off footprints
        if (a.type(pcb_config.footprints)() == 'array') {
            pcb_config.footprints = {...pcb_config.footprints}
        }
        const global_footprints = a.sane(pcb_config.footprints || {}, `pcbs.${pcb_name}.footprints`, 'object')()
        for (const [gf_name, gf] of Object.entries(global_footprints)) {
            footprints.push(footprint(gf, `pcbs.${pcb_name}.footprints.${gf_name}`, points, undefined, net_indexer, component_indexer, units, {references}))
        }

        // finalizing nets
        const nets_arr = []
        const add_nets_arr = []
        for (const [net, index] of Object.entries(nets)) {
            nets_arr.push(`(net ${index} "${net}")`)
            add_nets_arr.push(`(add_net "${net}")`)
        }

        const netclass = kicad_netclass.replace('__ADD_NET', add_nets_arr.join('\n'))
        const nets_text = nets_arr.join('\n')
        const footprint_text = footprints.join('\n')
        const outline_text = Object.values(kicad_outlines).join('\n')
        const personalized_prefix = kicad_prefix
            .replace('KEYBOARD_NAME_HERE', pcb_name)
            .replace('VERSION_HERE', config.meta && config.meta.version || 'v1.0.0')
            .replace('YOUR_NAME_HERE', config.meta && config.meta.author || 'Unknown')
        results[pcb_name] = `
            ${personalized_prefix}
            ${nets_text}
            ${netclass}
            ${footprint_text}
            ${outline_text}
            ${kicad_suffix}
        `
    }

    return results
}