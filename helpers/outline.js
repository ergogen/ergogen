const m = require('makerjs')
const fs = require('fs-extra')
const assert = require('assert').strict

const u = require('./utils')

const a_lot = 100



const outline = (points, size, config={}) => {
    const models = {}

    // create the two tops
    assert.ok(config.top.left)
    assert.ok(config.top.right)
    const tlp = points[config.top.left]
    const trp = points[config.top.right]

    tl = m.model.moveRelative(m.model.rotate(u.rect(a_lot, size, [-size/2, -size/2]), tlp.r), tlp.p)
    tr = m.model.moveRelative(m.model.rotate(u.rect(a_lot, size, [-a_lot+size/2, -size/2]), trp.r), trp.p)
    tl = m.model.originate(tl)
    tr = m.model.originate(tr)
    const top_intersect = m.path.intersection(tl.paths.top, tr.paths.top).intersectionPoints[0]
    console.log(tlp.p, tl, tl.paths.top, ',,,', trp.p, tr, tr.paths.top, top_intersect)

    u.dump_model({
        a: {
            // models: {tl, tr},
            paths: {
                tll: tl.paths.top,
                trl: tr.paths.top,
                tl: u.circle(tlp.p, 1),
                tr: u.circle(trp.p, 1),
                c: u.circle(top_intersect, 1)
            }
        }
    }, 'valami', true)

    throw 2

    // create the two bottoms
    assert.ok(config.bottom.left)
    assert.ok(config.bottom.right)
    const blp = points[config.bottom.left]
    const brp = points[config.bottom.right]

    // create middle "patch"
    const tll = new m.paths.Line(tlp.p, tlp.add([a_lot, 0]).rotate(tlp.r, tlp.p).p)
    const trl = new m.paths.Line(trp.p, trp.add([a_lot, 0]).rotate(trp.r, trp.p).p)
    

    const bll = new m.paths.Line(blp.p, blp.add([a_lot, 0]).rotate(blp.r, blp.p).p)
    const brl = new m.paths.Line(brp.p, brp.add([a_lot, 0]).rotate(brp.r, brp.p).p)
    const bottom_intersect = m.path.intersection(bll, brl).intersectionPoints[0]


    console.log(tll, trl, top_intersect)
    throw 2

    for (const p of Object.values(points)) {
        const r = new m.models.RoundRectangle(size, size, config.corner || 0)
    }
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
    outline(points, 18, config.outline)

    
}