const m = require('makerjs')
const u = require('./utils')
const a = require('./assert')
const Point = require('./point')

const rectangle = (w, h, corner, bevel, name='') => {
    const error = (dim, val) => `Rectangle for "${name}" isn't ${dim} enough for its corner and bevel (${val} - 2 * ${corner} - 2 * ${bevel} <= 0)!`
    const mod = 2 * (corner + bevel)
    const cw = w - mod
    a.assert(cw >= 0, error('wide', w))
    const ch = h - mod
    a.assert(ch >= 0, error('tall', h))

    let res = new m.models.Rectangle(cw, ch)
    if (bevel > 0) res = m.model.outline(res, bevel, 2)
    if (corner > 0) res = m.model.outline(res, corner, 0)
    return m.model.moveRelative(res, [corner + bevel, corner + bevel])
}

const relative_anchor = (decl, name, points={}, check_unexpected=true, default_point=new Point()) => {
    decl.shift = a.wh(decl.shift || [0, 0], name + '.shift')
    const relative = a.sane(decl.relative === undefined ? true : decl.relative, `${name}.relative`, 'boolean')
    delete decl.relative
    if (relative) {
        return size => {
            const copy = u.deepcopy(decl)
            copy.shift = [copy.shift[0] * size[0], copy.shift[1] * size[1]]
            return a.anchor(copy, name, points, check_unexpected, default_point)
        }
    }
    return () => a.anchor(decl, name, points, check_unexpected, default_point)
}

const layout = exports._layout = (config = {}, points = {}) => {

    // Glue config sanitization

    const parsed_glue = u.deepcopy(a.sane(config, 'outlines.glue', 'object'))
    for (let [gkey, gval] of Object.entries(parsed_glue)) {
        gval = a.inherit('outlines.glue', gkey, config)
        a.detect_unexpected(gval, `outlines.glue.${gkey}`, ['top', 'bottom', 'waypoints', 'extra'])
    
        for (const y of ['top', 'bottom']) {
            a.detect_unexpected(gval[y], `outlines.glue.${gkey}.${y}`, ['left', 'right'])
            gval[y].left = relative_anchor(gval[y].left, `outlines.glue.${gkey}.${y}.left`, points)
            if (a.type(gval[y].right) != 'number') {
                gval[y].right = relative_anchor(gval[y].right, `outlines.glue.${gkey}.${y}.right`, points)
            }
        }
    
        gval.waypoints = a.sane(gval.waypoints || [], `outlines.glue.${gkey}.waypoints`, 'array')
        let wi = 0
        gval.waypoints = gval.waypoints.map(w => {
            const name = `outlines.glue.${gkey}.waypoints[${++wi}]`
            a.detect_unexpected(w, name, ['percent', 'width'])
            w.percent = a.sane(w.percent, name + '.percent', 'number')
            w.width = a.wh(w.width, name + '.width')
            return w
        })

        parsed_glue[gkey] = gval
    }


    // TODO: handle glue.extra (or revoke it from the docs)

    return (params, export_name, expected) => {

        // Layout params sanitization

        a.detect_unexpected(params, `${export_name}`, expected.concat(['side', 'tags', 'glue', 'size', 'corner', 'bevel', 'bound']))
        const side = a.in(params.side, `${export_name}.side`, ['left', 'right', 'middle', 'both', 'glue'])
        const tags = a.sane(params.tags || [], `${export_name}.tags`, 'array')
        const default_glue_name = Object.keys(parsed_glue)[0]
        const glue_def = parsed_glue[a.sane(params.glue || default_glue_name, `${export_name}.glue`, 'string')]
        a.assert(glue_def, `Field "${export_name}.glue" does not name a valid glue!`)
        const size = a.wh(params.size, `${export_name}.size`)
        const corner = a.sane(params.corner || 0, `${export_name}.corner`, 'number')
        const bevel = a.sane(params.bevel || 0, `${export_name}.bevel`, 'number')
        const bound = a.sane(params.bound === undefined ? true : params.bound, `${export_name}.bound`, 'boolean')

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
                    let bind = a.trbl(p.meta.bind || 0, `${pname}.bind`)
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

        let glue = {models: {}}
        if (bound && ['middle', 'both', 'glue'].includes(side)) {

            const get_line = (anchor) => {
                if (a.type(anchor) == 'number') {
                    return u.line([anchor, -1000], [anchor, 1000])
                }

                // if it wasn't a number, then it's a function returning an achor
                // have to feed it `size` first in case it's relative
                const from = anchor(size).clone()
                const to = from.clone().shift([from.meta.mirrored ? -1 : 1, 0])

                return u.line(from.p, to.p)
            }

            const tll = get_line(glue_def.top.left)
            const trl = get_line(glue_def.top.right)
            const tip = m.path.converge(tll, trl)
            const tlp = u.eq(tll.origin, tip) ? tll.end : tll.origin
            const trp = u.eq(trl.origin, tip) ? trl.end : trl.origin
    
            const bll = get_line(glue_def.bottom.left)
            const brl = get_line(glue_def.bottom.right)
            const bip = m.path.converge(bll, brl)
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
            const is_split = a.type(glue_def.top.right) == 'number'
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

exports.parse = (config = {}, points = {}) => {
    a.detect_unexpected(config, 'outline', ['glue', 'exports'])
    const layout_fn = layout(config.glue, points)

    const outlines = {}

    const ex = a.sane(config.exports, 'outlines.exports', 'object')
    for (let [key, parts] of Object.entries(ex)) {
        parts = a.inherit('outlines.exports', key, ex)
        let result = {models: {}}
        for (const [part_name, part] of Object.entries(parts)) {
            const name = `outlines.exports.${key}.${part_name}`
            const expected = ['type', 'operation']
            part.type = a.in(part.type, `${name}.type`, ['keys', 'rectangle', 'circle', 'polygon', 'outline'])
            part.operation = a.in(part.operation || 'add', `${name}.operation`, ['add', 'subtract', 'intersect', 'stack'])

            let op = u.union
            if (part.operation == 'subtract') op = u.subtract
            else if (part.operation == 'intersect') op = u.intersect
            else if (part.operation == 'stack') op = u.stack

            let arg
            let anchor
            switch (part.type) {
                case 'keys':
                    arg = layout_fn(part, name, expected)
                    break
                case 'rectangle':
                    a.detect_unexpected(part, name, expected.concat(['ref', 'shift', 'rotate', 'size', 'corner', 'bevel']))
                    anchor = a.anchor(part, name, points, false)
                    const size = a.wh(part.size, `${name}.size`)
                    const corner = a.sane(part.corner || 0, `${name}.corner`, 'number')
                    const bevel = a.sane(part.bevel || 0, `${name}.bevel`, 'number')
                    arg = rectangle(size[0], size[1], corner, bevel, name)
                    arg = anchor.position(arg)
                    break
                case 'circle':
                    a.detect_unexpected(part, name, expected.concat(['ref', 'shift', 'rotate', 'radius']))
                    anchor = a.anchor(part, name, points, false)
                    const radius = a.sane(part.radius, `${name}.radius`, 'number')
                    arg = u.circle(anchor.p, radius)
                    break
                case 'polygon':
                    a.detect_unexpected(part, name, expected.concat(['points']))
                    const poly_points = a.sane(part.points, `${name}.points`, 'array')
                    const parsed_points = []
                    let last_anchor = new Point()
                    let poly_index = 0
                    for (const poly_point of poly_points) {
                        const poly_name = `${name}.points[${++poly_index}]`
                        const anchor = a.anchor(poly_point, poly_name, points, true, last_anchor)
                        parsed_points.push(anchor.p)
                    }
                    arg = u.poly(parsed_points)
                    break
                case 'outline':
                    a.assert(outlines[part.name], `Field "${name}.name" does not name an existing outline!`)
                    arg = u.deepcopy(outlines[part.name])
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