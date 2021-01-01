const u = require('./utils')
const a = require('./assert')

const unnest = exports.unnest = (config) => {
    if (a.type(config)() !== 'object') return config
    const result = {}
    for (const [key, val] of Object.entries(config)) {
        u.deep(result, key, unnest(val))
    }
    return result
}

const _extend = exports._extend = (to, from) => {
    const to_type = a.type(to)()
    const from_type = a.type(from)()
    if (from === undefined || from === null) return to
    if (from === '!!unset') return undefined
    if (to_type != from_type) return from
    if (from_type == 'object') {
        const res = u.deepcopy(to)
        for (const key of Object.keys(from)) {
            res[key] = _extend(to[key], from[key])
            if (res[key] === undefined) delete res[key]
        }
        return res
    } else if (from_type == 'array') {
        const res = u.deepcopy(to)
        for (const [i, val] of from.entries()) {
            res[i] = _extend(res[i], val)
        }
        return res
    } else return from
}

const extend = exports.extend = (...args) => {
    let res = args[0]
    for (const arg of args) {
        if (res == arg) continue
        res = _extend(res, arg)
    }
    return res
}

const _inherit = exports._inherit = (config, root, breadcrumbs) => {
    if (a.type(config)() !== 'object') return config
    const result = {}
    for (const [key, val] of Object.entries(config)) {
        breadcrumbs.push(key)
        let newval = _inherit(val, root, breadcrumbs)
        if (newval && newval.extends !== undefined) {
            let candidates = u.deepcopy(newval.extends)
            if (a.type(candidates)() !== 'array') candidates = [candidates]
            const list = [newval]
            while (candidates.length) {
                const path = candidates.shift()
                const other = u.deepcopy(u.deep(root, path))
                a.assert(other, `"${path}" (reached from "${breadcrumbs.join('.')}.extends") does not name a valid inheritance target!`)
                let parents = other.extends || []
                if (a.type(parents)() !== 'array') parents = [parents]
                candidates = candidates.concat(parents)
                list.unshift(other)
            }
            newval = extend.apply(this, list)
            delete newval.extends
        }
        result[key] = newval
        breadcrumbs.pop()
    }
    return result
}

const inherit = exports.inherit = (config) => _inherit(config, config, [])
