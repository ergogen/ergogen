const m = require('makerjs')
const u = require('./utils')
const a = require('./assert')

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

const render_zone = exports._render_zone = (zone_name, zone, anchor, global_key) => {

    // zone-wide sanitization

    a.detect_unexpected(zone, `points.zones.${zone_name}`, ['anchor', 'columns', 'rows', 'key'])
    // the anchor comes from "above", because it needs other zones too (for references)
    const cols = a.sane(zone.columns || {}, `points.zones.${zone_name}.columns`, 'object')
    const zone_wide_rows = a.sane(zone.rows || {'default': {}}, `points.zones.${zone_name}.rows`, 'object')
    for (const [key, val] of Object.entries(zone_wide_rows)) {
        zone_wide_rows[key] = a.sane(val || {}, `points.zones.${zone_name}.rows.${key}`, 'object')
    }
    const zone_wide_key = a.sane(zone.key || {}, `points.zones.${zone_name}.key`, 'object')

    // algorithm prep

    const points = {}
    const rotations = []
    // transferring the anchor rotation to "real" rotations
    rotations.push({
        angle: anchor.r,
        origin: anchor.p
    })

    // column layout

    for (const [col_name, col] of Object.entries(cols)) {

        // column-level sanitization

        a.detect_unexpected(
            col,
            `points.zones.${zone_name}.columns.${col_name}`,
            ['stagger', 'spread', 'rotate', 'origin', 'rows', 'key']
        )
        col.stagger = a.sane(
            col.stagger || 0,
            `points.zones.${zone_name}.columns.${col_name}.stagger`,
            'number'
        )
        col.spread = a.sane(
            col.spread || 19,
            `points.zones.${zone_name}.columns.${col_name}.spread`,
            'number'
        )
        col.rotate = a.sane(
            col.rotate || 0,
            `points.zones.${zone_name}.columns.${col_name}.rotate`,
            'number'
        )
        col.origin = a.xy(
            col.origin || [0, 0],
            `points.zones.${zone_name}.columns.${col_name}.origin`,
        )
        col.rows = a.sane(
            col.rows || {},
            `points.zones.${zone_name}.columns.${col_name}.rows`,
            'object'
        )
        for (const [key, val] of Object.entries(col.rows)) {
            col.rows[key] = a.sane(
                val || {},
                `points.zones.${zone_name}.columns.${col_name}.rows.${key}`,
                'object'
            )
        }
        col.key = a.sane(
            col.key || {},
            `points.zones.${zone_name}.columns.${col_name}.key`,
            'object'
        )

        // column-level prep

        // propagate object key to name field
        col.name = col_name
        // combine row data from zone-wide defs and col-specific defs
        const actual_rows = Object.keys(col.rows).length ? col.rows : zone_wide_rows

        // setting up column-level anchor

        anchor.y += col.stagger || 0        
        const col_anchor = anchor.clone()
        // clear potential rotations, as they will get re-applied anyway
        // and we don't want to apply them twice...
        col_anchor.r = 0

        // getting key config through the 4-level extension

        const keys = []
        const default_key = {
            shift: [0, 0],
            rotate: 0,
            padding: 19,
            skip: false,
            asym: 'both'
        }
        for (const row of Object.keys(actual_rows)) {
            const key = a.extend(
                default_key,
                global_key,
                zone_wide_key,
                col.key,
                zone_wide_rows[row] || {},
                col.rows[row] || {}
            )

            key.name = key.name || `${zone_name}_${col_name}_${row}`
            key.colrow = `${col_name}_${row}`
            key.shift = a.xy(key.shift, `${key.name}.shift`)
            key.rotate = a.sane(key.rotate, `${key.name}.rotate`, 'number')
            key.padding = a.sane(key.padding, `${key.name}.padding`, 'number')
            key.skip = a.sane(key.skip, `${key.name}.skip`, 'boolean')
            a.assert(
                ['left', 'right', 'both'].includes(key.asym),
                `${key.name}.asym should be one of "left", "right", or "both"!`
            )
            key.col = col
            key.row = row
            keys.push(key)
        }

        // actually laying out keys

        for (const key of keys) {
            let point = col_anchor.clone()
            for (const r of rotations) {
                point.rotate(r.angle, r.origin)
            }
            if (key.rotate) {
                point.r += key.rotate
            }
            point.meta = key
            points[key.name] = point
            col_anchor.y += key.padding
        }

        // applying col-level rotation for the next columns

        if (col.rotate) {
            push_rotation(
                rotations,
                col.rotate,
                anchor.clone().shift(col.origin, false).p
            )
        }

        // moving over and starting the next column

        anchor.x += col.spread
    }

    return points
}

exports.parse = (config = {}) => {

    a.detect_unexpected(config, 'points', ['zones', 'key', 'rotate', 'mirror'])

    let points = {}

    // getting original points

    const zones = a.sane(config.zones || {}, 'points.zones', 'object')
    const global_key = a.sane(config.key || {}, 'points.key', 'object')
    for (let [zone_name, zone] of Object.entries(zones)) {

        // handle zone-level `extends` clauses
        zone = a.inherit('points.zones', zone_name, zones)

        const anchor = a.anchor(zone.anchor || {}, `points.zones.${zone_name}.anchor`, points)
        points = Object.assign(points, render_zone(zone_name, zone, anchor, global_key))
    }

    // applying global rotation

    if (config.rotate !== undefined) {
        const r = a.sane(config.rotate || 0, 'points.rotate', 'number')
        for (const p of Object.values(points)) {
            p.rotate(config.rotate)
        }
    }

    // mirroring

    if (config.mirror !== undefined) {
        const mirror = a.sane(config.mirror || {}, 'points.mirror', 'object')
        let axis = mirror.axis
        if (axis === undefined) {
            const distance = a.sane(mirror.distance || 0, 'points.mirror.distance', 'number')
            delete mirror.distance
            axis = a.anchor(mirror, 'points.mirror', points).x
            axis += distance / 2
        } else {
            axis = a.sane(axis || 0, 'points.mirror.axis', 'number')
        }
        const mirrored_points = {}
        for (const [name, p] of Object.entries(points)) {
            if (p.meta.asym == 'left') continue
            const mp = p.clone().mirror(axis)
            mp.meta = a.extend(mp.meta, mp.meta.mirror || {})
            mp.meta.mirrored = true
            p.meta.mirrored = false
            const new_name = `mirror_${name}`
            mp.meta.name = new_name
            mirrored_points[new_name] = mp
            if (p.meta.asym == 'right') {
                p.meta.skip = true
            }
        }
        Object.assign(points, mirrored_points)
    }

    // removing temporary points
    
    const filtered = {}
    for (const [k, p] of Object.entries(points)) {
        if (p.meta.skip) continue
        filtered[k] = p
    }

    return filtered
}

exports.position = (points, shape) => {
    const shapes = {}
    for (const [pname, p] of Object.entries(points)) {
        shapes[pname] = p.position(u.deepcopy(shape))
    }
    return {models: shapes}
}