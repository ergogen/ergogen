const yaml = require('js-yaml')
const jszip = require('jszip')
const makerjs = require('makerjs')

const u = require('./utils')
const a = require('./assert')
const kle = require('./kle')

exports.unpack = async (zip) => {

    // main config text (has to be called "config.ext" where ext is one of yaml/json/js)
    const candidates = zip.file(/^config\.(yaml|json|js)$/)
    if (candidates.length != 1) {
        throw new Error('Ambiguous config in bundle!')
    }
    const config_text = await candidates[0].async('string')
    const injections = []

    // bundled footprints
    const fps = zip.folder('footprints')
    const module_prefix = 'const module = {};\n\n'
    const module_suffix = '\n\nreturn module.exports;'
    for (const fp of fps.file(/.*\.js$/)) {
        const name = fp.name.slice('footprints/'.length).split('.')[0]
        const text = await fp.async('string')
        const parsed = new Function(module_prefix + text + module_suffix)()
        // TODO: some sort of footprint validation?
        injections.push(['footprint', name, parsed])
    }

    return [config_text, injections]
}

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
