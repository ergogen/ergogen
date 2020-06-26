const m = require('makerjs')
const u = require('./utils')
const Point = require('./point')

const extend_pair = exports._extend_pair = (to, from) => {
    const to_type = u.type(to)
    const from_type = u.type(from)
    if (!from && ['array', 'object'].includes(to_type)) return to
    if (to_type != from_type) return from
    if (from_type == 'object') {
        const res = {}
        for (const key of Object.keys(from)) {
            res[key] = extend_pair(to[key], from[key])
        }
        return res
    } else if (from_type == 'array') {
        const res = u.deepcopy(to)
        for (const [i, val] of from.entries()) {
            res[i] = extend_pair(res[i], val)
        }
        return res
    } else return from
}

const extend = exports._extend = (...args) => {
    let res = args[0]
    for (const arg of args) {
        if (res == arg) continue
        res = extend_pair(res, arg)
    }
    return res
}

const push_rotation = exports._push_rotation = (list, angle, origin) => {
    let candidate = origin
    for (const r of list) {
        candidate = m.point.rotate(candidate, r.angle, r.origin)
    }
    list.push({
        angle: angle,
        origin: candidate
    })
}

const render_zone = exports._render_zone = (cols, rows, zone_wide_key, anchor) => {

    const points = {}
    const rotations = []
    
    // transferring the anchor rotation to "real" rotations
    rotations.push({
        angle: anchor.r,
        origin: anchor.p
    })

    for (const [colname, col] of Object.entries(cols)) {
        
        anchor.y += col.stagger || 0        
        const col_anchor = anchor.clone()
        // clear potential rotations, as they will get re-applied anyway
        // and we don't want to apply them twice...
        col_anchor.r = 0

        // combine row data from zone-wide defs and col-specific defs
        const col_specific_rows = col.rows || {}
        const zone_wide_rows = rows || {}
        const actual_rows = col_specific_rows || zone_wide_rows
        
        // get key config through the 4-level extension
        const keys = []
        for (const row of Object.keys(actual_rows)) {
            const key = extend(zone_wide_key, col.key || {}, zone_wide_rows[row] || {}, col_specific_rows[row] || {})
            key.col = col
            key.row = row
            key.name = `${colname}_${row}`
            keys.push(key)
        }

        // lay out keys
        for (const key of keys) {
            let point = col_anchor.clone()
            for (const r of rotations) {
                point.rotate(r.angle, r.origin)
            }
            if (key.rotate) {
                point.rotate(key.rotate, point.add(key.origin || [0, 0]).p)
            }
            point.meta = key
            points[key.name] = point

            col_anchor.y += key.padding || 19
        }

        // apply col-level rotation for the next columns
        if (col.rotate) {
            push_rotation(
                rotations,
                col.rotate,
                anchor.add(col.origin || [0, 0]).p
            )
        }

        anchor.x += col.spread || 19
    }

    return points
}

const anchor = exports._anchor = (raw, points={}) => {
    let a = new Point()
    if (raw) {
        if (raw.ref && points[raw.ref]) {
            a = points[raw.ref].clone()
        }
        if (raw.shift) {
            a.x += raw.shift[0] || 0
            a.y += raw.shift[1] || 0
        }
        a.r += raw.rotate || 0
    }
    return a
}

exports.parse = (config) => {

    let points = {}

    for (const zone of Object.values(config.zones)) {
        points = Object.assign(points, render_zone(
            zone.columns || [],
            zone.rows || [{name: 'default'}],
            zone.key || {},
            anchor(zone.anchor, points)
        ))
    }

    if (config.rotate) {
        for (const p of Object.values(points)) {
            p.rotate(config.rotate)
        }
    }

    if (config.mirror) {
        let axis = config.mirror.axis
        if (!axis) {
            axis = anchor(config.mirror, points).x
            axis += (config.mirror.distance || 0) / 2
        }
        const mirrored_points = {}
        for (const [name, p] of Object.entries(points)) {
            if (p.meta.asym == 'left') continue
            const mp = p.clone().mirror(axis)
            mp.meta.mirrored = true
            delete mp.meta.asym
            mirrored_points[`mirror_${name}`] = mp
            if (p.meta.asym == 'right') {
                p.meta.skip = true
            }
        }
        Object.assign(points, mirrored_points)
    }
    
    const filtered = {}
    for (const [k, p] of Object.entries(points)) {
        if (p.meta.skip) continue
        filtered[k] = p
    }

    return filtered
}