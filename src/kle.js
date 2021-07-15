const kle = require('kle-serial')

exports.convert = (config, logger) => {
    const keyboard = kle.Serial.deserialize(config)
    const result = {points: {zones: {}}}

    let index = 1
    for (const key of keyboard.keys) {
        const id = `key${index++}`
        const colid = `${id}col`
        const rowid = `${id}row`

        // need to account for keycap sizes, as KLE anchors
        // at the corners, while we consider the centers
        const x = key.x + (key.width - 1) / 2
        const y = key.y + (key.height - 1) / 2
        
        // KLE deals in absolute rotation origins so we calculate
        // a relative difference as an origin for the column rotation
        // again, considering corner vs. center with the extra half width/height
        const diff_x = key.rotation_x - (key.x + key.width / 2)
        const diff_y = key.rotation_y - (key.y + key.height / 2)

        const converted = {
            anchor: {
                shift: [`${x} u`, `${-y} u`],
            },
            columns: {}
        }
        converted.columns[colid] = {
            rotate: -key.rotation_angle,
            origin: [`${diff_x} u`, `${-diff_y} u`],
            rows: {}
        }
        converted.columns[colid].rows[rowid] = {
            width: key.width,
            height: key.height,
            label: key.labels[0]
        }
        
        result.points.zones[id] = converted
    }

    return [result, 'KLE']
}