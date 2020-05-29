const m = require('makerjs')
const fs = require('fs-extra')




// TODO: refactor this to use the new config format

// const column = (func, col) => ({
//     models: {
//         bottom: up(func(col, 'bottom'), 0 * (side + padding)),
//         middle: up(func(col, 'middle'), 1 * (side + padding)),
//         top:    up(func(col, 'top'),    2 * (side + padding))
//     }
// })

// const matrix = (func) => {
//     const models = {}
//     let i = 0
//     let sum = 0
//     for (const {name, shift} of columns) {
//         let col = column(func, name)
//         sum += shift
//         if (name == 'pinky') {
//             col = rotate(col, pinky_angle, [side, 0])
//         }
//         col = up(col, sum)
//         col = right(col, i * (side + padding))
//         models[name] = col
//         i++
//     }
//     return {models}
// }

// const thumbfan = (func) => ({
//     models: {
//         inner: func('thumb', 'inner'),
//         home: rotate(
//             right(
//                 func('thumb', 'home'),
//                 side + padding + kc_diff
//             ),
//             thumb_angle,
//             [side + padding / 2, -overhang]
//         ),
//         outer: rotate(
//             right(
//                 rotate(
//                     right(
//                         func('thumb', 'outer'),
//                         side + padding + kc_diff
//                     ),
//                     thumb_angle,
//                     [side + padding / 2 + kc_diff, -overhang]
//                 ),
//                 side + padding + kc_diff
//             ),
//             thumb_angle,
//             [side + padding / 2, -overhang]
//         )
//     }
// })

// const half = (func) => {
//     const result = {
//         models: {
//             matrix: matrix(func),
//             thumbfan: move(
//                 thumbfan(func),
//                 [
//                     3 * (side + padding) + thumb_start,
//                     -(side + padding) + staggers_sum
//                 ]
//             )
//         }
//     }
//     return m.model.rotate(result, half_angle)
// }


// TODO temp
let _debug_key = 0
const _debug = {}
const debug = (xy) => {
    _debug[_debug_key++] = { 
        type: 'circle', 
        origin: [xy[0], xy[1]],
        radius: 1
    }
}

const dump = exports.dump = (points, opts={}) => {

    const line = (a, b) => ({
        type: 'line',
        origin: a,
        end: b
    })
    const s = (opts.side || 14) / 2

    const models = {}
    for (const [key, point] of Object.entries(points)) {
        const paths = {
            l: line([-s, -s], [-s,  s]),
            t: line([-s,  s], [ s,  s]),
            r: line([ s,  s], [ s, -s]),
            b: line([ s, -s], [-s, -s])
        }
        models[key] = m.model.moveRelative(m.model.rotate({paths}, point.r), point.p)
    }

    // TODO
    models['debug'] = {paths: _debug}

    const assembly = m.model.originate({
        models,
        units: 'mm'
    })

    fs.writeFileSync(`${opts.file || 'dump'}.dxf`, m.exporter.toDXF(assembly))
}




const Point = exports.Point = class Point {
    constructor(x, y, r, col={}, row={}) {
        this.x = x
        this.y = y
        this.r = r
        this.col = col
        this.row = row
    }

    get p() {
        return [this.x, this.y]
    }

    set p(val) {
        [this.x, this.y] = val
    }
}


const push_rotation = (list, angle, origin) => {
    let candidate = origin
    for (const r of list) {
        candidate = m.point.rotate(candidate, r.angle, r.origin)
    }
    list.push({
        angle: angle,
        origin: candidate
    })
}


const matrix = (cols, rows, anchor=new Point(0, 0, 0), reverse=false) => {

    console.log('matrix', cols, rows, anchor, reverse)


    const sign = reverse ? -1 : 1
    const points = {}
    let x = anchor.x
    let stagger_sum = anchor.y
    let rotation_sum = anchor.r
    const rotations = [{
        angle: anchor.r,
        origin: [0, 0]
    }]
    for (const col of cols) {
        

        // TODO rotation origin reversal is not this easy
        // and probably the whole reversal idea is not even necessary
        // sleep on it, and possibly remove to simplify


        if (reverse) {
            x -= col.padding || 19
            if (col.rotate) {
                let ox = 0, oy = 0
                if (col.origin) {
                    ox = -col.origin[0]
                    oy = col.origin[1]
                }
                push_rotation(
                    rotations,
                    col.rotate,
                    m.point.add([ox, oy], [x, stagger_sum])
                )
                rotation_sum += col.rotate
            }
        }

        stagger_sum += sign * col.stagger || 0
        let y = stagger_sum
        

        for (const row of (col.rows || rows || [{name: 'default'}])) {
            let point = [x, y]
            debug(point)
            for (const r of rotations) {
                point = m.point.rotate(point, r.angle, r.origin)
                debug(point)
            }
            points[col.name + '_' + row.name] = new Point(
                point[0],
                point[1],
                rotation_sum + (row.angle || 0),
                col,
                row
            )
            console.log('new Point', points[col.name + '_' + row.name])
            y += row.padding || 19
        }

        


        if (!reverse) {
            if (col.rotate) {
                push_rotation(
                    rotations,
                    -col.rotate,
                    m.point.add(col.origin || [0, 0], [x, stagger_sum])
                )

                a = rotations.pop()
                debug(a.origin)
                rotations.push(a)

                rotation_sum += -col.rotate
            }
            x += col.padding || 19
        }

        

    }
    return points
}








exports.parse = (config) => {

    // basic matrix
    let matrix_anchor
    if (config.anchor) {
        let x = 0
        let y = 0
        if (config.anchor.shift) {
            x = config.anchor.shift[0]
            y = config.anchor.shift[1]
        }
        const r = -config.anchor.angle || 0
        matrix_anchor = new Point(x, y, r)
    }
    let points = matrix(config.columns, config.rows, matrix_anchor)

    // thumbfan
    let thumb_anchor = new Point(0, 0, 0)
    let thumb_anchor_index = -1
    for (const key of config.thumbfan) {
        thumb_anchor_index++
        if (key.anchor) {
            const ref = points[key.anchor.ref] || thumb_anchor
            thumb_anchor.p = m.point.add(ref.p, key.anchor.shift)
            thumb_anchor.r += key.anchor.angle || 0
            break
        } else continue
    }

    const forward = config.thumbfan.slice(thumb_anchor_index)
    const rewind = config.thumbfan.slice(0, thumb_anchor_index)
    const thumb_rows = config.thumb_rows || [{name: 'thumb'}]
    
    points = Object.assign(points, matrix(forward, thumb_rows, thumb_anchor))
    points = Object.assign(points, matrix(rewind, thumb_rows, thumb_anchor, true))


    dump(points)
    throw 2




    return points
}