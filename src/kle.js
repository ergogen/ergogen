const u = require('./utils')
const kle = require('kle-serial')
const yaml = require('js-yaml')

exports.convert = (config, logger) => {
    const keyboard = kle.Serial.deserialize(config)
    const result = {points: {zones: {}}, pcbs: {main: {}}}

    // if the keyboard notes are valid YAML/JSON, they get added to each key as metadata
    let meta
    try {
        meta = yaml.load(keyboard.meta.notes)
    } catch (ex) {
        // notes were not valid YAML/JSON, oh well...
    }
    meta = meta || {}

    let index = 1
    for (const key of keyboard.keys) {
        const id = `key${index++}`
        const colid = `${id}col`
        const rowid = `${id}row`
        // we try to look at the first non-empty label
        const label = key.labels.filter(e => !!e)[0] || '' 

        // PCB nets can be specified through key labels
        let row_net = id
        let col_net = 'GND'
        if (label.match(/^\d+_\d+$/)) {
            const parts = label.split('_')
            row_net = `row_${parts[0]}`
            col_net = `col_${parts[1]}`
        }

        // need to account for keycap sizes, as KLE anchors
        // at the corners, while we consider the centers
        const x = key.x + (key.width - 1) / 2
        const y = key.y + (key.height - 1) / 2
        
        // KLE deals in absolute rotation origins so we calculate
        // a relative difference as an origin for the column rotation
        // again, considering corner vs. center with the extra half width/height
        const diff_x = key.rotation_x - (key.x + key.width / 2)
        const diff_y = key.rotation_y - (key.y + key.height / 2)

        // anchoring the per-key zone to the KLE-computed coords
        const converted = {
            anchor: {
                shift: [`${x} u`, `${-y} u`],
            },
            columns: {}
        }
        
        // adding a column-level rotation with origin
        converted.columns[colid] = {
            rotate: -key.rotation_angle,
            origin: [`${diff_x} u`, `${-diff_y} u`],
            rows: {}
        }
        
        // passing along metadata to each key
        converted.columns[colid].rows[rowid] = u.deepcopy(meta)
        converted.columns[colid].rows[rowid].width = key.width
        converted.columns[colid].rows[rowid].height = key.height
        converted.columns[colid].rows[rowid].label = label
        converted.columns[colid].rows[rowid].column_net = col_net
        converted.columns[colid].rows[rowid].row_net = row_net
        
        result.points.zones[id] = converted
    }

    return result
}