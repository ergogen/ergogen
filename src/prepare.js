const u = require('./utils')
const a = require('./assert')

const _extend = exports._extend = (to, from) => {
    const to_type = a.type(to)()
    const from_type = a.type(from)()
    if (from === undefined || from === null) return to
    if (from === '$unset') return undefined
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

const traverse = exports.traverse = (config, root, breadcrumbs, op) => {
    if (a.type(config)() == 'object') {
        const result = {}
        for (const [key, val] of Object.entries(config)) {
            breadcrumbs.push(key)
            op(result, key, traverse(val, root, breadcrumbs, op), root, breadcrumbs)
            breadcrumbs.pop()
        }
        return result
    } else if (a.type(config)() == 'array') {
        // needed so that arrays can set output the same way as objects within ops
        const dummy = {}
        const result = []
        let index = 0
        for (const val of config) {
            breadcrumbs.push(`[${index}]`)
            op(dummy, 'dummykey', traverse(val, root, breadcrumbs, op), root, breadcrumbs)
            result[index] = dummy.dummykey
            breadcrumbs.pop()
            index++
        }
        return result
    }
    return config
}

exports.unnest = config => traverse(config, config, [], (target, key, val) => {
    u.deep(target, key, val)
})

exports.inherit = config => {
    const cache = new Map()
    const stack = []

    const resolve = (val, breadcrumbs) => {
        const type = a.type(val)()
        if (type !== 'object' && type !== 'array') return val
        if (cache.has(val)) return cache.get(val)

        a.assert(!stack.includes(val), `"${breadcrumbs.join('.')}" leads to a circular dependency!`)

        stack.push(val)
        let res
        if (type === 'object') {
            let current = val
            if (val.$extends !== undefined) {
                let candidates = val.$extends
                if (a.type(candidates)() !== 'array') candidates = [candidates]
                const list = []
                for (const path of candidates) {
                    const other = u.deep(config, path)
                    a.assert(other, `"${path}" (reached from "${breadcrumbs.join('.')}.$extends") does not name a valid inheritance target!`)
                    list.push(resolve(other, path.split('.')))
                }
                const own = u.deepcopy(val)
                delete own.$extends

                if (list.length === 1 && Object.keys(own).length === 0) {
                    current = list[0]
                } else {
                    list.push(own)
                    current = extend.apply(null, list)
                }
            }

            const current_type = a.type(current)()
            if (current_type === 'object') {
                res = {}
                for (const [k, v] of Object.entries(current)) {
                    res[k] = resolve(v, [...breadcrumbs, k])
                }
            } else if (current_type === 'array') {
                res = []
                for (let i = 0; i < current.length; i++) {
                    res[i] = resolve(current[i], [...breadcrumbs, `[${i}]`])
                }
            } else {
                res = current
            }
        } else { // array
            res = []
            for (let i = 0; i < val.length; i++) {
                res[i] = resolve(val[i], [...breadcrumbs, `[${i}]`])
            }
        }
        stack.pop()
        cache.set(val, res)
        return res
    }

    return resolve(config, [])
}

exports.parameterize = config => traverse(config, config, [], (target, key, val, root, breadcrumbs) => {

    // we only care about objects
    if (a.type(val)() !== 'object') {
        target[key] = val
        return 
    }

    let params = val.$params
    let args = val.$args

    // explicitly skipped (probably intermediate) template, remove (by not setting it)
    if (val.$skip) return

    // nothing to do here, just pass the original value through
    if (!params && !args) {
        target[key] = val
        return
    }

    // unused template, remove (by not setting it)
    if (params && !args) return

    if (!params && args) {
        throw new Error(`Trying to parameterize through "${breadcrumbs}.$args", but the corresponding "$params" field is missing!`)
    }

    params = a.strarr(params, `${breadcrumbs}.$params`)
    args = a.sane(args, `${breadcrumbs}.$args`, 'array')()
    if (params.length !== args.length) {
        throw new Error(`The number of "$params" and "$args" don't match for "${breadcrumbs}"!`)
    }

    let str = JSON.stringify(val)
    const zip = rows => rows[0].map((_, i) => rows.map(row => row[i]))
    for (const [par, arg] of zip([params, args])) {
        str = str.replace(new RegExp(`${par}`, 'g'), arg)
    }
    try {
        val = JSON.parse(str)
    } catch (ex) {
        throw new Error(`Replacements didn't lead to a valid JSON object at "${breadcrumbs}"! ` + ex)
    }

    delete val.$params
    delete val.$args
    target[key] = val
})

const parseArgs = (inner) => {
    const args = []
    let current = ''
    let depth = 0
    let inQuote = false
    let quoteChar = ''
    for (let i = 0; i < inner.length; i++) {
        const char = inner[i]
        if ((char === '"' || char === "'") && (i === 0 || inner[i-1] !== '\\')) {
            if (!inQuote) {
                inQuote = true
                quoteChar = char
                current += char
            } else if (char === quoteChar) {
                inQuote = false
                current += char
            } else {
                current += char
            }
        } else if (!inQuote && char === '(') {
            depth++
            current += char
        } else if (!inQuote && char === ')') {
            depth--
            current += char
        } else if (!inQuote && char === ',' && depth === 0) {
            args.push(current.trim())
            current = ''
        } else {
            current += char
        }
    }
    if (current.trim().length > 0 || inner.length === 0) {
        args.push(current.trim())
    }
    return args
}

const resolve = (val, root, breadcrumbs, seen = new Set()) => {
    if (a.type(val)() !== 'string') return val
    if (!val.startsWith('$concat(') || !val.endsWith(')')) return val

    if (seen.has(val)) {
        throw new Error(`Circular dependency detected in $concat at "${breadcrumbs.join('.')}": ${val}`)
    }
    seen.add(val)

    const inner = val.substring(8, val.length - 1)
    const args = parseArgs(inner)

    const res = args
        .filter(arg => arg.length > 0)
        .map(arg => {
            // String literal
            if ((arg.startsWith('"') && arg.endsWith('"')) || (arg.startsWith("'") && arg.endsWith("'"))) {
                return arg.substring(1, arg.length - 1).replace(/\\(.)/g, '$1')
            }
            // $concat call
            if (arg.startsWith('$concat(')) {
                return resolve(arg, root, breadcrumbs, seen)
            }
            // Reference
            const ref = u.deep(root, arg)
            if (ref === undefined) {
                throw new Error(`Could not resolve reference "${arg}" in $concat at "${breadcrumbs.join('.')}"`)
            }
            return resolve(ref, root, breadcrumbs, seen)
        }).join('')

    seen.delete(val)
    return res
}

exports.concat = config => traverse(config, config, [], (target, key, val, root, breadcrumbs) => {
    target[key] = resolve(val, root, breadcrumbs)
})
