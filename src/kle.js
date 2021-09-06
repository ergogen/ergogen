const u = require('./utils')
const kle = require('kle-serial')
const yaml = require('js-yaml')

function columnIDFromKey(key) {
    center_x = key.x + (key.width) / 2
    var base = [center_x, key.rotation_angle, key.rotation_x, key.rotation_y].join('|')
    return base.replaceAll('.', '_')
}

function parseColumnID(colid) {
    const elements = colid.replaceAll('_', '.').split('|')
    return {
        x: Number(elements[0]),
        rotation_angle: Number(elements[1]),
        rotation_x: Number(elements[2]),
        rotation_y: Number(elements[3])
    }
}

exports.convert = (config, logger) => {
    const keyboard = kle.Serial.deserialize(config)
    const result = {points: {zones: {}}, pcbs: {main: {}}}
    var columns = new Map()

    // if the keyboard notes are valid YAML/JSON, they get added to each key as metadata
    let meta
    try {
        meta = yaml.load(keyboard.meta.notes)
    } catch (ex) {
        // notes were not valid YAML/JSON, oh well...
    }
    meta = meta || {}

    let index = 1

    result.points.zones.matrix = {
        columns: {}
    }

    // Arrange keys into columns based on x position and rotation
    for (const key of keyboard.keys) {
        key_col = columnIDFromKey(key)
        columns.set(key_col, columns.get(key_col) || [])
        columns.get(key_col).push(key)
    }

    // Sort columns from left to right
    columns = new Map([...columns].sort(
        (a, b) => parseColumnID(a[0]).x - parseColumnID(b[0]).x)
    )
    // console.log(columns)

    var prev_x = 0
    var prev_y = 0
    for (var [colid, keys] of columns) {
        // Sort keys from bottom to top
        keys = keys.sort((a, b) => b.y - a.y)

        let column = {
            rows: {}
        }

        // Calculate stagger and spread relative to previous column
        const col_data = parseColumnID(colid)
        const spread = keys[0].x + (keys[0].width) / 2 - prev_x + ' u'
        const stagger = prev_y - (keys[0].y + (keys[0].height) / 2) + ' u'
        if (spread != '1 u') {
            column.spread = spread
        }
        if (stagger != '0 u') {
            column.stagger = stagger
        }
        prev_x = keys[0].x + (keys[0].width) / 2
        prev_y = keys[0].y + (keys[0].height) / 2

        // KLE deals in absolute rotation origins so we calculate
        // a relative difference as an origin for the column rotation
        // again, considering corner vs. center with the extra half width/height
        const first = keys[0]
        const diff_x = col_data.rotation_x - (first.x + first.width / 2)
        const diff_y = col_data.rotation_y - (first.y + first.height / 2)

        if (col_data.rotation_angle != 0) {
            column.rotate = -col_data.rotation_angle
            column.origin = [`${diff_x} u`, `${-diff_y} u`]
        }

        for (const key of keys) {
            const id = `key${index++}`

            // we try to look at the first non-empty label
            const label = key.labels.filter(e => !!e)[0] || ''

            // PCB nets can be specified through key labels
            let row_net = id
            let col_net = 'GND'
            if (label.match(/^\d+[,_]\d+$/)) {
                const parts = label.split(/[,_]/)
                row_net = `row_${parts[0]}`
                col_net = `col_${parts[1]}`
            }

            // need to account for keycap sizes, as KLE anchors
            // at the corners, while we consider the centers
            const x = key.x + (key.width) / 2
            const y = key.y + (key.height) / 2

            const rowid = id

            column.rows[rowid] = u.deepcopy(meta)
            column.rows[rowid].width = key.width
            column.rows[rowid].height = key.height
            column.rows[rowid].label = label
            column.rows[rowid].column_net = col_net
            column.rows[rowid].row_net = row_net

        }

        result.points.zones.matrix.columns[colid] = column

        // Use a dummy column to reset rotation to 0
        if (col_data.rotation_angle != 0) {
            var dummy = {
                spread: '0 u',
                key: {skip: true}
            }
            dummy.rotate = col_data.rotation_angle
            dummy.origin = [`${diff_x} u`, `${-diff_y} u`]
            result.points.zones.matrix.columns[colid + '|dummy'] = dummy
        }
    }

    // Default switch/diode footprints
    result.points.zones.matrix.key = {
        footprints: {
            switch: {
                type: 'mx',
                nets: {
                    to: '=colrow',
                    from: '=row_net'
                }
            },
            diode: {
                type: 'diode',
                anchor: {
                    rotate: 180,
                    shift: [0, -5]
                },
                nets: {
                    from: '=colrow',
                    to: '=column_net'
                }
            }
      }
    }

    return result
}
