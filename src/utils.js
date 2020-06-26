const m = require('makerjs')

exports.assert = (exp, msg) => {
    if (!exp) {
        throw new Error(msg)
    }
}

exports.deepcopy = (value) => JSON.parse(JSON.stringify(value))

exports.type = (val) => {
    if (Array.isArray(val)) return 'array'
    if (val === null) return 'null'
    return typeof val
}

const eq = exports.eq = (a=[], b=[]) => {
    return a[0] === b[0] && a[1] === b[1]
}

const line = exports.line = (a, b) => {
    return new m.paths.Line(a, b)
}

exports.circle = (p, r) => {
    return new m.paths.Circle(p, r)
}

exports.rect = (w, h, o=[0, 0], mirrored=false) => {
    const res = {
        top:    line([0, h], [w, h]),
        right:  line([w, h], [w, 0]),
        bottom: line([w, 0], [0, 0]),
        left:   line([0, 0], [0, h])
    }
    if (mirrored) {
        for (const segment of Object.values(res)) {
            [segment.origin, segment.end] = [segment.end, segment.origin] 
        }
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
