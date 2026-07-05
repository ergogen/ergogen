const m = require('makerjs')


exports.deepcopy = value => {
    if (value === undefined) return undefined
    return JSON.parse(JSON.stringify(value))
}

const deep = exports.deep = (obj, key, val) => {
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

exports.template = (str, vals={}) => {
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

const eq = exports.eq = (a=[], b=[]) => {
    return a[0] === b[0] && a[1] === b[1]
}

const line = exports.line = (a, b) => {
    return new m.paths.Line(a, b)
}

exports.circle = (p, r) => {
    return {paths: {circle: new m.paths.Circle(p, r)}}
}

exports.rect = (w, h, o=[0, 0]) => {
    const res = {
        top:    line([0, h], [w, h]),
        right:  line([w, h], [w, 0]),
        bottom: line([w, 0], [0, 0]),
        left:   line([0, 0], [0, h])
    }
    return m.model.move({paths: res}, o)
}

exports.poly = (arr) => {
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

exports.bbox = (arr) => {
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

const farPoint = exports.farPoint = [1234.1234, 2143.56789]

exports.union = exports.add = (a, b) => {
    return m.model.combine(a, b, false, true, false, true, {
        farPoint
    })
}

exports.subtract = (a, b) => {
    return m.model.combine(a, b, false, true, true, false, {
        farPoint
    })
}

exports.intersect = (a, b) => {
    return m.model.combine(a, b, true, false, true, false, {
        farPoint
    })
}

exports.stack = (a, b) => {
    return {
        models: {
            a, b
        }
    }
}

const semver = exports.semver = (str, name='') => {
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

const satisfies = exports.satisfies = (current, expected) => {
    if (current.major === undefined) current = semver(current)
    if (expected.major === undefined) expected = semver(expected)
    return current.major === expected.major && (
        current.minor > expected.minor || (
            current.minor === expected.minor && 
            current.patch >= expected.patch
        )
    )
}

exports.svg_paths_to_outline = (paths_raw, config, name, points, outlines, units, accuracy = 0.0001) => {
    const a = require('./assert')
    a.unexpected(config, name, ['paths', 'accuracy', 'flip_horizontally', 'flip_vertically', 'origin'])
    const actual_accuracy = a.sane(config.accuracy || accuracy, `${name}.accuracy`, 'number')(units)
    a.assert(actual_accuracy !== 0, `Accuracy for SVG outline "${name}" cannot be 0!`)

    const flip_horizontally = a.sane(config.flip_horizontally || false, `${name}.flip_horizontally`, 'boolean')(units)
    const flip_vertically = a.sane(config.flip_vertically || false, `${name}.flip_vertically`, 'boolean')(units)
    const origin = a.xy(config.origin || [0, 0], `${name}.origin`)(units)

    return [point => {
        let paths = []
        if (a.type(paths_raw)() == 'string') {
            paths = [paths_raw]
        } else if (a.type(paths_raw)() == 'array') {
            paths = paths_raw
        } else {
            a.assert(false, `Field "paths" for SVG outline "${name}" must be a string or an array!`)
        }

        let combined = undefined
        for (const [i, p] of paths.entries()) {
            a.assert(a.type(p)() == 'string', `Path ${i} for SVG outline "${name}" must be a string!`)
            const imported = m.importer.fromSVGPathData(p, actual_accuracy)
            if (combined === undefined) {
                combined = imported
            } else {
                combined = exports.union(combined, imported)
                m.model.simplify(combined)
            }
        }
        let shape = combined
        shape = m.model.mirror(shape, false, true)

        if (origin[0] !== 0 || origin[1] !== 0) {
            shape = m.model.moveRelative(shape, [-origin[0], -origin[1]])
        }

        if (flip_horizontally || flip_vertically) {
            shape = m.model.mirror(shape, flip_horizontally, flip_vertically)
        }

        const chains = m.model.findChains(shape)
        a.assert(chains.length > 0, `SVG outline "${name}" does not contain any valid paths!`)
        for (const chain of chains) {
            a.assert(chain.endless, `SVG paths need to be closed shapes (check failed for "${name}")`)
        }

        if (point.meta.mirrored) {
            shape = m.model.mirror(shape, true, false)
        }
        const bbox = m.measure.modelExtents(shape)
        return [shape, {low: bbox.low, high: bbox.high}]
    }, units]
}