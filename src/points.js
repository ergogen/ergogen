const m = require('makerjs')
const u = require('./utils')

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

const render_zone = (cols, rows, anchor=new Point(), reverse=false) => {

    const sign = reverse ? -1 : 1
    const points = {}
    const rotations = []
    
    // transferring the anchor rotation to "real" rotations
    rotations.push({
        angle: anchor.r,
        origin: anchor.p
    })

    for (const col of cols) {
        
        anchor.y += col.stagger || 0        
        const col_anchor = anchor.clone()
        // clear potential rotations, as they will get re-applied anyway
        // and we don't want to apply them twice...
        col_anchor.r = 0

        // combine row data from zone-wide defs and col-specific defs
        const col_specific = col.rows || []
        const zone_wide = rows || []
        const actual_rows = []
        for (let i = 0; i < zone_wide.length && i < col_specific.length; ++i) {
            actual_rows.push(Object.assign({}, zone_wide[i], col_specific[i]))
        }

        for (const row of actual_rows) {
            let point = col_anchor.clone()
            for (const r of rotations) {
                point.rotate(r.angle, r.origin)
            }
            point.r += col.angle || 0
            const name = `${col.name}_${row.name}`
            point.meta = {col, row, name}
            points[name] = point

            col_anchor.y += row.padding || 19
        }

        if (col.rotate) {
            push_rotation(
                rotations,
                col.rotate,
                anchor.add(col.origin || [0, 0]).p
            )
        }

        anchor.x += sign * (col.padding || 19)
    }

    return points
}

const anchor = (raw, points={}) => {
    let a = new Point()
    if (raw) {
        if (raw.ref && points[raw.ref]) {
            a = points[raw.ref].clone()
        }
        if (raw.shift) {
            a.x += raw.shift[0]
            a.y += raw.shift[1]
        }
        a.r += raw.angle || 0
    }
    return a
}

exports.parse = (config) => {

    let points = {}

    for (const zone of Object.values(config.zones)) {
        points = Object.assign(points, render_zone(
            zone.columns || [],
            zone.rows || [{name: 'default'}],
            anchor(zone.anchor, points),
            !!zone.reverse
        ))
    }

    if (config.angle) {
        for (const p of Object.values(points)) {
            p.rotate(config.angle)
        }
    }

    if (config.mirror) {
        let axis = anchor(config.mirror, points).x
        axis += (config.mirror.distance || 0) / 2
        const mirrored_points = {}
        for (const [name, p] of Object.entries(points)) {
            if (p.meta.col.asym == 'left' || p.meta.row.asym == 'left') continue
            const mp = p.clone().mirror(axis)
            mp.meta.mirrored = true
            delete mp.meta.asym
            mirrored_points[`mirror_${name}`] = mp
            if (p.meta.col.asym == 'right' || p.meta.row.asym == 'right') {
                p.meta.col.skip = true
            }
        }
        Object.assign(points, mirrored_points)
    }
    
    const filtered = {}
    for (const [k, p] of Object.entries(points)) {
        if (p.meta.col.skip || p.meta.row.skip) continue
        filtered[k] = p
    }

    return filtered
}