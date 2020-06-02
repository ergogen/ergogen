const m = require('makerjs')
const fs = require('fs-extra')

const u = require('./utils')

const Point = exports.Point = class Point {
    constructor(x=0, y=0, r=0, meta={}) {
        if (Array.isArray(x)) {
            this.x = x[0]
            this.y = x[1]
            this.r = 0
            this.meta = {}
        } else {
            this.x = x
            this.y = y
            this.r = r
            this.meta = meta
        }
    }

    get p() {
        return [this.x, this.y]
    }

    set p(val) {
        [this.x, this.y] = val
    }

    add(a) {
        const res = this.clone()
        res.x += a[0]
        res.y += a[1]
        return res
    }

    shift(s) {
        this.x += s[0]
        this.y += s[1]
        return this
    }

    rotate(angle, origin=[0, 0]) {
        this.p = m.point.rotate(this.p, angle, origin)
        this.r += angle
        return this
    }

    mirror(x) {
        this.x = 2 * x - this.x
        this.r = -this.r
        return this
    }

    clone() {
        return new Point(
            this.x,
            this.y,
            this.r,
            u.deepcopy(this.meta)
        )
    }

    rect(size=14) {
        let rect = u.rect(size, size, [-size/2, -size/2], this.meta.mirrored)
        return m.model.moveRelative(m.model.rotate(rect, this.r), this.p)
    }
}

const dump = exports.dump = (points, opts={}) => {

    const s = (opts.side || 14) / 2

    const models = {}
    for (const [key, point] of Object.entries(points)) {
        const paths = {
            l: u.line([-s, -s], [-s,  s]),
            t: u.line([-s,  s], [ s,  s]),
            r: u.line([ s,  s], [ s, -s]),
            b: u.line([ s, -s], [-s, -s])
        }
        models[key] = m.model.moveRelative(m.model.rotate({paths}, point.r), point.p)
    }

    const assembly = m.model.originate({
        models,
        units: 'mm'
    })

    fs.writeFileSync(`${opts.file || 'dump'}_points.json`, JSON.stringify(points, null, '    '))
    fs.writeFileSync(`${opts.file || 'dump'}_assembly.json`, JSON.stringify(assembly, null, '    '))
    fs.writeFileSync(`${opts.file || 'dump'}.dxf`, m.exporter.toDXF(assembly))
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

        for (const row of col.rows || rows) {
            let point = col_anchor.clone()
            for (const r of rotations) {
                point.rotate(r.angle, r.origin)
            }
            point.r += col.angle || 0
            point.meta = {col, row}

            const key = `${col.name}_${row.name}`
            points[key] = point

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
        let x = anchor(config.mirror, points).x
        x += (config.mirror.distance || 0) / 2
        const mirrored_points = {}
        for (const [name, p] of Object.entries(points)) {
            if (p.meta.col.asym == 'left' || p.meta.row.asym == 'left') continue
            const mp = p.clone().mirror(x)
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