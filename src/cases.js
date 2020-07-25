const m = require('makerjs')
const u = require('./utils')
const a = require('./assert')

const Point = require('./point')

const makerjs2jscad = exports._makerjs2jscad = (model, resolution = 32) => {
    const commands = []
    m.model.walk(model, {
        onPath: wp => {
            const p = wp.pathContext
            switch (p.type) {
                case 'line':
                    commands.push(`new CSG.Path2D([ ${p.origin}, ${p.end} ]);`)
                    break
                case 'arc':
                    const angle_start = p.startAngle > p.endAngle ? p.startAngle - 360 : p.startAngle
                    commands.push(`CSG.Path2D.arc({
                        center: ${p.origin},
                        radius: ${p.radius},
                        startangle: ${angle_start},
                        endangle: ${p.endAngle},
                        resolution: ${resolution}
                    });`)
                    break
                case 'circle':
                    commands.push(`CSG.Path2D.arc({
                        center: ${p.origin},
                        radius: ${p.radius},
                        startangle: 0,
                        endangle: 360,
                        resolution: ${resolution}
                    });`)
                    break
                default:
                    throw new Error(`Can't convert path type "${p.type}" to jscad!`)
            }
        }
    })
    return commands
}


exports.parse = (config, points, outlines) => {

    const cases = a.sane(config, 'cases', 'object')
    const results = {}

    for (const [case_name, case_config] of Object.entries(cases)) {

        // config sanitization
        parts = a.sane(case_config, `cases.${case_name}`, 'array')

        let part_index = 0
        for (const part of parts) {
            const part_name = `cases.${case_name}[${++part_index}]`
            a.detect_unexpected(part, part_name, ['outline', 'extrude', 'shift', 'rotate', 'operation'])
            const outline = outlines[part.outline]
            a.assert(outline, `Field ${part_name}.outline does not name a valid outline!`)
            const extrude = a.sane(part.extrude || 1, `${part_name}.extrude`, 'number')
            const shift = a.numarr(part.shift || [0, 0, 0], `${part_name}.shift`, 3)
            const rotate = a.numarr(part.rotate || [0, 0, 0], `${part_name}.rotate`, 3)
            const operation = a.in(part.operation || 'add', `${part_name}.operation`, ['add', 'subtract', 'intersect', 'stack'])

            let op = u.union
            if (operation == 'subtract') op = u.subtract
            else if (operation == 'intersect') op = u.intersect
            else if (operation == 'stack') op = u.stack


        }
    }

    return results
}