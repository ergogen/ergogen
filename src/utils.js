import m from 'makerjs'

export const deepcopy = value => {
    if (value === undefined) return undefined
    return JSON.parse(JSON.stringify(value))
}

export const deep = (obj, key, val) => {
    const levels = key.split('.')
    const last = levels.pop()
    let step = obj
    for (const level of levels) {
        step[level] = step[level] || {}
        step = step[level]
    }
    if (val === undefined) return step[last]
    step[last] = val
    return obj
}

export const template = (str, vals={}) => {
    const regex = /\{\{([^}]*)\}\}/g
    let res = str
    let shift = 0
    for (const match of str.matchAll(regex)) {
        const replacement = (deep(vals, match[1]) || '') + ''
        res = res.substring(0, match.index + shift)
            + replacement
            + res.substring(match.index + shift + match[0].length)
        shift += replacement.length - match[0].length
    }
    return res
}

export const eq = (a=[], b=[]) => {
    return a[0] === b[0] && a[1] === b[1]
}

export const line = (a, b) => {
    return new m.paths.Line(a, b)
}

export const circle = (p, r) => {
    return {paths: {circle: new m.paths.Circle(p, r)}}
}

export const rect = (w, h, o=[0, 0]) => {
    const res = {
        top:    line([0, h], [w, h]),
        right:  line([w, h], [w, 0]),
        bottom: line([w, 0], [0, 0]),
        left:   line([0, 0], [0, h])
    }
    return m.model.move({paths: res}, o)
}

export const poly = (arr) => {
    let counter = 0
    let prev = arr[arr.length - 1]
    const res = {
        paths: {}
    }
    for (const p of arr) {
        if (eq(prev, p)) continue
        res.paths['p' + (++counter)] = line(prev, p)
        prev = p
    }
    return res
}

export const bbox = (arr) => {
    let minx = Infinity
    let miny = Infinity
    let maxx = -Infinity
    let maxy = -Infinity
    for (const p of arr) {
        minx = Math.min(minx, p[0])
        miny = Math.min(miny, p[1])
        maxx = Math.max(maxx, p[0])
        maxy = Math.max(maxy, p[1])
    }
    return {low: [minx, miny], high: [maxx, maxy]}
}

export const farPoint = [1234.1234, 2143.56789]

export const union = (a, b) => {
    return m.model.combine(a, b, false, true, false, true, {
        farPoint
    })
}
export { union as add }

export const subtract = (a, b) => {
    return m.model.combine(a, b, false, true, true, false, {
        farPoint
    })
}

export const intersect = (a, b) => {
    return m.model.combine(a, b, true, false, true, false, {
        farPoint
    })
}

export const stack = (a, b) => {
    return {
        models: {
            a, b
        }
    }
}

export const semver = (str, name='') => {
    let main = str.split('-')[0]
    if (main.startsWith('v')) {
        main = main.substring(1)
    }
    while (main.split('.').length < 3) {
        main += '.0'
    }
    if (/^\d+\.\d+\.\d+$/.test(main)) {
        const parts = main.split('.').map(part => parseInt(part, 10))
        return {major: parts[0], minor: parts[1], patch: parts[2]}
    } else throw new Error(`Invalid semver "${str}" at ${name}!`)
}

export const satisfies = (current, expected) => {
    if (current.major === undefined) current = semver(current)
    if (expected.major === undefined) expected = semver(expected)
    return current.major === expected.major && (
        current.minor > expected.minor || (
            current.minor === expected.minor && 
            current.patch >= expected.patch
        )
    )
}