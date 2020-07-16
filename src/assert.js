const m = require('makerjs')
const u = require('./utils')
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

const wh = exports.wh = (raw, name) => {
    if (!Array.isArray(raw)) raw = [raw, raw]
    return xy(raw, name)
}

exports.trbl = (raw, name) => {
    if (!Array.isArray(raw)) raw = [raw, raw, raw, raw]
    if (raw.length == 2) raw = [raw[1], raw[0], raw[1], raw[0]]
    return numarr(raw, name, 4)
}

exports.anchor = (raw, name, points={}, check_unexpected=true, default_point=new Point()) => {
    if (check_unexpected) detect_unexpected(raw, name, ['ref', 'shift', 'rotate'])
    let point = default_point.clone()
    if (raw.ref !== undefined) {
        if (type(raw.ref) == 'array') {
            // averaging multiple anchors
            let x = 0, y = 0, r = 0
            const len = raw.ref.length
            for (const ref of raw.ref) {
                assert(points[ref], `Unknown point reference "${ref}" in anchor "${name}"!`)
                const resolved = points[ref]
                x += resolved.x
                y += resolved.y
                r += resolved.r
            }
            point = new Point(x / len, y / len, r / len)
        } else {
            assert(points[raw.ref], `Unknown point reference "${raw.ref}" in anchor "${name}"!`)
            point = points[raw.ref].clone()
        }
    }
    if (raw.shift !== undefined) {
        let xyval = wh(raw.shift || [0, 0], name + '.shift')
        if (point.meta.mirrored) {
            xyval[0] = -xyval[0]
        }
        point.shift(xyval, true)
    }
    if (raw.rotate !== undefined) {
        point.r += sane(raw.rotate || 0, name + '.rotate', 'number')
    }
    return point
}

const extend_pair = exports.extend_pair = (to, from) => {
    const to_type = type(to)
    const from_type = type(from)
    if (from === undefined || from === null) return to
    if (from === '!!unset') return undefined
    if (to_type != from_type) return from
    if (from_type == 'object') {
        const res = u.deepcopy(to)
        for (const key of Object.keys(from)) {
            res[key] = extend_pair(to[key], from[key])
        }
        return res
    } else if (from_type == 'array') {
        const res = u.deepcopy(to)
        for (const [i, val] of from.entries()) {
            res[i] = extend_pair(res[i], val)
        }
        return res
    } else return from
}

exports.extend = (...args) => {
    let res = args[0]
    for (const arg of args) {
        if (res == arg) continue
        res = extend_pair(res, arg)
    }
    return res
}

const inherit = exports.inherit = (config, name_prefix, name, set) => {
    let result = u.deepcopy(config)
    if (config.extends !== undefined) {
        let list = config.extends
        if (type(list) !== 'array') list = [list]
        for (const item of list) {
            const other = set[item]
            assert(other, `Field "${name_prefix}.${name}" does not name a valid target!`)
            result = extend_pair(inherit(other, name_prefix, config.extends, set), result)

        }
        delete result.extends
    }
    return result
}