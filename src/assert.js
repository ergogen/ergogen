const Point = require('./point')

const assert = exports.assert = (exp, msg) => {
    if (!exp) {
        throw new Error(msg)
    }
}

const type = exports.type = (val) => {
    if (Array.isArray(val)) return 'array'
    if (val === null) return 'null'
    return typeof val
}

const sane = exports.sane = (val, name, _type) => {
    assert(type(val) == _type, `Field "${name}" should be of type ${_type}!`)
    return val
}

const detect_unexpected = exports.detect_unexpected = (obj, name, expected) => {
    const sane_obj = sane(obj, name, 'object')
    for (const key of Object.keys(sane_obj)) {
        assert(expected.includes(key), `Unexpected key "${key}" within field "${name}"!`)
    }
}

const xy = exports.xy = (raw, name) => {
    assert(type(raw) == 'array' && raw.length == 2, `Field "${name}" should be an array of length 2!`)
    const x = raw[0] || 0
    const y = raw[1] || 0
    assert(type(x) == 'number' && type(y) == 'number', `Field "${name}" should contain numbers!`)
    return {x, y}
}

exports.anchor = (raw, name, points={}) => {
    detect_unexpected(raw, name, ['ref', 'shift', 'rotate'])
    let a = new Point()
    if (raw.ref !== undefined) {
        assert(points[raw.ref], `Unknown point reference "${raw.ref}" in anchor "${name}"!`)
        a = points[raw.ref].clone()
    }
    if (raw.shift !== undefined) {
        const xyval = xy(raw.shift, name + '.shift')
        a.x += xyval.x
        a.y += xyval.y
    }
    if (raw.rotate !== undefined) {
        a.r += sane(raw.rotate || 0, name + '.rotate', 'number')
    }
    return a
}