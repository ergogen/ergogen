const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')
const glob = require('glob')
const u = require('../src/utils')
const a = require('../src/assert')
const ergogen = require('../src/ergogen')
require('./helpers/mock_footprints').inject(ergogen)

let what = process.env.npm_config_what
const dump = process.env.npm_config_dump



// Unit tests
// the --what switch supports each unit individually
// the --dump switch does nothing here

what = what ? what.split(',') : false
for (const unit of glob.sync(path.join(__dirname, 'unit', '*.js'))) {
    const base = path.basename(unit, '.js')
    if (what && !what.includes(base)) continue
    require(`./unit/${base}.js`)
}



// Integration tests
// the --what switch supports categories (like `points` and `outlines`)
// as well as individual tests using slash-notation (like `points/default`)
// the --dump switch can output the new results, overriding the old reference

const cap = s => s.charAt(0).toUpperCase() + s.slice(1)

const test = function(input_path) {
    this.timeout(120000)
    this.slow(120000)
    title = path.basename(input_path, '.yaml').split('_').join(' ')
    it(title, async function() {
        const input = yaml.load(fs.readFileSync(input_path).toString())
        const output = await ergogen.process(input, true)

        // compare output vs. reference
        const base = path.join(path.dirname(input_path), path.basename(input_path, '.yaml'))
        for (const expected_path of glob.sync(base + '___*')) {
            let expected = fs.readFileSync(expected_path).toString()
            if (expected_path.endsWith('.json')) {
                expected = JSON.parse(expected)
            }
            const comp_path = expected_path.split('___')[1].split('.')[0].split('_').join('.')
            const output_part = u.deep(output, comp_path)
            if (dump) {
                if (a.type(output_part)() == 'string') {
                    fs.writeFileSync(expected_path, output_part)
                } else {
                    fs.writeJSONSync(expected_path, output_part, {spaces: 4})
                }
            } else {
                output_part.should.deep.equal(expected)
            }
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
    for (const part of ['points', 'outlines', 'cases', 'pcbs', 'footprints']) {
        describe(cap(part), function() {
            for (const i of glob.sync(path.join(__dirname, part, '*.yaml'))) {
                test.call(this, i)
            }
        })
    }
}



// End-to-end tests to actually drive the CLI as well
// --what is the same as above ('cli', or 'cli/prefix')
// --dump automatically overrides the old reference

const joiner = (a, b) => path.join(a, b)
const read = (...args) => fs.readFileSync(args.reduce(joiner, '')).toString()
const exists = (...args) => fs.existsSync(args.reduce(joiner, ''))
const { execSync } = require('child_process')
const dircompare = require('dir-compare')

const cli_what = what ? what.filter(w => w.startsWith('cli')) : ['cli']

for (let w of cli_what) {
    if (!w.includes('/')) w += '/'
    if (!w.endsWith('*')) w += '*'
    describe('CLI', function() {
        this.timeout(120000)
        this.slow(120000)
        for (const t of glob.sync(path.join(__dirname, w))) {
            it(path.basename(t).split('_').join(' '), function() {
                const command = read(t, 'command')
                const output_path = exists(t, 'path') ? read(t, 'path') : 'output'
                fs.removeSync(output_path)
                const version_regex = /\bv\d+\.\d+\.\d+(\-develop)?\b/
                // correct execution
                if (!exists(t, 'error')) {
                    let ref_log = ''
                    if (exists(t, 'log')) {
                        ref_log = read(t, 'log').replace(version_regex, '<version>')
                    }
                    const actual_log = execSync(command).toString().replace(version_regex, '<version>')
                    if (dump) {
                        fs.writeFileSync(path.join(t, 'log'), actual_log)
                    }
                    let ref_path = path.join(t, 'reference')
                    if (!exists(ref_path)) {
                        fs.mkdirpSync(ref_path)
                    }
                    if (fs.statSync(ref_path).isFile()) {
                        ref_path = path.resolve(path.join(t, read(ref_path).trim()))
                    }
                    const comp_res = dircompare.compareSync(output_path, ref_path, {
                        compareContent: true
                    })
                    if (dump) {
                        fs.moveSync(output_path, ref_path, {overwrite: true})
                    } else {
                        fs.removeSync(output_path)
                    }
                    actual_log.should.equal(ref_log)
                    comp_res.same.should.be.true
                // deliberately incorrect execution
                } else {
                    const ref_error = read(t, 'error')
                    try {
                        execSync(command, {stdio: 'pipe'})
                        throw 'should_have_thrown'
                    } catch (ex) {
                        if (ex === 'should_have_thrown') {
                            throw new Error('This command should have thrown!')
                        }
                        const actual_error = ex.stderr.toString().split('\n')[0]
                        if (dump) {
                            fs.writeFileSync(path.join(t, 'error'), actual_error)
                        }
                        actual_error.includes(ref_error).should.be.true
                    }
                }
            })
        }
    })
}