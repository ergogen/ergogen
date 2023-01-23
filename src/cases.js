const m = require('makerjs')
const a = require('./assert')
const o = require('./operation')

exports.parse = (config, outlines, units) => {

    const cases_config = a.sane(config, 'cases', 'object')()

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
        const result = []
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

    for (let [case_name, case_config] of Object.entries(cases_config)) {

        // config sanitization
        if (a.type(case_config)() == 'array') {
            case_config = {...case_config}
        }
        const parts = a.sane(case_config, `cases.${case_name}`, 'object')()

        const body = []
        const case_dependencies = []
        const outline_dependencies = []
        let first = true
        for (let [part_name, part] of Object.entries(parts)) {
            if (a.type(part)() == 'string') {
                part = o.operation(part, {
                    outline: Object.keys(outlines),
                    case: Object.keys(cases)
                }, ['case', 'outline'])
            }
            const part_qname = `cases.${case_name}.${part_name}`
            const part_var = `${case_name}__part_${part_name}`
            a.unexpected(part, part_qname, ['what', 'name', 'extrude', 'shift', 'rotate', 'operation'])
            const what = a.in(part.what || 'outline', `${part_qname}.what`, ['outline', 'case'])
            const name = a.sane(part.name, `${part_qname}.name`, 'string')()
            const shift = a.numarr(part.shift || [0, 0, 0], `${part_qname}.shift`, 3)(units)
            const rotate = a.numarr(part.rotate || [0, 0, 0], `${part_qname}.rotate`, 3)(units)
            const operation = a.in(part.operation || 'add', `${part_qname}.operation`, ['add', 'subtract', 'intersect'])

            let base
            if (what == 'outline') {
                const extrude = a.sane(part.extrude || 1, `${part_qname}.extrude`, 'number')(units)
                const outline = outlines[name]
                a.assert(outline, `Field "${part_qname}.name" does not name a valid outline!`)
                // This is a hack to separate multiple calls to the same outline with different extrude values
                // I know it needlessly duplicates a lot of code, but it's the quickest fix in the short term
                // And on the long run, we'll probably be moving to CADQuery anyway...
                const extruded_name = `${name}_extrude_` + ('' + extrude).replace(/\D/g, '_')
                if (!scripts[extruded_name]) {
                    scripts[extruded_name] = m.exporter.toJscadScript(outline, {
                        functionName: `${extruded_name}_outline_fn`,
                        extrude: extrude,
                        indent: 4
                    })
                }
                outline_dependencies.push(extruded_name)
                base = `${extruded_name}_outline_fn()`
            } else {
                a.assert(part.extrude === undefined, `Field "${part_qname}.extrude" should not be used when what=case!`)
                a.in(name, `${part_qname}.name`, Object.keys(cases))
                case_dependencies.push(name)
                base = `${name}_case_fn()`
            }

            let op = 'union'
            if (operation == 'subtract') op = 'subtract'
            else if (operation == 'intersect') op = 'intersect'

            let op_statement = `let result = ${part_var};`
            if (!first) {
                op_statement = `result = result.${op}(${part_var});`
            }
            first = false

            body.push(`

                // creating part ${part_name} of case ${case_name}
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