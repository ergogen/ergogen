const m = require('makerjs')
const fs = require('fs-extra')
const assert = require('assert').strict

const u = require('./utils')



const outline = (points, config) => {

    assert.ok(config.outline)
    const footprint = config.outline.footprint || 18
    const corner = config.outline.corner || 0
    const global_bind = config.outline.bind || 5

    let glue = {paths: {}}
    
    if (config.outline.glue) {

        const glue_conf = config.outline.glue

        const internal_part = (line) => {
            // taking the middle part only, so that we don't interfere with corner rounding
            return u.line(m.point.middle(line, 0.4), m.point.middle(line, 0.6))
        }

        const get_line = (def={}) => {
            const point = points[def.key]
            if (!point) throw new Error(`Point ${def.key} not found...`)
            const rect = m.model.originate(point.rect(footprint))
            line = rect.paths[def.line || 'top']
            return internal_part(line)
        }

        assert.ok(glue_conf.top)
        const tll = get_line(glue_conf.top.left)
        const trl = get_line(glue_conf.top.right)
        const tip = m.path.converge(tll, trl)
        const tlp = u.eq(tll.origin, tip) ? tll.end : tll.origin
        const trp = u.eq(trl.origin, tip) ? trl.end : trl.origin

        assert.ok(glue_conf.bottom)
        const bll = get_line(glue_conf.bottom.left)
        const brl = get_line(glue_conf.bottom.right)
        const bip = m.path.converge(bll, brl)
        const blp = u.eq(bll.origin, bip) ? bll.end : bll.origin
        const brp = u.eq(brl.origin, bip) ? brl.end : brl.origin

        const left_waypoints = []
        const right_waypoints = []

        for (const w of glue_conf.waypoints || []) {
            const percent = w.percent / 100
            const center_x = tip[0] + percent * (bip[0] - tip[0])
            const center_y = tip[1] + percent * (bip[1] - tip[1])
            const left_x = center_x - (w.left || w.width / 2)
            const right_x = center_x + (w.right || w.width / 2)
            left_waypoints.push([left_x, center_y])
            right_waypoints.unshift([right_x, center_y])
        }

        const waypoints =
            [trp, tip, tlp]
            .concat(left_waypoints)
            .concat([blp, bip, brp])
            .concat(right_waypoints)

        glue = u.poly(waypoints)

    }

    // TODO
    jsu = require('util')

    let i = 0
    const keys = {}
    let left_keys = {}
    let right_keys = {}
    for (const zone of Object.values(config.zones)) {
        // interate cols in reverse order so they can
        // always overlap with the growing middle patch
        for (const col of zone.columns.slice().reverse()) {
            for (const [pname, p] of Object.entries(points)) {
                if (p.meta.col.name != col.name) continue

                let from_x = -footprint / 2, to_x = footprint / 2
                let from_y = -footprint / 2, to_y = footprint / 2
                const bind = p.meta.row.bind || p.meta.col.bind || global_bind
                const mirrored = p.meta.mirrored
                
                const bind_x = p.meta.row.bind_x || p.meta.col.bind_x
                if ((bind_x == 'left' && !mirrored) || (bind_x == 'right' && mirrored) || bind_x == 'both') {
                    from_x -= bind
                }
                if ((bind_x == 'right' && !mirrored) || (bind_x == 'left' && mirrored) || bind_x == 'both') {
                    to_x += bind
                }

                const bind_y = p.meta.row.bind_y || p.meta.col.bind_y
                if (bind_y == 'down' || bind_y == 'both') {
                    from_y -= bind
                }
                if (bind_y == 'up' || bind_y == 'both') {
                    to_y += bind
                }

                let key = new m.models.RoundRectangle(to_x - from_x, to_y - from_y, corner)
                key = m.model.moveRelative(key, [from_x, from_y])
                key = p.position(key)
                // console.log(i+1, pname, jsu.inspect(key, true, null, true))
                // if (i == 7) throw 7
                keys[pname] = u.deepcopy(p.position(u.rect(14, 14, [-7, -7])))
                if (mirrored) {
                    // TODO running into the problem again where the right side doesn't combine properly
                    // have to debug this at a lower level, it might be a bug in the makerjs source :/
                    // first step is to export these inspections and create a minimal reproduction
                    // if that fails as well, I have to dive into the combineUnion code...

                    // if (pname === 'mirror_inner_top') {
                    //     u.dump_model({a: right_keys, b: key}, `debug_bad`, true)
                    // }


                    right_keys = m.model.combineUnion(key, right_keys)
                    u.dump_model({a: glue, c: right_keys}, `right_${++i}`)
                } else {

                    // if (pname === 'inner_top') {
                    //     u.dump_model({a: left_keys, b: key}, `debug_good`, true)
                    // }

                    left_keys = m.model.combineUnion(key, left_keys)
                    u.dump_model({a: glue, b: left_keys}, `left_${++i}`)
                }

                // u.dump_model({a: glue}, `glue_${i++}`)
            }
        }
    }


    u.dump_model({a: glue, b: left_keys, c: {models: right_keys}}, `all_before`)
    glue = m.model.combineUnion(glue, left_keys)
    u.dump_model({a: glue, b: left_keys, c: {models: right_keys}}, `all_after_left`)
    glue = m.model.combineUnion(glue, right_keys)
    u.dump_model({a: glue, b: {models: keys}}, `fullll`)


    // glue = m.model.outline(glue, expansion)
    // const keys = {}
    // // let i = 1
    // for (const zone of Object.values(config.zones)) {
    //     // interate cols in reverse order so they can
    //     // always overlap with the growing middle patch
    //     for (const col of zone.columns.slice().reverse()) {
    //         for (const [pname, p] of Object.entries(points)) {
    //             if (p.meta.col.name != col.name) continue

    //             // let key = new m.models.RoundRectangle(footprint, footprint, corner)
    //             let key = u.rect(footprint, footprint)
    //             key = m.model.moveRelative(key, [-footprint/2, -footprint/2])
    //             key = p.position(key)
    //             keys[pname] = u.deepcopy(key)
    //             key = m.model.outline(key, expansion)
    //             glue = m.model.combineUnion(glue, key)

    //             // u.dump_model(keys, `keys_${i}`)
    //             // u.dump_model({a: glue}, `glue_${i++}`)
    //         }
    //     }
    // }

    // u.dump_model({a: glue, b: {models: keys}}, `all`)
    // glue = m.model.outline(glue, expansion, 1, true)
    // u.dump_model({a: glue}, `glue_post`)





    // u.dump_model({
    //     a: {
    //         models: {a: glue},
    //         // paths: {
    //         //     tll: tll,
    //         //     trl: trl,
    //         //     tip: u.circle(tip, 1),
    //         //     tlp: u.circle(tlp, 1),
    //         //     trp: u.circle(trp, 1),
    //         //     bll: bll,
    //         //     brl: brl,
    //         //     bip: u.circle(bip, 1),
    //         //     blp: u.circle(blp, 1),
    //         //     brp: u.circle(brp, 1),
    //         // }
    //     },
    //     b: { models: keys }
    // }, 'valami', true)

    // throw 3



    // let tl = m.model.moveRelative(m.model.rotate(u.rect(a_lot, size, [-size/2, -size/2]), tlp.r), tlp.p)
    // let tr = m.model.moveRelative(m.model.rotate(u.rect(a_lot, size, [-a_lot+size/2, -size/2]), trp.r), trp.p)
    // tl = m.model.originate(tl)
    // tr = m.model.originate(tr)
    // let top_intersect = m.path.intersection(tl.paths.top, tr.paths.top).intersectionPoints
    // if (!top_intersect) {
    //     throw new Error('Top intersect')
    // }
    // console.log(tlp.p, tl, tl.paths.top, ',,,', trp.p, tr, tr.paths.top, top_intersect)

    

    // // create the two bottoms
    // assert.ok(config.bottom.left)
    // assert.ok(config.bottom.right)
    // const blp = points[config.bottom.left]
    // const brp = points[config.bottom.right]

    // // create middle "patch"
    // const tll = new m.paths.Line(tlp.p, tlp.add([a_lot, 0]).rotate(tlp.r, tlp.p).p)
    // const trl = new m.paths.Line(trp.p, trp.add([a_lot, 0]).rotate(trp.r, trp.p).p)
    

    // const bll = new m.paths.Line(blp.p, blp.add([a_lot, 0]).rotate(blp.r, blp.p).p)
    // const brl = new m.paths.Line(brp.p, brp.add([a_lot, 0]).rotate(brp.r, brp.p).p)
    // const bottom_intersect = m.path.intersection(bll, brl).intersectionPoints[0]


    // console.log(tll, trl, top_intersect)
    // throw 2

    // for (const p of Object.values(points)) {
    //     const r = new m.models.RoundRectangle(size, size, config.corner || 0)
    // }
}

exports.draw = (points, config) => {
    // const lefts = {}
    // const rights = {}
    // for (const [k, p] of Object.entries(points)) {
    //     if (p.meta.mirrored) {
    //         rights[k] = p
    //     } else {
    //         lefts[k] = p
    //     }
    // }


    // TODO this is just a test
    outline(points, config)

    
}