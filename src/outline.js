const m = require('makerjs')
const u = require('./utils')
const a = require('./assert')

const rectangle = (w, h, corner, bevel, name='') => {
    const error = (dim, val) => `Rectangle for "${name}" isn't ${dim} enough for its corner and bevel (${val} - ${corner} - ${bevel} <= 0)!`
    const cw = w - corner - bevel
    a.assert(cw >= 0, error('wide', w))
    ch = h - corner - bevel
    a.assert(ch >= 0, error('tall', h))

    let res = m.models.Rectangle(w, h)
    res = m.model.outline(res, bevel, 2)
    res = m.model.outline(res, corner, 0)
    return m.model.moveRelative(res, [corner + bevel, corner + bevel])
}

const parse_glue = exports._parse_glue = (config = {}, points = {}) => {

    a.detect_unexpected(config, 'outline.glue', ['top', 'bottom', 'waypoints', 'extra'])

    for (const y in ['top', 'bottom']) {
        a.detect_unexpected(config[y], `outline.glue.${y}`, ['left', 'right'])
        config[y].left = a.anchor(config[y].left, `outline.glue.${y}.left`, points)
        if (a.type(config[y].right) != 'number') {
            config[y].right = a.anchor(config[y].right, `outline.glue.${y}.right`, points)
        }
    }

    config.waypoints = a.sane(config.waypoints || [], 'outline.glue.waypoints', 'array')
    let wi = 0
    config.waypoints = config.waypoints.map(w => {
        const name = `outline.glue.waypoints[${++wi}]`
        a.detect_unexpected(w, name, ['percent', 'width'])
        w.percent = a.sane(w.percent, name + '.percent', 'number')
        w.width = a.wh(w.width, name + '.width')
        return w
    })

    // TODO: handle glue.extra (or revoke it from the docs)

    return (export_name, params) => {

        a.detect_unexpected(params, `${export_name}`, ['side', 'size', 'corner', 'bevel'])
        const side = a.in(params.side, `${export_name}.side`, ['left', 'right', 'middle', 'both', 'glue'])
        const size = a.wh(params.size, `${export_name}.size`)
        const corner = a.sane(params.corner || 0, `${export_name}.corner`, 'number')
        const bevel = a.sane(params.bevel || 0, `${export_name}.bevel`, 'number')

        let left = {paths: {}}
        let right = {paths: {}}
        if (['left', 'right', 'middle', 'both'].includes(params.side)) {
            for (const [pname, p] of Object.entries(points)) {

                let from_x = -size[0] / 2, to_x = size[0] / 2
                let from_y = -size[1] / 2, to_y = size[1] / 2

                let bind = a.trbl(p.meta.bind || 0, `${pname}.bind`)
                // if it's a mirrored key, we swap the left and right bind values
                if (p.meta.mirrored) {
                    bind = [bind[0], bind[3], bind[2], bind[1]]
                }

                from_x -= bind[3]
                to_x += bind[1]

                from_y -= bind[2]
                to_y += bind[0]

                let rect = rectangle(to_x - from_x, to_y - from_y, corner, bevel, `${export_name}.size`)
                rect = m.model.move(rect, [from_x, from_y])
                rect = p.position(rect)
                if (p.meta.mirrored) {
                    right = m.model.combineUnion(right, rect)
                } else {
                    left = m.model.combineUnion(left, rect)
                }
            }
        }
        if (params.side == 'left') return left
        if (params.side == 'right') return right

        let glue = {paths: {}}
        if (['middle', 'both', 'glue'].includes(params.side)) {

            const get_line = (anchor) => {
                if (a.type(anchor) == 'number') {
                    return u.line([anchor, -1000], [anchor, 1000])
                }
    
                let from = anchor.clone()
                let to = anchor.add([anchor.meta.mirrored ? -1 : 1, 0])
                to = to.rotate(anchor.r, anchor.p).p

                return u.line(from, to)
            }
    
            const tll = get_line(config.top.left)
            const trl = get_line(config.top.right)
            const tip = m.path.converge(tll, trl)
            const tlp = u.eq(tll.origin, tip) ? tll.end : tll.origin
            const trp = u.eq(trl.origin, tip) ? trl.end : trl.origin
    
            const bll = get_line(config.bottom.left)
            const brl = get_line(config.bottom.right)
            const bip = m.path.converge(bll, brl)
            const blp = u.eq(bll.origin, bip) ? bll.end : bll.origin
            const brp = u.eq(brl.origin, bip) ? brl.end : brl.origin
    
            const left_waypoints = []
            const right_waypoints = []
    
            for (const w of config.waypoints) {
                const percent = w.percent / 100
                const center_x = tip[0] + percent * (bip[0] - tip[0])
                const center_y = tip[1] + percent * (bip[1] - tip[1])
                const left_x = center_x - (w.left || w.width / 2)
                const right_x = center_x + (w.right || w.width / 2)
                left_waypoints.push([left_x, center_y])
                right_waypoints.unshift([right_x, center_y])
            }
            
            let waypoints
            const is_split = a.type(config.top.right) == 'number'
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
        if (params.side == 'glue') return glue

        let both = m.model.combineUnion(u.deepcopy(left), glue)
        both = m.model.combineUnion(both, u.deepcopy(right))
        if (params.side == 'both') return both

        let middle = m.model.combineSubtraction(both, left)
        middle = m.model.combineSubtraction(both, right)
        return middle
    }
}

exports.parse = (config = {}, points = {}) => {
    a.detect_unexpected(config, 'outline', ['glue', 'exports'])
    const glue = parse_glue(config.glue, points)

    config = a.sane(config, 'outline.exports', 'object')
    for (const [key, parts] of Object.entries(config)) {
        let index = 0
        for (const part of parts) {
            const name = `outline.exports.${key}[${++index}]`
            part.op = a.in(part.op || 'add', `${name}.op`, ['add', 'sub', 'diff'])
            part.type = a.in(part.type, `${name}.type`, ['keys', 'rectangle', 'circle', 'polygon', 'ref'])

        }
    }
}