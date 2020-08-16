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

    a.detect_unexpected(zone, `points.zones.${zone_name}`, ['columns', 'rows', 'key'])
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

    let first_col = true
    for (let [col_name, col] of Object.entries(cols)) {

        // column-level sanitization

        col = col || {}

        a.detect_unexpected(
            col,
            `points.zones.${zone_name}.columns.${col_name}`,
            ['stagger', 'spread', 'rotate', 'origin', 'rows', 'row_overrides', 'key']
        )
        col.stagger = a.sane(
            col.stagger || 0,
            `points.zones.${zone_name}.columns.${col_name}.stagger`,
            'number'
        )
        col.spread = a.sane(
            col.spread || (first_col ? 0 : 19),
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
        let override = false
        col.rows = a.sane(
            col.rows || {},
            `points.zones.${zone_name}.columns.${col_name}.rows`,
            'object'
        )
        if (col.row_overrides) {
            override = true
            col.rows = a.sane(
                col.row_overrides,
                `points.zones.${zone_name}.columns.${col_name}.row_overrides`,
                'object'
            )
        }
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

        // propagating object key to name field

        col.name = col_name

        // combining row data from zone-wide defs and col-specific defs
        // (while also handling potential overrides)

        const actual_rows = override ? Object.keys(col.rows)
            : Object.keys(a.extend(zone_wide_rows, col.rows))

        // setting up column-level anchor

        anchor.x += col.spread
        anchor.y += col.stagger
        const col_anchor = anchor.clone()
        // clear potential rotations, as they will get re-applied anyway
        // and we don't want to apply them twice...
        col_anchor.r = 0

        // applying col-level rotation (cumulatively, for the next columns as well)

        if (col.rotate) {
            push_rotation(
                rotations,
                col.rotate,
                col_anchor.clone().shift(col.origin, false).p
            )
        }

        // getting key config through the 5-level extension

        const keys = []
        const default_key = {
            shift: [0, 0],
            rotate: 0,
            padding: 19,
            skip: false,
            asym: 'both'
        }
        for (const row of actual_rows) {
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
            key.asym = a.in(key.asym, `${key.name}.asym`, ['left', 'right', 'both'])
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

        first_col = false
    }

    return points
}

const parse_axis = exports._parse_axis = (config, name, points) => {
    if (!['number', 'undefined'].includes(a.type(config))) {
        const mirror_obj = a.sane(config || {}, name, 'object')
        const distance = a.sane(mirror_obj.distance || 0, `${name}.distance`, 'number')
        delete mirror_obj.distance
        let axis = a.anchor(mirror_obj, name, points).x
        axis += distance / 2
        return axis
    } else return config
}

const perform_mirror = exports._perform_mirror = (point, axis) => {
    if (axis !== undefined) {
        point.meta.mirrored = false
        if (point.meta.asym == 'left') return ['', null]
        const mp = point.clone().mirror(axis)
        const mirrored_name = `mirror_${point.meta.name}`
        mp.meta = a.extend(mp.meta, mp.meta.mirror || {})
        mp.meta.name = mirrored_name
        mp.meta.colrow = `mirror_${mp.meta.colrow}`
        mp.meta.mirrored = true
        if (point.meta.asym == 'right') {
            point.meta.skip = true
        }
        return [mirrored_name, mp]
    }
    return ['', null]
}

exports.parse = (config = {}) => {

    // config sanitization
    a.detect_unexpected(config, 'points', ['zones', 'key', 'rotate', 'mirror'])
    const zones = a.sane(config.zones || {}, 'points.zones', 'object')
    const global_key = a.sane(config.key || {}, 'points.key', 'object')
    const global_rotate = a.sane(config.rotate || 0, 'points.rotate', 'number')
    const global_mirror = config.mirror
    let points = {}
    let mirrored_points = {}
    let all_points = {}

    // rendering zones
    for (let [zone_name, zone] of Object.entries(zones)) {

        // handle zone-level `extends` clauses
        zone = a.inherit('points.zones', zone_name, zones)

        // extracting keys that are handled here, not at the zone render level
        const anchor = a.anchor(zone.anchor || {}, `points.zones.${zone_name}.anchor`, all_points)
        const rotate = a.sane(zone.rotate || 0, `points.zones.${zone_name}.rotate`, 'number')
        const mirror = zone.mirror
        delete zone.anchor
        delete zone.rotate
        delete zone.mirror

        // creating new points
        const new_points = render_zone(zone_name, zone, anchor, global_key)

        // adjusting new points
        for (const [new_name, new_point] of Object.entries(new_points)) {
            
            // issuing a warning for duplicate keys
            if (Object.keys(points).includes(new_name)) {
                throw new Error(`Key "${new_name}" defined more than once!`)
            }

            // per-zone rotation
            if (rotate) {
                new_point.rotate(rotate)
            }
        }

        // adding new points so that they can be referenced from now on
        points = Object.assign(points, new_points)
        all_points = Object.assign(all_points, points)

        // per-zone mirroring for the new keys
        const axis = parse_axis(mirror, `points.zones.${zone_name}.mirror`, all_points)
        if (axis) {
            for (const new_point of Object.values(new_points)) {
                const [mname, mp] = perform_mirror(new_point, axis)
                if (mp) {
                    mirrored_points[mname] = mp
                    all_points[mname] = mp
                }
            }
        }
    }

    // merging regular and early-mirrored points
    points = Object.assign(points, mirrored_points)

    // applying global rotation
    for (const point of Object.values(points)) {
        if (global_rotate) {
            point.rotate(global_rotate)
        }
    }

    // global mirroring for points that haven't been mirrored yet
    const global_axis = parse_axis(global_mirror, `points.mirror`, points)
    const global_mirrored_points = {}
    for (const point of Object.values(points)) {
        if (global_axis && point.mirrored === undefined) {
            const [mname, mp] = perform_mirror(point, global_axis)
            if (mp) {
                global_mirrored_points[mname] = mp
            }
        }
    }

    // merging the global-mirrored points as well
    points = Object.assign(points, global_mirrored_points)

    // removing temporary points
    const filtered = {}
    for (const [k, p] of Object.entries(points)) {
        if (p.meta.skip) continue
        filtered[k] = p
    }

    // done
    return filtered
}

exports.position = (points, shape) => {
    const shapes = {}
    for (const [pname, p] of Object.entries(points)) {
        shapes[pname] = p.position(u.deepcopy(shape))
    }
    return {models: shapes}
}