const m = require('makerjs')
const fs = require('fs-extra')

exports.deepcopy = (value) => JSON.parse(JSON.stringify(value))

exports.dump_model = (model, file='model', json=false) => {
    const assembly = m.model.originate({
        model,
        units: 'mm'
    })

    fs.writeFileSync(`${file}.dxf`, m.exporter.toDXF(assembly))
    if (json) fs.writeFileSync(`${file}.json`, JSON.stringify(assembly, null, '    '))
}