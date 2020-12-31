const u = require('./utils')
const a = require('./assert')
const Point = require('./point')

const anchor = module.exports = (raw, name, points={}, check_unexpected=true, default_point=new Point()) => units => {
    if (a.type(raw) == 'array') {
        // recursive call with incremental default_point mods, according to `affect`s
        let current = () => default_point.clone()
        for (const step of raw) {
            current = anchor(step, name, points, check_unexpected, current(units))
        }
        return current
    }
    if (check_unexpected) a.detect_unexpected(raw, name, ['ref', 'orient', 'shift', 'rotate', 'affect'])
    let point = default_point.clone()
    if (raw.ref !== undefined) {
        if (a.type(raw.ref) == 'array') {
            // averaging multiple anchors
            let x = 0, y = 0, r = 0
            const len = raw.ref.length
            for (const ref of raw.ref) {
                a.assert(points[ref], `Unknown point reference "${ref}" in anchor "${name}"!`)
                const resolved = points[ref]
                x += resolved.x
                y += resolved.y
                r += resolved.r
            }
            point = new Point(x / len, y / len, r / len)
        } else {
            a.assert(points[raw.ref], `Unknown point reference "${raw.ref}" in anchor "${name}"!`)
            point = points[raw.ref].clone()
        }
    }
    if (raw.orient !== undefined) {
        point.r += a.sane(raw.orient || 0, `${name}.orient`, 'number')(units)
    }
    if (raw.shift !== undefined) {
        let xyval = a.wh(raw.shift || [0, 0], `${name}.shift`)(units)
        if (point.meta.mirrored) {
            xyval[0] = -xyval[0]
        }
        point.shift(xyval, true)
    }
    if (raw.rotate !== undefined) {
        point.r += a.sane(raw.rotate || 0, `${name}.rotate`, 'number')(units)
    }
    if (raw.affect !== undefined) {
        const candidate = point
        point = default_point.clone()
        const valid_affects = ['x', 'y', 'r']
        let affect = raw.affect || valid_affects
        if (a.type(affect) == 'string') affect = affect.split('')
        affect = a.strarr(affect, `${name}.affect`)
        let i = 0
        for (const a of affect) {
            a._in(a, `${name}.affect[${++i}]`, valid_affects)
            point[a] = candidate[a]
        }
    }
    return point
}