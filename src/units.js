const a = require('./assert')
const prep = require('./prepare')

const default_units = {
    U: 19.05,
    u: 19,
    cx: 18,
    cy: 17,
    $default_stagger: 0,
    $default_spread: 'u',
    $default_splay: 0,
    $default_height: 'u-1',
    $default_width: 'u-1',
    $default_padding: 'u',
    $default_autobind: 10
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