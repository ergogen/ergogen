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

const aggregator_common = ['parts', 'method']

const aggregators = {
    average: (config, name, parts) => {
        a.unexpected(config, name, aggregator_common)
        let x = 0, y = 0, r = 0
        const len = parts.length
        for (const part of parts) {
            x += part.x
            y += part.y
            r += part.r
        }
        return new Point(x / len, y / len, r / len)
    }
}

const anchor = exports.parse = (raw, name, points={}, default_point=new Point(), mirror=false) => units => {

    //
    // Anchor type handling
    //

    if (a.type(raw)() == 'string') {
        raw = {ref: raw}
    }

    else if (a.type(raw)() == 'array') {
        // recursive call with incremental default_point mods, according to `affect`s
        let current = default_point.clone()
        let index = 1
        for (const step of raw) {
            current = anchor(step, `${name}[${index++}]`, points, current, mirror)(units)
        }
        return current
    }

    a.unexpected(raw, name, ['ref', 'aggregate', 'orient', 'shift', 'rotate', 'affect'])

    //
    // Reference or aggregate handling
    //
    
    let point = default_point.clone()
    if (raw.ref !== undefined && raw.aggregate !== undefined) {
        throw new Error(`Fields "ref" and "aggregate" cannot appear together in anchor "${name}"!`)
    }

    if (raw.ref !== undefined) {
        // base case, resolve directly
        if (a.type(raw.ref)() == 'string') {
            const parsed_ref = mirror_ref(raw.ref, mirror)
            a.assert(points[parsed_ref], `Unknown point reference "${parsed_ref}" in anchor "${name}"!`)
            point = points[parsed_ref].clone()
        // recursive case
        } else {
            point = anchor(raw.ref, `${name}.ref`, points, default_point, mirror)(units)
        }
        
    }

    if (raw.aggregate !== undefined) {
        raw.aggregate = a.sane(raw.aggregate, `${name}.aggregate`, 'object')()
        raw.aggregate.method = a.sane(raw.aggregate.method || 'average', `${name}.aggregate.method`, 'string')()
        a.assert(aggregators[raw.aggregate.method], `Unknown aggregator method "${raw.aggregate.method}" in anchor "${name}"!`)
        raw.aggregate.parts = a.sane(raw.aggregate.parts || [], `${name}.aggregate.parts`, 'array')()

        const parts = []
        let index = 1
        for (const part of raw.aggregate.parts) {
            parts.push(anchor(part, `${name}.aggregate.parts[${index++}]`, points, default_point, mirror)(units))
        }

        point = aggregators[raw.aggregate.method](raw.aggregate, `${name}.aggregate`, parts)
    }

    //
    // Actual orient/shift/rotate/affect handling
    //

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