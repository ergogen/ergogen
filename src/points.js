const m = require('makerjs')
const u = require('./utils')
const a = require('./assert')
const prep = require('./prepare')
const anchor_lib = require('./anchor')

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

const render_zone = exports._render_zone = (zone_name, zone, anchor, global_key, units) => {

    // zone-wide sanitization

    a.unexpected(zone, `points.zones.${zone_name}`, ['columns', 'rows', 'key'])
    // the anchor comes from "above", because it needs other zones too (for references)
    const cols = a.sane(zone.columns || {}, `points.zones.${zone_name}.columns`, 'object')()
    const zone_wide_rows = a.sane(zone.rows || {}, `points.zones.${zone_name}.rows`, 'object')()
    for (const [key, val] of Object.entries(zone_wide_rows)) {
        zone_wide_rows[key] = val || {} // no check yet, as it will be extended later
    }
    const zone_wide_key = a.sane(zone.key || {}, `points.zones.${zone_name}.key`, 'object')()

    // algorithm prep

    const points = {}
    const rotations = []
    const zone_anchor = anchor.clone()
    // transferring the anchor rotation to "real" rotations
    rotations.push({
        angle: zone_anchor.r,
        origin: zone_anchor.p
    })
    // and now clear it from the anchor so that we don't apply it twice
    zone_anchor.r = 0

    // column layout

    if (!Object.keys(cols).length) {
        cols.default = {}
    }
    let first_col = true
    for (let [col_name, col] of Object.entries(cols)) {

        // column-level sanitization

        col = col || {}

        a.unexpected(
            col,
            `points.zones.${zone_name}.columns.${col_name}`,
            ['rows', 'key']
        )
        col.rows = a.sane(
            col.rows || {},
            `points.zones.${zone_name}.columns.${col_name}.rows`,
            'object'
        )()
        for (const [key, val] of Object.entries(col.rows)) {
            col.rows[key] = val || {} // again, no check yet, as it will be extended later
        }
        col.key = a.sane(
            col.key || {},
            `points.zones.${zone_name}.columns.${col_name}.key`,
            'object'
        )()

        // combining row data from zone-wide defs and col-specific defs

        const actual_rows = Object.keys(prep.extend(zone_wide_rows, col.rows))
        if (!actual_rows.length) {
            actual_rows.push('default')
        }

        // getting key config through the 5-level extension

        const keys = []
        const default_key = {
            stagger: units.$default_stagger,
            spread: first_col ? 0 : units.$default_spread,
            splay: units.$default_splay,
            origin: [0, 0],
            orient: 0,
            shift: [0, 0],
            rotate: 0,
            width: units.$default_width,
            height: units.$default_height,
            padding: units.$default_padding,
            skip: false,
            asym: 'both',
            colrow: '{{col.name}}_{{row}}',
            name: '{{zone.name}}_{{colrow}}'
        }
        for (const row of actual_rows) {
            const key = prep.extend(
                default_key,
                global_key,
                zone_wide_key,
                col.key,
                zone_wide_rows[row] || {},
                col.rows[row] || {}
            )

            key.zone = zone
            key.zone.name = zone_name
            key.col = col
            key.col.name = col_name
            key.row = row

            key.stagger = a.sane(key.stagger, `${key.name}.shift`, 'number')(units)
            key.spread = a.sane(key.spread, `${key.name}.spread`, 'number')(units)
            key.splay = a.sane(key.splay, `${key.name}.splay`, 'number')(units)
            key.origin = a.xy(key.origin, `${key.name}.origin`)(units)
            key.orient = a.sane(key.orient, `${key.name}.orient`, 'number')(units)
            key.shift = a.xy(key.shift, `${key.name}.shift`)(units)
            key.rotate = a.sane(key.rotate, `${key.name}.rotate`, 'number')(units)
            key.width = a.sane(key.width, `${key.name}.width`, 'number')(units)
            key.height = a.sane(key.height, `${key.name}.height`, 'number')(units)
            key.padding = a.sane(key.padding, `${key.name}.padding`, 'number')(units)
            key.skip = a.sane(key.skip, `${key.name}.skip`, 'boolean')()
            key.asym = a.in(key.asym, `${key.name}.asym`, ['left', 'right', 'both'])

            // templating support
            for (const [k, v] of Object.entries(key)) {
                if (a.type(v)(units) == 'string') {
                    key[k] = u.template(v, key)
                }
            }

            keys.push(key)
        }

        // setting up column-level anchor
        zone_anchor.x += keys[0].spread
        zone_anchor.y += keys[0].stagger
        const col_anchor = zone_anchor.clone()

        // applying col-level rotation (cumulatively, for the next columns as well)

        if (keys[0].splay) {
            push_rotation(
                rotations,
                keys[0].splay,
                col_anchor.clone().shift(keys[0].origin, false).p
            )
        }

        // actually laying out keys

        for (const key of keys) {
            let point = col_anchor.clone()
            for (const r of rotations) {
                point.rotate(r.angle, r.origin)
            }
            point.r += key.orient
            point.shift(key.shift)
            point.r += key.rotate
            point.meta = key
            points[key.name] = point
            col_anchor.y += key.padding
        }

        first_col = false
    }

    return points
}

const parse_axis = exports._parse_axis = (config, name, points, units) => {
    if (!['number', 'undefined'].includes(a.type(config)(units))) {
        const mirror_obj = a.sane(config || {}, name, 'object')()
        const distance = a.sane(mirror_obj.distance || 0, `${name}.distance`, 'number')(units)
        delete mirror_obj.distance
        let axis = anchor_lib.parse(mirror_obj, name, points)(units).x
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
        mp.meta = prep.extend(mp.meta, mp.meta.mirror || {})
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

exports.parse = (config, units) => {

    // config sanitization
    a.unexpected(config, 'points', ['zones', 'key', 'rotate', 'mirror'])
    const zones = a.sane(config.zones, 'points.zones', 'object')()
    const global_key = a.sane(config.key || {}, 'points.key', 'object')()
    const global_rotate = a.sane(config.rotate || 0, 'points.rotate', 'number')(units)
    const global_mirror = config.mirror
    let points = {}

    // rendering zones
    for (let [zone_name, zone] of Object.entries(zones)) {

        // zone sanitization
        zone = a.sane(zone || {}, `points.zones.${zone_name}`, 'object')()

        // extracting keys that are handled here, not at the zone render level
        const anchor = anchor_lib.parse(zone.anchor || {}, `points.zones.${zone_name}.anchor`, points)(units)
        const rotate = a.sane(zone.rotate || 0, `points.zones.${zone_name}.rotate`, 'number')(units)
        const mirror = zone.mirror
        delete zone.anchor
        delete zone.rotate
        delete zone.mirror

        // creating new points
        let new_points = render_zone(zone_name, zone, anchor, global_key, units)

        // simplifying the names in individual point "zones"
        const new_keys = Object.keys(new_points)
        const individual_key = `${zone_name}_default_default`
        if (new_keys.length == 1 && new_keys[0] == individual_key) {
            new_points[zone_name] = new_points[individual_key]
            new_points[zone_name].meta.name = zone_name
            delete new_points[individual_key]
        }

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

        // per-zone mirroring for the new keys
        const axis = parse_axis(mirror, `points.zones.${zone_name}.mirror`, points, units)
        if (axis) {
            const mirrored_points = {}
            for (const new_point of Object.values(new_points)) {
                const [mname, mp] = perform_mirror(new_point, axis)
                if (mp) {
                    mirrored_points[mname] = mp
                }
            }
            points = Object.assign(points, mirrored_points)
        }
    }

    // applying global rotation
    for (const point of Object.values(points)) {
        if (global_rotate) {
            point.rotate(global_rotate)
        }
    }

    // global mirroring for points that haven't been mirrored yet
    const global_axis = parse_axis(global_mirror, `points.mirror`, points, units)
    const global_mirrored_points = {}
    for (const point of Object.values(points)) {
        if (global_axis && point.mirrored === undefined) {
            const [mname, mp] = perform_mirror(point, global_axis)
            if (mp) {
                global_mirrored_points[mname] = mp
            }
        }
    }
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

exports.visualize = (points, units) => {
    const models = {}
    for (const [pname, p] of Object.entries(points)) {
        const w = p.meta.width
        const h = p.meta.height
        const rect = u.rect(w, h, [-w/2, -h/2])
        models[pname] = p.position(rect)
    }
    return {models: models}
}
