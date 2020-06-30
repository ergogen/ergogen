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

exports.in = (raw, name, arr) => {
    assert(arr.includes(raw), `Field "${name}" should be one of [${arr.join(', ')}]!`)
    return raw
}

const numarr = exports.numarr = (raw, name, length) => {
    assert(type(raw) == 'array' && raw.length == length, `Field "${name}" should be an array of length ${length}!`)
    raw = raw.map(val => val || 0)
    raw.map(val => assert(type(val) == 'number', `Field "${name}" should contain numbers!`))
    return raw
}

const xy = exports.xy = (raw, name) => numarr(raw, name, 2)

exports.wh = (raw, name) => {
    if (!Array.isArray(raw)) raw = [raw, raw]
    return a.xy(raw, name)
}

exports.trbl = (raw, name) => {
    if (!Array.isArray(raw)) raw = [raw, raw, raw, raw]
    if (raw.length == 2) raw = [raw[1], raw[0], raw[1], raw[0]]
    return numarr(raw, name, 4)
}

exports.anchor = (raw, name, points={}, check_unexpected=true) => {
    if (check_unexpected) detect_unexpected(raw, name, ['ref', 'shift', 'rotate'])
    let a = new Point()
    if (raw.ref !== undefined) {
        assert(points[raw.ref], `Unknown point reference "${raw.ref}" in anchor "${name}"!`)
        a = points[raw.ref].clone()
    }
    if (raw.shift !== undefined) {
        const xyval = xy(raw.shift, name + '.shift')
        a.x += xyval[0]
        a.y += xyval[1]
    }
    if (raw.rotate !== undefined) {
        a.r += sane(raw.rotate || 0, name + '.rotate', 'number')
    }
    return a
}