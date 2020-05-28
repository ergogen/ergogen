const m = require('makerjs')
const fs = require('fs-extra')




// TODO: refactor this to use the new config format

const column = (func, col) => ({
    models: {
        bottom: up(func(col, 'bottom'), 0 * (side + padding)),
        middle: up(func(col, 'middle'), 1 * (side + padding)),
        top:    up(func(col, 'top'),    2 * (side + padding))
    }
})

const matrix = (func) => {
    const models = {}
    let i = 0
    let sum = 0
    for (const {name, shift} of columns) {
        let col = column(func, name)
        sum += shift
        if (name == 'pinky') {
            col = rotate(col, pinky_angle, [side, 0])
        }
        col = up(col, sum)
        col = right(col, i * (side + padding))
        models[name] = col
        i++
    }
    return {models}
}

const thumbfan = (func) => ({
    models: {
        inner: func('thumb', 'inner'),
        home: rotate(
            right(
                func('thumb', 'home'),
                side + padding + kc_diff
            ),
            thumb_angle,
            [side + padding / 2, -overhang]
        ),
        outer: rotate(
            right(
                rotate(
                    right(
                        func('thumb', 'outer'),
                        side + padding + kc_diff
                    ),
                    thumb_angle,
                    [side + padding / 2 + kc_diff, -overhang]
                ),
                side + padding + kc_diff
            ),
            thumb_angle,
            [side + padding / 2, -overhang]
        )
    }
})

const half = (func) => {
    const result = {
        models: {
            matrix: matrix(func),
            thumbfan: move(
                thumbfan(func),
                [
                    3 * (side + padding) + thumb_start,
                    -(side + padding) + staggers_sum
                ]
            )
        }
    }
    return m.model.rotate(result, half_angle)
}





const dump = (points) => {

    const line = (a, b) => ({
        type: 'line',
        origin: a,
        end: b
    })

    const models = {}
    for (const [key, point] of Object.entries(points)) {
        const s = 7
        const paths = {
            l: line([-s, -s], [-s,  s]),
            t: line([-s,  s], [ s,  s]),
            r: line([ s,  s], [ s, -s]),
            b: line([ s, -s], [-s, -s])
        }
        models[key] = m.model.moveRelative(m.model.rotate({paths}, point.r), point.xy)
    }

    const assembly = m.model.originate({
        models,
        units: 'mm'
    })

    fs.writeFileSync(`dump.dxf`, m.exporter.toDXF(assembly))
}


exports.parse = (config) => {

    const points = {}

    // matrix
    let x = 0
    let stagger_sum = 0
    let rotation_sum = 0
    const rotations = []
    for (const col of config.columns) {
        stagger_sum += col.stagger || 0
        let y = stagger_sum
        for (const row of (col.rows || config.rows)) {
            let point = [x, y]
            for (const r of rotations) {
                point = m.point.rotate(point, r.angle, r.origin)
            }
            points[col.name + '_' + row.name] = {
                xy: point,
                r: rotation_sum
            }
            y += row.padding || 19
        }
        if (col.rotate) {
            rotations.push({
                angle: -col.rotate,
                origin: m.point.add(col.origin || [0, 0], [x, stagger_sum])
            })
            rotation_sum += -col.rotate
        }
        x += col.padding || 19
    }

    // thumbfan
    let anchor_index = -1
    let anchor_point = false
    for (const key of config.thumbfan) {
        if (!anchor_point) {
            anchor_index++
            if (key.anchor) {
                const ref = points[key.anchor.ref]
                anchor_point = m.point.add(ref, key.anchor.shift)
            } else continue
        }

    }

    dump(points)
    throw 2




    return points
}