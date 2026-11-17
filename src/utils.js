const m = require('makerjs')
const a = require('./assert')
const svg_lib = require('./svg')


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

// imports a single path, and validates it before a union could hide its problems
const import_svg_path = (raw, index, name, accuracy) => {
    a.assert(a.type(raw)() == 'string', `Path ${index} for SVG outline "${name}" must be a string!`)
    a.assert(raw.trim() !== '', `Path ${index} for SVG outline "${name}" cannot be empty!`)
    // malformed path data is rejected before makerjs could misread it, or hang on it
    const data = svg_lib.path_data(raw, `Path ${index} for SVG outline "${name}"`)
    let model
    try {
        model = m.importer.fromSVGPathData(data, accuracy)
    } catch (ex) {
        throw new Error(`Path ${index} for SVG outline "${name}" could not be imported: ${ex.message}`, {cause: ex})
    }
    // the callback is skipped (and the result is undefined) for models without any geometry
    let closed = undefined
    m.model.findChains(model, (chains, loose) => {
        closed = chains.length > 0 && loose.length === 0 && chains.every(chain => chain.endless)
    })
    a.assert(closed !== undefined, `Path ${index} for SVG outline "${name}" does not contain any geometry!`)
    a.assert(closed, `SVG paths need to be closed shapes (check failed for path ${index} of "${name}")!`)
    return model
}

exports.svg_paths_to_outline = (paths_raw, config, name, points, outlines, units, accuracy=0.0001) => {
    a.unexpected(config, name, ['accuracy', 'flip_horizontally', 'flip_vertically', 'origin'])
    const actual_accuracy = a.sane(config.accuracy === undefined ? accuracy : config.accuracy, `${name}.accuracy`, 'number')(units)
    a.assert(Number.isFinite(actual_accuracy) && actual_accuracy > 0, `Field "${name}.accuracy" should be a positive finite number!`)

    const flip_horizontally = a.sane(config.flip_horizontally || false, `${name}.flip_horizontally`, 'boolean')(units)
    const flip_vertically = a.sane(config.flip_vertically || false, `${name}.flip_vertically`, 'boolean')(units)
    const origin = a.xy(config.origin || [0, 0], `${name}.origin`)(units)

    let paths = paths_raw
    if (a.type(paths)() == 'string') paths = [paths]
    a.assert(a.type(paths)() == 'array', `Field "paths" for SVG outline "${name}" must be a string or an array!`)
    a.assert(paths.length > 0, `SVG outline "${name}" must have at least one path!`)

    // separate paths are unioned, while the subpaths of a single path keep their compound topology
    // this happens once per part (even without placements), and each placement gets its own copy
    let shape = undefined
    for (const [index, raw] of paths.entries()) {
        const imported = import_svg_path(raw, index, name, actual_accuracy)
        if (shape === undefined) {
            shape = imported
        } else {
            shape = exports.union(shape, imported)
            m.model.simplify(shape)
        }
    }

    if (origin[0] !== 0 || origin[1] !== 0) {
        shape = m.model.moveRelative(shape, [-origin[0], -origin[1]])
    }

    if (flip_horizontally || flip_vertically) {
        shape = m.model.mirror(shape, flip_horizontally, flip_vertically)
    }

    return [point => {
        let placed = exports.deepcopy(shape)
        if (point.meta.mirrored) {
            placed = m.model.mirror(placed, true, false)
        }
        const bbox = m.measure.modelExtents(placed)
        return [placed, {low: bbox.low, high: bbox.high}]
    }, units]
}
