const json5 = require('json5')
const yaml = require('js-yaml')
const makerjs = require('makerjs')
const jscad = require('@jscad/openjscad')

const u = require('./utils')
const a = require('./assert')
const kle = require('./kle')

exports.interpret = (raw, logger) => {
    let config = raw
    let format = 'OBJ'
    if (a.type(raw)() != 'object') {
        try {
            config = yaml.safeLoad(raw)
            format = 'YAML'
        } catch (yamlex) {
            try {
                config = json5.parse(raw)
                format = 'JSON'
            } catch (jsonex) {
                try {
                    config = new Function(raw)()
                    format = 'JS Code'
                } catch (codeex) {
                    logger('YAML exception:', yamlex)
                    logger('JSON exception:', jsonex)
                    logger('Code exception:', codeex)
                    throw new Error('Input is not valid YAML, JSON, or JS Code!')
                }
            }
        }
        if (!config) {
            throw new Error('Input appears to be empty!')
        }
    }
    
    try {
        // assume it's KLE and try to convert it
        // if it's not, it'll throw anyway
        return kle.convert(config, logger)
    } catch (kleex) {
        return [config, format]
    }
}

exports.twodee = (model, debug) => {
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

exports.threedee = async (script, debug) => {
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
