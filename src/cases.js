const m = require('makerjs')
const u = require('./utils')
const a = require('./assert')

exports.parse = (config, outlines) => {

    const cases = a.sane(config, 'cases', 'object')
    const results = {}

    for (const [case_name, case_config] of Object.entries(cases)) {

        // config sanitization
        const parts = a.sane(case_config, `cases.${case_name}`, 'array')

        const scripts = []
        const main = []

        let part_index = 0
        for (const part of parts) {
            const part_name = `cases.${case_name}[${++part_index}]`
            a.detect_unexpected(part, part_name, ['outline', 'extrude', 'shift', 'rotate', 'operation'])
            const outline = outlines[part.outline]
            a.assert(outline, `Field ${part_name}.outline does not name a valid outline!`)
            const extrude = a.sane(part.extrude || 1, `${part_name}.extrude`, 'number')
            const shift = a.numarr(part.shift || [0, 0, 0], `${part_name}.shift`, 3)
            const rotate = a.numarr(part.rotate || [0, 0, 0], `${part_name}.rotate`, 3)
            const operation = a.in(part.operation || 'add', `${part_name}.operation`, ['add', 'subtract', 'intersect'])

            let op = 'union'
            if (operation == 'subtract') op = 'subtract'
            else if (operation == 'intersect') op = 'intersect'

            const part_fn = `${part.outline}_fn`
            const part_var = `${part.outline}_var`

            scripts.push(m.exporter.toJscadScript(outline, {
                functionName: part_fn,
                extrude: extrude
            }))

            let op_statement = `let ${case_name} = ${part_var};`
            if (part_index > 1) {
                op_statement = `${case_name} = ${case_name}.${op}(${part_var});`
            }

            main.push(`

                // creating part ${part_index} of case ${case_name}
                let ${part_var} = ${part_fn}();
                ${part_var} = rotate(${JSON.stringify(rotate)}, ${part_var});
                ${part_var} = translate(${JSON.stringify(shift)}, ${part_var});
                ${op_statement}
                
            `)
        }

        results[case_name] = `

            // individual makerjs exports
            ${scripts.join('\n\n')}

            // combination of parts
            function main() {
                ${main.join('')}
                return ${case_name};
            }

        `
    }

    return results
}