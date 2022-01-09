const u = require('./utils')
const a = require('./assert')
const Point = require('./point')

const mirror_ref = exports.mirror = (ref, mirror=true) => {
    if (mirror) {
        if (ref.startsWith('mirror_')) {
            return ref.substring(7)
        }
        return 'mirror_' + ref
    }
    return ref
}

const anchor = exports.parse = (raw, name, points={}, check_unexpected=true, default_point=new Point(), mirror=false) => units => {
    if (a.type(raw)() == 'array') {
        // recursive call with incremental default_point mods, according to `affect`s
        let current = default_point.clone()
        for (const step of raw) {
            current = anchor(step, name, points, check_unexpected, current, mirror)(units)
        }
        return current
    }
    if (check_unexpected) a.unexpected(raw, name, ['ref', 'orient', 'shift', 'rotate', 'affect'])
    let point = default_point.clone()
    if (raw.ref !== undefined) {
        if (a.type(raw.ref)() == 'array') {
            // averaging multiple anchors
            let x = 0, y = 0, r = 0
            const len = raw.ref.length
            for (const ref of raw.ref) {
                const parsed_ref = mirror_ref(ref, mirror)
                a.assert(points[parsed_ref], `Unknown point reference "${parsed_ref}" in anchor "${name}"!`)
                const resolved = points[parsed_ref]
                x += resolved.x
                y += resolved.y
                r += resolved.r
            }
            point = new Point(x / len, y / len, r / len)
        } else {
            const parsed_ref = mirror_ref(raw.ref, mirror)
            a.assert(points[parsed_ref], `Unknown point reference "${parsed_ref}" in anchor "${name}"!`)
            point = points[parsed_ref].clone()
        }
    }
    if (raw.orient !== undefined) {
        let angle = a.sane(raw.orient, `${name}.orient`, 'number')(units)
        if (point.meta.mirrored) {
            angle = -angle
        } 
        point.r += angle
    }
    if (raw.shift !== undefined) {
        let xyval = a.wh(raw.shift, `${name}.shift`)(units)
        if (point.meta.mirrored) {
            xyval[0] = -xyval[0]
        }
        point.shift(xyval, true)
    }
    if (raw.rotate !== undefined) {
        let angle = a.sane(raw.rotate, `${name}.rotate`, 'number')(units)
        if (point.meta.mirrored) {
            angle = -angle
        } 
        point.r += angle
    }
    if (raw.affect !== undefined) {
        const candidate = point.clone()
        point = default_point.clone()
        point.meta = candidate.meta
        let affect = raw.affect
        if (a.type(affect)() == 'string') affect = affect.split('')
        affect = a.strarr(affect, `${name}.affect`)
        let i = 0
        for (const aff of affect) {
            a.in(aff, `${name}.affect[${++i}]`, ['x', 'y', 'r'])
            point[aff] = candidate[aff]
        }
    }
    return point
}