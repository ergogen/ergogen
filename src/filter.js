const u = require('./utils')
const a = require('./assert')
const anchor = require('./anchor').parse

const _true = () => true
const _and = arr => p => arr.map(e => e(p)).reduce((a, b) => a && b)
const _or = arr => p => arr.map(e => e(p)).reduce((a, b) => a || b)

const similar = (key, reference, name, units) => {
    let neg = false

    if (reference.startsWith('-')) {
        neg = true
        reference = reference.slice(1)
    }

    // support both string or regex as reference
    let internal_tester = val => (''+val) == reference
    if (reference.startsWith('/')) {
        const regex_parts = reference.split('/')
        regex_parts.shift() // remove starting slash
        const flags = regex_parts.pop()
        const regex = new RegExp(regex_parts.join('/'), flags)
        internal_tester = val => regex.test(''+val)
    }

    // support strings, arrays, or objects as key
    const external_tester = point => {
        const value = u.deep(point, key)
        if (a.type(value)() == 'array') {
            return value.some(subkey => internal_tester(subkey))
        } else if (a.type(value)() == 'object') {
            return Object.keys(value).some(subkey => internal_tester(subkey))
        } else {
            return internal_tester(value)
        }
    }

    // negation happens at the end
    if (neg) {
        return point => !external_tester(point)
    }
    return external_tester
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

    return point => keys.some(key => comparators[op](key, value, name, units)(point))
}

const complex = (config, name, units, aggregator=_or) => {

    // default is all points
    if (config === undefined) {
        return _true
    }

    // otherwise we branch by type
    const type = a.type(config)()
    switch(type) {
 
        // base case is a string, meaning a simple/single filter
        case 'string':
            return simple(config, name, units)
        
        // arrays are aggregated with alternating and/or conditions
        case 'array':
            const alternate = aggregator == _and ? _or : _and
            return aggregator(config.map(elem => complex(elem, name, units, alternate)))

        default:
            throw new Error(`Unexpected type "${type}" found at filter "${name}"!`)
    }
}

exports.parse = (config, name, points={}, units={}) => {
    
    // if a filter decl is an object, it is an anchor
    if (a.type(config)() == 'object') {
        return [anchor(config, name, points)(units)]
    }

    // otherwise, it is treated as a condition to filter all available points
    return Object.values(points).filter(complex(config, name, units))
}