const m = require('makerjs')
const u = require('./utils')
const a = require('./assert')

exports.parse = (config, outlines) => {

    const cases_config = a.sane(config, 'cases', 'object')

    const scripts = {}
    const cases = {}
    const results = {}

    const resolve = (case_name, resolved_scripts=new Set(), resolved_cases=new Set()) => {
        for (const o of Object.values(cases[case_name].outline_dependencies)) {
            resolved_scripts.add(o)
        }
        for (const c of Object.values(cases[case_name].case_dependencies)) {
            resolved_cases.add(c)
            resolve(c, resolved_scripts, resolved_cases)
        }
        result = []
        for (const o of resolved_scripts) {
            result.push(scripts[o] + '\n\n')
        }
        for (const c of resolved_cases) {
            result.push(cases[c].body)
        }
        result.push(cases[case_name].body)
        result.push(`
        
            function main() {
                return ${case_name}_case_fn();
            }

        `)
        return result.join('')
    }

    for (const [case_name, case_config] of Object.entries(cases_config)) {

        // config sanitization
        const parts = a.sane(case_config, `cases.${case_name}`, 'array')

        const body = []
        const case_dependencies = []
        const outline_dependencies = []
        let part_index = 0
        for (const part of parts) {
            const part_name = `cases.${case_name}[${++part_index}]`
            const part_var = `${case_name}__part_${part_index}`
            a.detect_unexpected(part, part_name, ['type', 'name', 'extrude', 'shift', 'rotate', 'operation'])
            const type = a.in(part.type, `${part_name}.type`, ['outline', 'case'])
            const name = a.sane(part.name, `${part_name}.name`, 'string')
            const shift = a.numarr(part.shift || [0, 0, 0], `${part_name}.shift`, 3)
            const rotate = a.numarr(part.rotate || [0, 0, 0], `${part_name}.rotate`, 3)
            const operation = a.in(part.operation || 'add', `${part_name}.operation`, ['add', 'subtract', 'intersect'])

            let base
            if (type == 'outline') {
                const extrude = a.sane(part.extrude || 1, `${part_name}.extrude`, 'number')
                const outline = outlines[name]
                a.assert(outline, `Field "${part_name}.name" does not name a valid outline!`)
                if (!scripts[name]) {
                    scripts[name] = m.exporter.toJscadScript(outline, {
                        functionName: `${name}_outline_fn`,
                        extrude: extrude,
                        indent: 4
                    })
                }
                outline_dependencies.push(name)
                base = `${name}_outline_fn()`
            } else {
                a.assert(part.extrude === undefined, `Field "${part_name}.extrude" should not be used when type=case!`)
                a.in(name, `${part_name}.name`, Object.keys(cases))
                case_dependencies.push(name)
                base = `${name}_case_fn()`
            }

            let op = 'union'
            if (operation == 'subtract') op = 'subtract'
            else if (operation == 'intersect') op = 'intersect'

            let op_statement = `let result = ${part_var};`
            if (part_index > 1) {
                op_statement = `result = result.${op}(${part_var});`
            }

            body.push(`

                // creating part ${part_index} of case ${case_name}
                let ${part_var} = ${base};

                // make sure that rotations are relative
                let ${part_var}_bounds = ${part_var}.getBounds();
                let ${part_var}_x = ${part_var}_bounds[0].x + (${part_var}_bounds[1].x - ${part_var}_bounds[0].x) / 2
                let ${part_var}_y = ${part_var}_bounds[0].y + (${part_var}_bounds[1].y - ${part_var}_bounds[0].y) / 2
                ${part_var} = translate([-${part_var}_x, -${part_var}_y, 0], ${part_var});
                ${part_var} = rotate(${JSON.stringify(rotate)}, ${part_var});
                ${part_var} = translate([${part_var}_x, ${part_var}_y, 0], ${part_var});

                ${part_var} = translate(${JSON.stringify(shift)}, ${part_var});
                ${op_statement}
                
            `)
        }

        cases[case_name] = {
            body: `

                function ${case_name}_case_fn() {
                    ${body.join('')}
                    return result;
                }
            
            `,
            case_dependencies,
            outline_dependencies
        }

        results[case_name] = resolve(case_name)
    }

    return results
}