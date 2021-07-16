const u = require('./utils')
const io = require('./io')
const prepare = require('./prepare')
const units_lib = require('./units')
const points_lib = require('./points')
const outlines_lib = require('./outlines')
const cases_lib = require('./cases')
const pcbs_lib = require('./pcbs')

const process = async (raw, debug=false, logger=()=>{}) => {

    let empty = true
    let [config, format] = io.interpret(raw, logger)
    logger('Interpreting format: ' + format)
    
    logger('Preprocessing input...')
    config = prepare.unnest(config)
    config = prepare.inherit(config)
    const results = {}
    if (debug) {
        results.raw = raw
        results.canonical = u.deepcopy(config)
    }

    logger('Calculating variables...')
    const units = units_lib.parse(config)
    if (debug) {
        results.units = units
    }

    
    logger('Parsing points...')
    if (!config.points) {
        throw new Error('Input does not contain any points!')
    }
    const points = points_lib.parse(config.points, units)
    if (debug) {
        results.points = points
        results.demo = io.twodee(points_lib.visualize(points), debug)
    }

    logger('Generating outlines...')
    const outlines = outlines_lib.parse(config.outlines || {}, points, units)
    results.outlines = {}
    for (const [name, outline] of Object.entries(outlines)) {
        if (!debug && name.startsWith('_')) continue
        results.outlines[name] = io.twodee(outline, debug)
        empty = false
    }

    logger('Extruding cases...')
    const cases = cases_lib.parse(config.cases || {}, outlines, units)
    results.cases = {}
    for (const [case_name, case_script] of Object.entries(cases)) {
        if (!debug && case_name.startsWith('_')) continue
        results.cases[case_name] = await io.threedee(case_script, debug)
        empty = false
    }

    logger('Scaffolding PCBs...')
    const pcbs = pcbs_lib.parse(config.pcbs || {}, points, outlines, units)
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

module.exports = {
    version: '__ergogen_version',
    process,
    inject_footprint: pcbs_lib.inject_footprint
}