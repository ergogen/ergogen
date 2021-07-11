const prepare = require('./prepare')
const units_lib = require('./units')
const points_lib = require('./points')
const outlines_lib = require('./outlines')
const cases_lib = require('./cases')
const pcbs_lib = require('./pcbs')

const noop = () => {}

module.exports = {
    version: '__ergogen_version',
    process: (config, debug=false, logger=noop) => {

        logger('Preparing input...')
        config = prepare.unnest(config)
        config = prepare.inherit(config)
        const results = {}

        // parsing units
        logger('Calculating variables...')
        const units = units_lib.parse(config)
        if (debug) {
            results.units = units
        }

        logger('Parsing points...')
        const points = points_lib.parse(config.points, units)
        if (debug) {
            results.points = points
            results.demo = points_lib.visualize(points)
        }

        logger('Generating outlines...')
        const outlines = outlines_lib.parse(config.outlines || {}, points, units)
        results.outlines = {}
        for (const [name, outline] of Object.entries(outlines)) {
            if (!debug && name.startsWith('_')) continue
            results.outlines[name] = outline
        }

        logger('Extruding cases...')
        const cases = cases_lib.parse(config.cases || {}, outlines, units)
        results.cases = {}
        for (const [case_name, case_text] of Object.entries(cases)) {
            if (!debug && case_name.startsWith('_')) continue
            results.cases[case_name] = case_text
        }

        logger('Scaffolding PCBs...')
        const pcbs = pcbs_lib.parse(config.pcbs || {}, points, outlines, units)
        results.pcbs = {}
        for (const [pcb_name, pcb_text] of Object.entries(pcbs)) {
            if (!debug && pcb_name.startsWith('_')) continue
            results.pcbs[pcb_name] = pcb_text
        }

        return results
    },
    visualize: points_lib.visualize,
    inject_footprint: pcbs_lib.inject_footprint
}