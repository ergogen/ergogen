const u = require('./utils')
const a = require('./assert')
const anchor_lib = require('./anchor')
const Point = require('./point')
const anchor = anchor_lib.parse

const _true = () => true
const _false = () => false
const _and = arr => p => arr.map(e => e(p)).reduce((a, b) => a && b)
const _or = arr => p => arr.map(e => e(p)).reduce((a, b) => a || b)

const similar = (keys, reference, name, units) => {
    let neg = false
    if (reference.startsWith('-')) {
        neg = true
        reference = reference.slice(1)
    }

    // support both string or regex as reference
    let internal_tester = val => (''+val) == reference
    if (reference.startsWith('/')) {
        try {
            const regex_parts = reference.split('/')
            regex_parts.shift() // remove starting slash
            const flags = regex_parts.pop()
            const regex = new RegExp(regex_parts.join('/'), flags)
            internal_tester = val => regex.test(''+val)
        } catch (ex) {
            throw new Error(`Invalid regex "${reference}" found at filter "${name}"!`)
        }
    }

    // support strings, arrays, or objects as key
    const external_tester = (point, key) => {
        const value = u.deep(point, key)
        if (a.type(value)() == 'array') {
            return value.some(subkey => internal_tester(subkey))
        } else if (a.type(value)() == 'object') {
            return Object.keys(value).some(subkey => internal_tester(subkey))
        } else {
            return internal_tester(value)
        }
    }

    // consider negation
    if (neg) {
        return point => keys.every(key => !external_tester(point, key))
    } else {
        return point => keys.some(key => external_tester(point, key))
    }
}

const comparators = {
    '~': similar
    // TODO: extension point for other operators...
}
const symbols = Object.keys(comparators)

const simple = (exp, name, units) => {

    let keys = ['meta.name', 'meta.tags']
    let op = '~'
    let value
    const parts = exp.split(/\s+/g)

    // full case
    if (symbols.includes(parts[1])) {
        keys = parts[0].split(',')
        op = parts[1]
        value = parts.slice(2).join(' ')
    
    // middle case, just an operator spec, default "keys"
    } else if (symbols.includes(parts[0])) {
        op = parts[0]
        value = parts.slice(1).join(' ')

    // basic case, only "value"
    } else {
        value = exp
    }

    return point => comparators[op](keys, value, name, units)(point)
}

const complex = (config, name, units, aggregator=_or) => {

    // we branch by type
    const type = a.type(config)(units)
    switch(type) {

        // boolean --> either all or nothing
        case 'boolean':
            return config ? _true : _false
 
        // string --> base case, meaning a simple/single filter
        case 'string':
            return simple(config, name, units)
        
        // array --> aggregated simple filters with alternating and/or conditions
        case 'array':
            const alternate = aggregator == _and ? _or : _and
            return aggregator(config.map(elem => complex(elem, name, units, alternate)))

        default:
            throw new Error(`Unexpected type "${type}" found at filter "${name}"!`)
    }
}

const contains_object = (val) => {
    if (a.type(val)() == 'object') return true
    if (a.type(val)() == 'array') return val.some(el => contains_object(el))
    return false
}

exports.parse = (config, name, points={}, units={}, asym='source') => {

    let result = []

    // if a filter decl is undefined, it's just the default point at [0, 0]
    if (config === undefined) {
        result.push(new Point())

    // if a filter decl is an object, or an array that contains an object at any depth, it is an anchor
    } else if (contains_object(config)) {
        if (['source', 'both'].includes(asym)) {
            result.push(anchor(config, name, points)(units))
        }
        if (['clone', 'both'].includes(asym)) {
            // this is strict: if the ref of the anchor doesn't have a mirror pair, it will error out
            // also, we check for duplicates as ref-less anchors mirror to themselves
            const clone = anchor(config, name, points, undefined, true)(units)
            if (result.every(p => !p.equals(clone))) {
                result.push(clone)
            }
        }
        
    // otherwise, it is treated as a condition to filter all available points
    } else {
        const source = Object.values(points).filter(complex(config, name, units))
        if (['source', 'both'].includes(asym)) {
            result = result.concat(source)
        }
        if (['clone', 'both'].includes(asym)) {
            // this is permissive: we only include mirrored versions if they exist, and don't fuss if they don't
            // also, we check for duplicates as clones can potentially refer back to their sources, too
            const pool = result.map(p => p.meta.name)
            result = result.concat(
                source.map(p => points[anchor_lib.mirror(p.meta.name)])
                .filter(p => !!p)
                .filter(p => !pool.includes(p.meta.name))
            )
        }
    }

    return result
}