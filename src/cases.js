const a = require('./assert')
const o = require('./operation')

const edge_treatment = (raw, name, units) => {
    if (raw === undefined) return {top: 0, bottom: 0}
    const type = a.type(raw)(units)
    if (type == 'number') {
        const value = a.sane(raw, name, 'number')(units)
        return {top: value, bottom: value}
    }
    if (type == 'array') {
        const values = a.numarr(raw, name, 2)(units)
        return {top: values[0], bottom: values[1]}
    }
    a.unexpected(raw, name, ['top', 'bottom', 'all'])
    const all = raw.all === undefined ? 0 : a.sane(raw.all, `${name}.all`, 'number')(units)
    return {
        top: raw.top === undefined ? all : a.sane(raw.top, `${name}.top`, 'number')(units),
        bottom: raw.bottom === undefined ? all : a.sane(raw.bottom, `${name}.bottom`, 'number')(units)
    }
}

const has_edge_treatment = treatment => treatment.top || treatment.bottom

exports.parse = (config, outlines, units) => {

    const cases_config = a.sane(config, 'cases', 'object')()
    const results = {}

    for (let [case_name, case_config] of Object.entries(cases_config)) {

        if (a.type(case_config)() == 'array') {
            case_config = {...case_config}
        }
        const parts = a.sane(case_config, `cases.${case_name}`, 'object')()

        const case_parts = []

        for (let [part_name, part] of Object.entries(parts)) {
            if (a.type(part)() == 'string') {
                part = o.operation(part, {
                    outline: Object.keys(outlines),
                    case: Object.keys(cases_config)
                }, ['case', 'outline'])
            }
            const part_qname = `cases.${case_name}.${part_name}`
            a.unexpected(part, part_qname, ['what', 'name', 'extrude', 'shift', 'rotate', 'operation', 'fillet', 'chamfer'])
            const what = a.in(part.what || 'outline', `${part_qname}.what`, ['outline', 'case'])
            const name = a.sane(part.name, `${part_qname}.name`, 'string')()
            const shift = a.numarr(part.shift || [0, 0, 0], `${part_qname}.shift`, 3)(units)
            const rotate = a.numarr(part.rotate || [0, 0, 0], `${part_qname}.rotate`, 3)(units)
            const operation = a.in(part.operation || 'add', `${part_qname}.operation`, ['add', 'subtract', 'intersect'])
            const parsed_fillet = edge_treatment(part.fillet, `${part_qname}.fillet`, units)
            const parsed_chamfer = edge_treatment(part.chamfer, `${part_qname}.chamfer`, units)
            a.assert(
                !(has_edge_treatment(parsed_fillet) && has_edge_treatment(parsed_chamfer)),
                `Fields "${part_qname}.fillet" and "${part_qname}.chamfer" cannot both be used on the same part!`
            )

            if (what == 'outline') {
                const extrude = a.sane(part.extrude || 1, `${part_qname}.extrude`, 'number')(units)
                const outline = outlines[name]
                a.assert(outline, `Field "${part_qname}.name" does not name a valid outline!`)
                case_parts.push({
                    what: 'outline',
                    name,
                    outline: outline.toJson ? outline.toJson() : outline,
                    extrude,
                    shift,
                    rotate,
                    operation,
                    fillet: parsed_fillet,
                    chamfer: parsed_chamfer
                })
            } else {
                a.assert(part.extrude === undefined, `Field "${part_qname}.extrude" should not be used when what=case!`)
                a.in(name, `${part_qname}.name`, Object.keys(cases_config))
                case_parts.push({
                    what: 'case',
                    name,
                    shift,
                    rotate,
                    operation,
                    fillet: parsed_fillet,
                    chamfer: parsed_chamfer
                })
            }
        }

        results[case_name] = case_parts
    }

    return results
}