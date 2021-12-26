const u = require('./utils')
const a = require('./assert')
const anchor = require('./anchor').parse

const _true = () => true
const _and = arr => p => arr.map(e => e(p)).reduce((a, b) => a && b)
const _or = arr => p => arr.map(e => e(p)).reduce((a, b) => a || b)

const similar = (a, b, name, units) => {
    let neg = false

    if (b.startsWith('-')) {
        neg = true
        b = b.slice(1)
    }

    if (b.startsWith('/')) {
        //...
    }
}

const comparators = {
    '~': similar
    // TODO: extension point for other operators...
}
const symbols = Object.keys(comparators)

const simple = (exp, name, units) => {

    let a = ['meta.name', 'meta.tags']
    let op = '~'
    let b
    const parts = exp.split(/\s+/g)

    // full case
    if (symbols.includes(parts[1])) {
        a = parts[0].split(',')
        op = parts[1]
        b = parts.slice(2).join(' ')
    
    // middle case, just an operator spec, default "a"
    } else if (symbols.includes(parts[0])) {
        op = parts[0]
        b = parts.slice(1).join(' ')

    // basic case, only "b"
    } else {
        b = exp
    }

    return comparators[op](a, b, name, units)
}

const complex = (config, name, units, aggregator=_and) => {

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
    
    if (a.type(config)() == 'object') {
        return [anchor(config, name, points)(units)]
    }

    return Object.values(points).filter(complex(config, name, units))
}