const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

exports.fixture = name => {
    const res = fs.readFileSync(
        path.join(__dirname, `../fixtures/${name}`)
    ).toString()
    if (name.endsWith('.json') || name.endsWith('.yaml')) {
        return yaml.load(res)
    }
    return res
}