const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const lineends = exports.lineends = /(?:\r\n|\r|\n)/g

exports.fixture = name => {
    const res = fs.readFileSync(
        path.join(__dirname, `../fixtures/${name}`)
    ).toString().replace(lineends, '\n')
    if (name.endsWith('.json') || name.endsWith('.yaml')) {
        return yaml.load(res)
    }
    return res
}