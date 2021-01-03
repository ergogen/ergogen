const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')
const glob = require('glob')
const u = require('../src/utils')
const ergogen = require('../src/ergogen')

let what = process.env.npm_config_what
what = what ? what.split(',') : false
for (const unit of glob.sync(path.join(__dirname, 'unit', '*.js'))) {
    const base = path.basename(unit, '.js')
    if (what && !what.includes(base)) continue
    require(`./unit/${base}.js`)
}

const cap = s => s.charAt(0).toUpperCase() + s.slice(1)

for (const part of ['points', 'outlines', 'cases', 'pcbs']) {
    if (what && !what.includes(part)) continue
    describe(cap(part), function() {
        const dir = path.join(__dirname, part)
        for (const input_path of glob.sync(path.join(dir, '*.yaml'))) {
            const basename = path.basename(input_path, '.yaml')
            const title = basename.split('_').join(' ')
            it(title, function() {
                const dirname = path.dirname(input_path)
                const input = yaml.load(fs.readFileSync(input_path).toString())
                const actual = ergogen.process(input, true)
                for (const expected_path of glob.sync(path.join(dirname, basename + '___*'))) {
                    const expected = JSON.parse(fs.readFileSync(expected_path).toString())
                    const comp_path = expected_path.split('___')[1].split('.')[0].split('_').join('.')
                    u.deep(actual, comp_path).should.deep.equal(expected)
                }
            })
        }
    })
}