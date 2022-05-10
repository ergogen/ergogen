const a = require('./assert')
const prep = require('./prepare')

const default_units = {
    U: 19.05,
    u: 19,
    cx: 18,
    cy: 17
}

exports.parse = (config = {}) => {
    const raw_units = prep.extend(
        default_units,
        a.sane(config.units || {}, 'units', 'object')(),
        a.sane(config.variables || {}, 'variables', 'object')()
    )
    const units = {}
    for (const [key, val] of Object.entries(raw_units)) {
        units[key] = a.mathnum(val)(units)
    }
    return units
}