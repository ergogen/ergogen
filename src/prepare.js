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
        let current = val
        if (type === 'object' && val.$extends !== undefined) {
            current = overlay(undefined, u.deepcopy(val), breadcrumbs)
        }

        const current_type = a.type(current)()
        let res = current
        if (current_type === 'object') {
            res = {}
            for (const [k, v] of Object.entries(current)) {
                res[k] = resolve(v, [...breadcrumbs, k])
            }
        } else if (current_type === 'array') {
            // the index loop turns array holes into explicit undefined slots
            res = []
            for (let i = 0; i < current.length; i++) {
                res[i] = resolve(current[i], [...breadcrumbs, `[${i}]`])
            }
        }
        stack.pop()
        cache.set(val, res)
        return res
    }

    // merges a local value onto already resolved data, placing the targets of
    // its own (or any nested) $extends in between, so that the local fields,
    // including their $unset markers, still apply last
    const overlay = (base, local, breadcrumbs) => {
        const local_type = a.type(local)()
        if (local_type === 'array' && a.type(base)() === 'array') {
            const res = u.deepcopy(base)
            for (const [i, val] of local.entries()) {
                res[i] = overlay(res[i], val, [...breadcrumbs, `[${i}]`])
            }
            return res
        }
        if (local_type !== 'object') return _extend(base, local)
        if (local.$extends !== undefined) {
            let candidates = local.$extends
            if (a.type(candidates)() !== 'array') candidates = [candidates]
            const list = []
            for (const path of candidates) {
                const other = u.deep(config, path)
                a.assert(other, `"${path}" (reached from "${breadcrumbs.join('.')}.$extends") does not name a valid inheritance target!`)
                list.push(resolve(other, path.split('.')))
            }
            delete local.$extends
            // only an object parent is layered under the targets, anything
            // else is replaced by them, and duplicate targets apply once
            if (a.type(base)() !== 'object') base = undefined
            for (const target of list) {
                if (base !== target) base = _extend(base, target)
            }
            // the targets are cached, so results must not share their data
            base = copy(base)
            // without local fields the block is its targets, whatever their type
            if (list.length > 0 && Object.keys(local).length === 0) return base
        }
        if (a.type(base)() !== 'object') return _extend(base, local)
        const res = u.deepcopy(base)
        for (const [key, val] of Object.entries(local)) {
            res[key] = overlay(base[key], val, [...breadcrumbs, key])
            if (res[key] === undefined) delete res[key]
        }
        return res
    }

    // like u.deepcopy, but keeps undefined array slots left by $unset
    const copy = val => {
        const type = a.type(val)()
        if (type === 'array') return val.map(copy)
        if (type === 'object') return Object.fromEntries(Object.entries(val).map(([k, v]) => [k, copy(v)]))
        return val
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

const concat_prefix = '$concat('

const parse_concat = (val, breadcrumbs) => {
    const fail = reason => {
        throw new Error(`Invalid $concat expression "${val}" at "${breadcrumbs.join('.')}": ${reason}!`)
    }
    let pos = 0
    const skip_whitespace = () => {
        while (pos < val.length && /\s/.test(val[pos])) pos++
    }
    const parse_literal = () => {
        const quote = val[pos++]
        let value = ''
        while (pos < val.length) {
            const char = val[pos++]
            if (char === quote) return {type: 'literal', value}
            // a backslash always escapes the next character, so runs of backslashes pair up
            if (char === '\\') {
                if (pos === val.length) break
                // a backslash before a line terminator is not an escape, so it stays in the value
                if (!/./.test(val[pos])) value += char
                value += val[pos++]
            } else value += char
        }
        fail(`unterminated ${quote} string literal`)
    }
    const parse_reference = () => {
        const start = pos
        while (pos < val.length && !/[\s,()"']/.test(val[pos])) pos++
        return {type: 'reference', path: val.substring(start, pos)}
    }
    const parse_call = () => {
        pos += concat_prefix.length
        const args = []
        while (true) {
            skip_whitespace()
            const char = val[pos]
            // empty arguments are allowed and contribute nothing
            if (char === '"' || char === "'") args.push(parse_literal())
            else if (val.startsWith(concat_prefix, pos)) args.push(parse_call())
            else if (char !== ',' && char !== ')') args.push(parse_reference())
            skip_whitespace()
            if (pos === val.length) fail('missing closing parenthesis')
            if (val[pos] === ')') {
                pos++
                return {type: 'call', args}
            }
            if (val[pos] !== ',') fail(`unexpected "${val[pos]}" at position ${pos}`)
            pos++
        }
    }
    const expression = parse_call()
    if (pos < val.length) fail(`unexpected trailing "${val.substring(pos)}" after the closing parenthesis`)
    return expression
}

// read-only lookup, so that a missing path does not create intermediate objects in the config
const lookup = (root, path) => {
    let step = root
    for (const level of path.split('.')) {
        // own properties of strings (like "length" or an index) are still readable
        if (step === null || step === undefined || !Object.prototype.hasOwnProperty.call(step, level)) return undefined
        step = step[level]
    }
    return step
}

const resolve = (val, root, breadcrumbs, seen = new Set()) => {
    if (a.type(val)() !== 'string') return val
    if (!val.startsWith(concat_prefix)) return val

    if (seen.has(val)) {
        throw new Error(`Circular dependency detected in $concat at "${breadcrumbs.join('.')}": ${val}`)
    }
    seen.add(val)

    const evaluate = node => {
        if (node.type == 'literal') return node.value
        if (node.type == 'call') return node.args.map(evaluate).join('')
        const ref = lookup(root, node.path)
        if (ref === undefined) {
            throw new Error(`Could not resolve reference "${node.path}" in $concat at "${breadcrumbs.join('.')}"`)
        }
        if (!['string', 'number', 'boolean'].includes(typeof ref)) {
            throw new Error(`Reference "${node.path}" in $concat at "${breadcrumbs.join('.')}" should be a string, number or boolean, not ${a.type(ref)()}!`)
        }
        return resolve(ref, root, breadcrumbs, seen)
    }
    const res = evaluate(parse_concat(val, breadcrumbs))

    seen.delete(val)
    return res
}

exports.concat = config => traverse(config, config, [], (target, key, val, root, breadcrumbs) => {
    target[key] = resolve(val, root, breadcrumbs)
})
