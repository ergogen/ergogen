const u = require('./utils')
const io = require('./io')
const prepare = require('./prepare')
const units_lib = require('./units')
const points_lib = require('./points')
const outlines_lib = require('./outlines')
const cases_lib = require('./cases')
const pcbs_lib = require('./pcbs')

const version = require('../package.json').version

const process = async (raw, debug=false, logger=()=>{}) => {

    const prefix = 'Interpreting format: '
    let empty = true
    let [config, format] = io.interpret(raw, logger)
    let suffix = format
    // KLE conversion warrants automaticly engaging debug mode
    // as, usually, we're only interested in the points anyway
    if (format == 'KLE') {
        suffix = `${format} (Auto-debug)`
        debug = true
    }
    logger(prefix + suffix)
    
    logger('Preprocessing input...')
    config = prepare.unnest(config)
    config = prepare.inherit(config)
    config = prepare.parameterize(config)
    const results = {}
    if (debug) {
        results.raw = raw
        results.canonical = u.deepcopy(config)
    }

    if (config.meta && config.meta.engine) {
        logger('Checking compatibility...')
        const engine = u.semver(config.meta.engine, 'config.meta.engine')
        if (!u.satisfies(version, engine)) {
            throw new Error(`Current ergogen version (${version}) doesn\'t satisfy config's engine requirement (${config.meta.engine})!`)
        }
    }

    logger('Calculating variables...')
    const units = units_lib.parse(config)
    if (debug) {
        results.units = units
    }
    
    logger('Parsing points...')
    if (!config.points) {
        throw new Error('Input does not contain a points clause!')
    }
    const points = points_lib.parse(config.points, units)
    if (!Object.keys(points).length) {
        throw new Error('Input does not contain any points!')
    }
    if (debug) {
        results.points = points
        results.demo = io.twodee(points_lib.visualize(points, units), debug)
    }

    logger('Generating outlines...')
    const outlines = outlines_lib.parse(config.outlines || {}, points, units)
    results.outlines = {}
    for (const [name, outline] of Object.entries(outlines)) {
        if (!debug && name.startsWith('_')) continue
        results.outlines[name] = io.twodee(outline, debug)
        empty = false
    }

    logger('Modeling cases...')
    const cases = cases_lib.parse(config.cases || {}, outlines, units)
    results.cases = {}
    for (const [case_name, case_script] of Object.entries(cases)) {
        if (!debug && case_name.startsWith('_')) continue
        results.cases[case_name] = {jscad: case_script}
        empty = false
    }

    logger('Scaffolding PCBs...')
    const pcbs = pcbs_lib.parse(config, points, outlines, units)
    results.pcbs = {}
    for (const [pcb_name, pcb_text] of Object.entries(pcbs)) {
        if (!debug && pcb_name.startsWith('_')) continue
        results.pcbs[pcb_name] = pcb_text
        empty = false
    }

    if (!debug && empty) {
        logger('Output would be empty, rerunning in debug mode...')
        return process(raw, true, () => {})
    }
    return results
}

const inject = (type, name, value) => {
    if (value === undefined) {
        value = name
        name = type
        type = 'footprint'
    }
    switch (type) {
        case 'footprint':
            return pcbs_lib.inject_footprint(name, value)
        default:
            throw new Error(`Unknown injection type "${type}" with name "${name}" and value "${value}"!`)
    }
}

module.exports = {
    version,
    process,
    inject
}