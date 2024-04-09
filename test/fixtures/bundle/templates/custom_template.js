const m = require('makerjs')
const version = require('package.json').version

module.exports = {
    convert_outline: () => {},
    body: params => {
        return `Custom template override. The secret is ${params.custom.secret}. MakerJS is ${m.version}. Ergogen is ${version}.`
    }
}