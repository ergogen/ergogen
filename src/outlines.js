const m = require('makerjs')
const u = require('./utils')
const a = require('./assert')
const o = require('./operation')
const Point = require('./point')
const prep = require('./prepare')
const anchor_lib = require('./anchor')

const rectangle = (w, h, corner, bevel, name='') => {
    const error = (dim, val) => `Rectangle for "${name}" isn't ${dim} enough for its corner and bevel (${val} - 2 * ${corner} - 2 * ${bevel} <= 0)!`
    const mod = 2 * (corner + bevel)
    const cw = w - mod
    a.assert(cw >= 0, error('wide', w))
    const ch = h - mod
    a.assert(ch >= 0, error('tall', h))

    let res = new m.models.Rectangle(cw, ch)
    if (bevel) {
        res = u.poly([
            [-bevel, 0],
            [-bevel, ch],
            [0, ch + bevel],
            [cw, ch + bevel],
            [cw + bevel, ch],
            [cw + bevel, 0],
            [cw, -bevel],
            [0, -bevel]
        ])
    }
    if (corner > 0) res = m.model.outline(res, corner, 0)
    return m.model.moveRelative(res, [corner + bevel, corner + bevel])
}

const layout = exports._layout = (config = {}, points = {}, units = {}) => {

    // Glue config sanitization

    const parsed_glue = u.deepcopy(a.sane(config, 'outlines.glue', 'object')())
    for (let [gkey, gval] of Object.entries(parsed_glue)) {
        a.unexpected(gval, `outlines.glue.${gkey}`, ['top', 'bottom', 'waypoints', 'extra'])
    
        for (const y of ['top', 'bottom']) {
            a.unexpected(gval[y], `outlines.glue.${gkey}.${y}`, ['left', 'right'])
            gval[y].left = anchor_lib.parse(gval[y].left, `outlines.glue.${gkey}.${y}.left`, points)
            if (a.type(gval[y].right)(units) != 'number') {
                gval[y].right = anchor_lib.parse(gval[y].right, `outlines.glue.${gkey}.${y}.right`, points)
            }
        }
    
        gval.waypoints = a.sane(gval.waypoints || [], `outlines.glue.${gkey}.waypoints`, 'array')(units)
        let wi = 0
        gval.waypoints = gval.waypoints.map(w => {
            const name = `outlines.glue.${gkey}.waypoints[${++wi}]`
            a.unexpected(w, name, ['percent', 'width'])
            w.percent = a.sane(w.percent, name + '.percent', 'number')(units)
            w.width = a.wh(w.width, name + '.width')(units)
            return w
        })

        parsed_glue[gkey] = gval
    }


    // TODO: handle glue.extra (or revoke it from the docs)

    return (params, export_name, expected) => {

        // Layout params sanitization

        a.unexpected(params, `${export_name}`, expected.concat(['side', 'tags', 'glue', 'size', 'corner', 'bevel', 'bound']))
        const size = a.wh(params.size, `${export_name}.size`)(units)
        const relative_units = prep.extend({
            sx: size[0],
            sy: size[1]
        }, units)



        const side = a.in(params.side, `${export_name}.side`, ['left', 'right', 'middle', 'both', 'glue'])
        const tags = a.sane(params.tags || [], `${export_name}.tags`, 'array')()
        const corner = a.sane(params.corner || 0, `${export_name}.corner`, 'number')(relative_units)
        const bevel = a.sane(params.bevel || 0, `${export_name}.bevel`, 'number')(relative_units)
        const bound = a.sane(params.bound === undefined ? true : params.bound, `${export_name}.bound`, 'boolean')()

        // Actual layout

        let left = {models: {}}
        let right = {models: {}}
        if (['left', 'right', 'middle', 'both'].includes(side)) {
            for (const [pname, p] of Object.entries(points)) {

                // filter by tags, if necessary
                if (tags.length) {
                    const source = p.meta.tags || {}
                    const point_tags = Object.keys(source).filter(t => !!source[t])
                    const relevant = point_tags.some(pt => tags.includes(pt))
                    if (!relevant) continue
                }

                let from_x = -size[0] / 2, to_x = size[0] / 2
                let from_y = -size[1] / 2, to_y = size[1] / 2

                // the original position
                let rect = rectangle(to_x - from_x, to_y - from_y, corner, bevel, `${export_name}.size`)
                rect = m.model.moveRelative(rect, [from_x, from_y])

                // extra binding "material", if necessary
                if (bound) {
                    let bind = a.trbl(p.meta.bind || 0, `${pname}.bind`)(relative_units)
                    // if it's a mirrored key, we swap the left and right bind values
                    if (p.meta.mirrored) {
                        bind = [bind[0], bind[3], bind[2], bind[1]]
                    }
    
                    const bt = to_y + Math.max(bind[0], 0)
                    const br = to_x + Math.max(bind[1], 0)
                    const bd = from_y - Math.max(bind[2], 0)
                    const bl = from_x - Math.max(bind[3], 0)
    
                    if (bind[0] || bind[1]) rect = u.union(rect, u.rect(br, bt))
                    if (bind[1] || bind[2]) rect = u.union(rect, u.rect(br, -bd, [0, bd]))
                    if (bind[2] || bind[3]) rect = u.union(rect, u.rect(-bl, -bd, [bl, bd]))
                    if (bind[3] || bind[0]) rect = u.union(rect, u.rect(-bl, bt, [bl, 0]))
                }
                
                // positioning and unioning the resulting shape
                rect = p.position(rect)
                if (p.meta.mirrored) {
                    right = u.union(right, rect)
                } else {
                    left = u.union(left, rect)
                }
            }
        }
        if (side == 'left') return left
        if (side == 'right') return right

        // allow opting out of gluing, when
        // A) there are no glue definitions, or
        // B) glue is explicitly set to false
        const glue_opt_out = (!Object.keys(parsed_glue).length || params.glue === false)

        let glue = {models: {}}
        if (bound && ['middle', 'both', 'glue'].includes(side) && !glue_opt_out) {

            const default_glue_name = Object.keys(parsed_glue)[0]
            const computed_glue_name = a.sane(params.glue || default_glue_name, `${export_name}.glue`, 'string')()
            const glue_def = parsed_glue[computed_glue_name]
            a.assert(glue_def, `Field "${export_name}.glue" does not name a valid glue!`)

            const get_line = (anchor) => {
                if (a.type(anchor)(relative_units) == 'number') {
                    return u.line([anchor, -1000], [anchor, 1000])
                }

                // if it wasn't a number, then it's a (possibly relative) anchor
                const from = anchor(relative_units).clone()
                const to = from.clone().shift([from.meta.mirrored ? -1 : 1, 0])

                return u.line(from.p, to.p)
            }

            const tll = get_line(glue_def.top.left)
            const trl = get_line(glue_def.top.right)
            const tip = m.path.converge(tll, trl)
            if (!tip) {
                throw new Error(`Top lines don't intersect in glue "${computed_glue_name}"!`)
            }
            const tlp = u.eq(tll.origin, tip) ? tll.end : tll.origin
            const trp = u.eq(trl.origin, tip) ? trl.end : trl.origin
    
            const bll = get_line(glue_def.bottom.left)
            const brl = get_line(glue_def.bottom.right)
            const bip = m.path.converge(bll, brl)
            if (!bip) {
                throw new Error(`Bottom lines don't intersect in glue "${computed_glue_name}"!`)
            }
            const blp = u.eq(bll.origin, bip) ? bll.end : bll.origin
            const brp = u.eq(brl.origin, bip) ? brl.end : brl.origin
    
            const left_waypoints = []
            const right_waypoints = []

            for (const w of glue_def.waypoints) {
                const percent = w.percent / 100
                const center_x = tip[0] + percent * (bip[0] - tip[0])
                const center_y = tip[1] + percent * (bip[1] - tip[1])
                const left_x = center_x - w.width[0]
                const right_x = center_x + w.width[1]
                left_waypoints.push([left_x, center_y])
                right_waypoints.unshift([right_x, center_y])
            }
            
            let waypoints
            const is_split = a.type(glue_def.top.right)(relative_units) == 'number'
            if (is_split) {
                waypoints = [tip, tlp]
                .concat(left_waypoints)
                .concat([blp, bip])
            } else {
                waypoints = [trp, tip, tlp]
                .concat(left_waypoints)
                .concat([blp, bip, brp])
                .concat(right_waypoints)
            }

            glue = u.poly(waypoints)
        }
        if (side == 'glue') return glue

        if (side == 'middle') {
            let middle = u.subtract(glue, left)
            middle = u.subtract(middle, right)
            return middle
        }

        let both = u.union(u.deepcopy(left), glue)
        both = u.union(both, u.deepcopy(right))
        return both
    }
}

exports.parse = (config = {}, points = {}, units = {}) => {
    a.unexpected(config, 'outline', ['glue', 'exports'])
    const layout_fn = layout(config.glue, points, units)

    const outlines = {}

    const ex = a.sane(config.exports || {}, 'outlines.exports', 'object')()
    for (let [key, parts] of Object.entries(ex)) {
        if (a.type(parts)() == 'array') {
            parts = {...parts}
        }
        parts = a.sane(parts, `outlines.exports.${key}`, 'object')()
        let result = {models: {}}
        for (let [part_name, part] of Object.entries(parts)) {
            const name = `outlines.exports.${key}.${part_name}`
            if (a.type(part)() == 'string') {
                part = o.operation(part, {outline: Object.keys(outlines)})
            }
            const expected = ['type', 'operation']
            part.type = a.in(part.type || 'outline', `${name}.type`, ['keys', 'rectangle', 'circle', 'polygon', 'outline'])
            part.operation = a.in(part.operation || 'add', `${name}.operation`, ['add', 'subtract', 'intersect', 'stack'])

            let op = u.union
            if (part.operation == 'subtract') op = u.subtract
            else if (part.operation == 'intersect') op = u.intersect
            else if (part.operation == 'stack') op = u.stack

            let arg
            let anchor
            const anchor_def = part.anchor || {}
            switch (part.type) {
                case 'keys':
                    arg = layout_fn(part, name, expected)
                    break
                case 'rectangle':
                    a.unexpected(part, name, expected.concat(['anchor', 'size', 'corner', 'bevel', 'mirror']))
                    const size = a.wh(part.size, `${name}.size`)(units)
                    const rec_units = prep.extend({
                        sx: size[0],
                        sy: size[1]
                    }, units)
                    anchor = anchor_lib.parse(anchor_def, `${name}.anchor`, points)(rec_units)
                    const corner = a.sane(part.corner || 0, `${name}.corner`, 'number')(rec_units)
                    const bevel = a.sane(part.bevel || 0, `${name}.bevel`, 'number')(rec_units)
                    const rect_mirror = a.sane(part.mirror || false, `${name}.mirror`, 'boolean')()
                    const rect = rectangle(size[0], size[1], corner, bevel, name)
                    arg = anchor.position(u.deepcopy(rect))
                    if (rect_mirror) {
                        const mirror_anchor = u.deepcopy(anchor_def)
                        a.assert(mirror_anchor.ref, `Field "${name}.anchor.ref" must be speficied if mirroring is required!`)
                        anchor = anchor_lib.parse(mirror_anchor, `${name}.anchor --> mirror`, points, undefined, undefined, true)(rec_units)
                        const mirror_rect = m.model.moveRelative(u.deepcopy(rect), [-size[0], 0])
                        arg = u.union(arg, anchor.position(mirror_rect))
                    }
                    break
                case 'circle':
                    a.unexpected(part, name, expected.concat(['anchor', 'radius', 'mirror']))
                    const radius = a.sane(part.radius, `${name}.radius`, 'number')(units)
                    const circle_units = prep.extend({
                        r: radius
                    }, units)
                    anchor = anchor_lib.parse(anchor_def, `${name}.anchor`, points)(circle_units)
                    const circle_mirror = a.sane(part.mirror || false, `${name}.mirror`, 'boolean')()
                    arg = u.circle(anchor.p, radius)
                    if (circle_mirror) {
                        const mirror_anchor = u.deepcopy(anchor_def)
                        a.assert(mirror_anchor.ref, `Field "${name}.anchor.ref" must be speficied if mirroring is required!`)
                        anchor = anchor_lib.parse(mirror_anchor, `${name}.anchor --> mirror`, points, undefined, undefined, true)(circle_units)
                        arg = u.union(arg, u.circle(anchor.p, radius))
                    }
                    break
                case 'polygon':
                    a.unexpected(part, name, expected.concat(['points', 'mirror']))
                    const poly_points = a.sane(part.points, `${name}.points`, 'array')()
                    const poly_mirror = a.sane(part.mirror || false, `${name.mirror}`, 'boolean')()
                    const parsed_points = []
                    const mirror_points = []
                    let poly_mirror_x = 0
                    let last_anchor = new Point()
                    let poly_index = 0
                    for (const poly_point of poly_points) {
                        const poly_name = `${name}.points[${++poly_index}]`
                        if (poly_index == 1 && poly_mirror) {
                            a.assert(poly_point.ref, `Field "${poly_name}.ref" must be speficied if mirroring is required!`)
                            const mirrored_ref = anchor_lib.mirror(poly_point.ref, poly_mirror)
                            a.assert(points[poly_point.ref], `Field "${poly_name}.ref" does not name an existing point!`)
                            a.assert(points[mirrored_ref], `The mirror of field "${poly_name}.ref" ("${mirrored_ref}") does not name an existing point!`)
                            poly_mirror_x = (points[poly_point.ref].x + points[mirrored_ref].x) / 2
                        }
                        last_anchor = anchor_lib.parse(poly_point, poly_name, points, true, last_anchor)(units)
                        parsed_points.push(last_anchor.p)
                        mirror_points.push(last_anchor.clone().mirror(poly_mirror_x).p)
                    }
                    arg = u.poly(parsed_points)
                    if (poly_mirror) {
                        arg = u.union(arg, u.poly(mirror_points))
                    }
                    break
                case 'outline':
                    a.unexpected(part, name, expected.concat(['name', 'fillet']))
                    a.assert(outlines[part.name], `Field "${name}.name" does not name an existing outline!`)
                    const fillet = a.sane(part.fillet || 0, `${name}.fillet`, 'number')(units)
                    arg = u.deepcopy(outlines[part.name])
                    if (fillet) {
                        for (const [index, chain] of m.model.findChains(arg).entries()) {
                            arg.models[`fillet_${index}`] = m.chain.fillet(chain, fillet)
                        }
                    }
                    break
                default:
                    throw new Error(`Field "${name}.type" (${part.type}) does not name a valid outline part type!`)
            }

            result = op(result, arg)
        }

        m.model.originate(result)
        m.model.simplify(result)
        outlines[key] = result
    }

    return outlines
}