const yaml = require('js-yaml')
const json5 = require('json5')
const makerjs = require('makerjs')
const jscad = require('@jscad/openjscad')

const a = require('./assert')
const u = require('./utils')

const prepare = require('./prepare')
const units_lib = require('./units')
const points_lib = require('./points')
const outlines_lib = require('./outlines')
const cases_lib = require('./cases')
const pcbs_lib = require('./pcbs')

const noop = () => {}

const twodee = (model, debug) => {
    const assembly = makerjs.model.originate({
        models: {
            export: u.deepcopy(model)
        },
        units: 'mm'
    })

    const result = {
        dxf: makerjs.exporter.toDXF(assembly),
    }
    if (debug) {
        result.json = assembly
        result.svg = makerjs.exporter.toSVG(assembly)
    }
    return result
}

const threedee = async (script, debug) => {
    const compiled = await new Promise((resolve, reject) => {
        jscad.compile(script, {}).then(compiled => {
            resolve(compiled)
        })
    })
    const result = {
        stl: jscad.generateOutput('stla', compiled).asBuffer()
    }
    if (debug) {
        result.jscad = script
    }
    return result
}

module.exports = {
    version: '__ergogen_version',
    process: async (raw, debug=false, logger=noop) => {

        const prefix = 'Interpreting format... '
        let config = raw
        if (a.type(raw)() != 'object') {
            try {
                config = yaml.safeLoad(raw)
                logger(prefix + 'YAML detected.')
            } catch (yamlex) {
                try {
                    config = json5.parse(raw)
                    logger(prefix + 'JSON detected.')
                } catch (jsonex) {
                    try {
                        config = new Function(raw)()
                        logger(prefix + 'JS code detected.')
                    } catch (codeex) {
                        logger('YAML exception:', yamlex)
                        logger('JSON exception:', jsonex)
                        logger('Code exception:', codeex)
                        throw new Error('Input is not valid YAML, JSON, or JS code!')
                    }
                }
            }
            if (!config) {
                throw new Error('Input appears to be empty!')
            }
        }

        logger('Preprocessing input...')
        config = prepare.unnest(config)
        config = prepare.inherit(config)
        const results = {}
        if (debug) {
            results.raw = raw
            results.canonical = config
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
            results.demo = twodee(points_lib.visualize(points), debug)
        }

        logger('Generating outlines...')
        const outlines = outlines_lib.parse(config.outlines || {}, points, units)
        results.outlines = {}
        for (const [name, outline] of Object.entries(outlines)) {
            if (!debug && name.startsWith('_')) continue
            results.outlines[name] = twodee(outline, debug)
        }

        logger('Extruding cases...')
        const cases = cases_lib.parse(config.cases || {}, outlines, units)
        results.cases = {}
        for (const [case_name, case_script] of Object.entries(cases)) {
            if (!debug && case_name.startsWith('_')) continue
            results.cases[case_name] = await threedee(case_script, debug)
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
    inject_footprint: pcbs_lib.inject_footprint
}