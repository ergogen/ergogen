const yaml = require('js-yaml')
const makerjs = require('makerjs')
const jscad = require('@jscad/openjscad')

const u = require('./utils')
const a = require('./assert')
const kle = require('./kle')

exports.interpret = (raw, logger) => {
    let config = raw
    let format = 'OBJ'
    if (a.type(raw)() == 'string') {
        try {
            config = yaml.safeLoad(raw)
            format = 'YAML'
        } catch (yamlex) {
            try {
                config = new Function(raw)()
                a.assert(
                    a.type(config)() == 'object',
                    'Input JS Code doesn\'t resolve into an object!'
                )
                format = 'JS'
            } catch (codeex) {
                logger('YAML exception:', yamlex)
                logger('Code exception:', codeex)
                throw new Error('Input is not valid YAML, JSON, or JS Code!')
            }
        }
    }
    
    try {
        // assume it's KLE and try to convert it
        config = kle.convert(config, logger)
        format = 'KLE'
    } catch (kleex) {
        // nope... nevermind
    }

    if (a.type(config)() != 'object') {
        throw new Error('Input doesn\'t resolve into an object!')
    }

    if (!Object.keys(config).length) {
        throw new Error('Input appears to be empty!')
    }

    return [config, format]
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
        result.yaml = assembly
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
        stl: jscad.generateOutput('stla', compiled).asBuffer().toString()
    }
    if (debug) {
        result.jscad = script
    }
    return result
}
