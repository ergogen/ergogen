const m = require('makerjs')
const fs = require('fs-extra')

const outline = (points, radius, expansion=5, patches=[]) => {

}

exports.draw = (points, config) => {
    const lefts = {}
    const rights = {}
    for (const [k, p] of Object.entries(points)) {
        if (p.meta.mirrored) {
            rights[k] = p
        } else {
            lefts[k] = p
        }
    }

    
}