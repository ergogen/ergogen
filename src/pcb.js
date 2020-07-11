const m = require('makerjs')
const u = require('./utils')
const a = require('./assert')

const makerjs2kicad = exports._makerjs2kicad = model => {
    const grs = []
    const xy = val => `${val[0]} ${val[1]}`
    m.model.walk(model, {
        onPath: wp => {
            const p = wp.pathContext
            switch (p.type) {
                case 'line':
                    grs.push(`(gr_line (start ${xy(p.origin)}) (end ${xy(p.end)}) (angle 90) (layer Edge.Cuts) (width 0.15))`)
                    break
                case 'arc':
                    // console.log(require('util').inspect(p, false, 200))
                    // throw 2
                    const center = p.origin
                    const angle_start = Math.min(p.startAngle, p.endAngle)
                    const angle_diff = Math.abs(p.endAngle - p.startAngle)
                    const end = m.point.rotate(m.point.add(center, [p.radius, 0]), angle_start, center)
                    grs.push(`(gr_arc (start ${xy(center)}) (end ${xy(end)}) (angle ${angle_diff}) (layer Edge.Cuts) (width 0.15))`)
                    break
                case 'circle':
                    break
                default:
                    throw new Error(`Can't convert path type "${p.type}" to kicad!`)
            }
        }
    })
    return grs
}

exports.parse = (config, points, outlines) => {
    a.detect_unexpected(config, 'pcb', ['edge', 'footprints'])
    const edge = outlines[config.edge]
    if (!edge) throw new Error(`Field "pcb.edge" doesn't name a valid outline!`)
    const kicad_edge = makerjs2kicad(edge)

    console.log(kicad_edge.join('\n'))
    throw 28
}