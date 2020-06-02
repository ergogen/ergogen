const m = require('makerjs')
const fs = require('fs-extra')
const assert = require('assert').strict

const u = require('./utils')



const outline = (points, config) => {

    const holes = {}
    for (const [key, p] of Object.entries(points)) {
        holes[key] = p.rect(14)
    }

    if (config.glue) {

        const get_line = (def={}) => {
            const point = points[def.key]
            if (!point) throw new Error(`Point ${def.key} not found...`)
            const size = config.footprint || 18
            const rect = m.model.originate(point.rect(size))
            line = rect.paths[def.line || 'top']
            return line
        }

        

        assert.ok(config.glue.top)
        const tll = get_line(config.glue.top.left)
        const trl = get_line(config.glue.top.right)
        const tip = m.path.converge(tll, trl)
        const tlp = u.eq(tll.origin, tip) ? tll.end : tll.origin
        const trp = u.eq(trl.origin, tip) ? trl.end : trl.origin

        assert.ok(config.glue.bottom)
        const bll = get_line(config.glue.bottom.left)
        const brl = get_line(config.glue.bottom.right)
        const bip = m.path.converge(bll, brl)
        const blp = u.eq(bll.origin, bip) ? bll.end : bll.origin
        const brp = u.eq(brl.origin, bip) ? brl.end : brl.origin




        u.dump_model({
            a: {
                models: holes,
                paths: {
                    tll: tll,
                    trl: trl,
                    tip: u.circle(tip, 1),
                    tlp: u.circle(tlp, 1),
                    trp: u.circle(trp, 1),
                    bll: bll,
                    brl: brl,
                    bip: u.circle(bip, 1),
                    blp: u.circle(blp, 1),
                    brp: u.circle(brp, 1),
                }
            }
        }, 'valami', true)
    
        throw 3


    }


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
    outline(points, config.outline)

    
}