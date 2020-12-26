const m = require('makerjs')

exports.deepcopy = (value) => JSON.parse(JSON.stringify(value))

const deep_assign = exports.deep_assign = (obj, key, val) => {
    const levels = key.split('.')
    const last = levels.pop()
    let step = obj
    for (const level of levels) {
        step[level] = step[level] || {}
        step = step[level]
    }
    step[last] = val
    return obj
}

const expand_nested_keys = exports.expand_nested_keys = (config) => {
    if (typeof config == 'object') {
        const result = {}
        for (const [key, val] of Object.entries(config)) {
            deep_assign(result, key, expand_nested_keys(val))
        }
        return result
    }
    return config
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

const farPoint = [1234.1234, 2143.56789]

exports.union = (a, b) => {
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