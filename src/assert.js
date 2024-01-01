import m from 'makerjs'
import * as mathjs from 'mathjs'
import * as u from './utils.js'
import Point from './point.js'

export const mathnum = raw => units => {
    return mathjs.evaluate(`${raw}`, units || {})
}

export const assert = (exp, msg) => {
    if (!exp) {
        throw new Error(msg)
    }
}

export const type = val => units => {
    if (Array.isArray(val)) return 'array'
    if (val === null) return 'null'
    try {
        const num = mathnum(val)(units)
        if (typeof num === 'number') return 'number'
    } catch (err) {}
    return typeof val
}

export const sane = (val, name, _type) => units => {
    assert(type(val)(units) == _type, `Field "${name}" should be of type ${_type}!`)
    if (_type == 'number') return mathnum(val)(units)
    return val
}

export const unexpected = (obj, name, expected) => {
    const sane_obj = sane(obj, name, 'object')()
    for (const key of Object.keys(sane_obj)) {
        assert(expected.includes(key), `Unexpected key "${key}" within field "${name}"!`)
    }
}

const _in = (raw, name, arr) => {
    assert(arr.includes(raw), `Field "${name}" should be one of [${arr.join(', ')}]!`)
    return raw
}
export { _in as in }

export const arr = (raw, name, length, _type, _default) => units => {
    assert(type(raw)(units) == 'array', `Field "${name}" should be an array!`)
    assert(length == 0 || raw.length == length, `Field "${name}" should be an array of length ${length}!`)
    raw = raw.map(val => val === undefined ? _default : val)
    raw.map(val => assert(type(val)(units) == _type, `Field "${name}" should contain ${_type}s!`))
    if (_type == 'number') {
        raw = raw.map(val => mathnum(val)(units))
    }
    return raw
}

export const numarr = (raw, name, length) => units => arr(raw, name, length, 'number', 0)(units)
export const strarr = (raw, name) => arr(raw, name, 0, 'string', '')()

export const xy = (raw, name) => units => numarr(raw, name, 2)(units)

export const wh = (raw, name) => units => {
    if (!Array.isArray(raw)) raw = [raw, raw]
    return xy(raw, name)(units)
}

export const trbl = (raw, name, _default=0) => units => {
    if (!Array.isArray(raw)) raw = [raw, raw, raw, raw]
    if (raw.length == 2) raw = [raw[1], raw[0], raw[1], raw[0]]
    return arr(raw, name, 4, 'number', _default)(units)
}

export const asym = (raw, name) => {
    // allow different aliases
    const source_aliases = ['source', 'origin', 'base', 'primary', 'left']
    const clone_aliases = ['clone', 'image', 'derived', 'secondary', 'right']
    _in(raw, name, ['both'].concat(source_aliases, clone_aliases))
    // return aliases to canonical names
    if (source_aliases.includes(raw)) return 'source'
    if (clone_aliases.includes(raw)) return 'clone'
    return raw
}
