const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')
const glob = require('glob')
const u = require('../src/utils')
const ergogen = require('../src/ergogen')

let what = process.env.npm_config_what
let first = process.env.npm_config_first

// Unit tests
// the --what switch supports each unit individually
// the --first switch does nothing here

what = what ? what.split(',') : false
for (const unit of glob.sync(path.join(__dirname, 'unit', '*.js'))) {
    const base = path.basename(unit, '.js')
    if (what && !what.includes(base)) continue
    require(`./unit/${base}.js`)
}

// Integration tests
// the --what switch supports categories (like `points` and `outlines`)
// as well as individual tests using slash-notation (like `points/000`)
// the --first switch outputs the actual results for easier reference creation

const cap = s => s.charAt(0).toUpperCase() + s.slice(1)

const test = function(input_path) {
    this.timeout(120000)
    title = path.basename(input_path, '.yaml').split('_').join(' ')
    it(title, function() {
        const input = yaml.load(fs.readFileSync(input_path).toString())
        const actual = ergogen.process(input, true)
        if (first) {
            const out = path.join(path.dirname(input_path), path.basename(input_path, '.yaml') + '___actual.json')
            fs.writeJSONSync(out, actual, {spaces: 4})
        }
        const base = path.join(path.dirname(input_path), path.basename(input_path, '.yaml'))
        for (const expected_path of glob.sync(base + '___*')) {
            const expected = JSON.parse(fs.readFileSync(expected_path).toString())
            const comp_path = expected_path.split('___')[1].split('.')[0].split('_').join('.')
            u.deep(actual, comp_path).should.deep.equal(expected)
        }
    })
}

if (what) {
    for (const w of what) {
        let regex
        let title
        if (w.includes('/')) {
            title = cap(w.split('/')[0]) + ' (partial)'
            regex = path.join(__dirname, w + '*.yaml')
        } else {
            title = cap(w)
            regex = path.join(__dirname, w, '*.yaml')
        }
        describe(title, function() {
            for (const i of glob.sync(regex)) {
                test.call(this, i)
            }
        })
    }
} else {
    for (const part of ['points', 'outlines', 'cases', 'pcbs']) {
        describe(cap(part), function() {
            for (const i of glob.sync(path.join(__dirname, part, '*.yaml'))) {
                test.call(this, i)
            }
        })
    }
}
