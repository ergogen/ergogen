const m = require('makerjs')
const fs = require('fs-extra')
const path = require('path')

const u = require('./utils')

exports.dump_model = (model, file='model', debug=false) => {
    const assembly = m.model.originate({
        models: {
            export: u.deepcopy(model)
        },
        units: 'mm'
    })

    fs.mkdirpSync(path.dirname(`${file}.dxf`))
    fs.writeFileSync(`${file}.dxf`, m.exporter.toDXF(assembly))
    if (debug) {
        fs.writeFileSync(`${file}.svg`, m.exporter.toSVG(assembly))
        fs.writeJSONSync(`${file}.json`, assembly, {spaces: 4})
    }
}