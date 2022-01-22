const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')
const glob = require('glob')
const u = require('../src/utils')
const a = require('../src/assert')
const ergogen = require('../src/ergogen')
require('./helpers/mock_footprints').inject(ergogen)

let what = process.env.npm_config_what
let dump = process.env.npm_config_dump

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
// as well as individual tests using slash-notation (like `points/000`)
// the --dump switch can output actual results for easier reference creation
// by default, json output is generated of the whole `actual`, but a raw,
// type-specific representation can be written if a deep path is specified

const cap = s => s.charAt(0).toUpperCase() + s.slice(1)

const test = function(input_path) {
    this.timeout(120000)
    this.slow(120000)
    title = path.basename(input_path, '.yaml').split('_').join(' ')
    it(title, async function() {
        const input = yaml.load(fs.readFileSync(input_path).toString())
        const actual = await ergogen.process(input, true)

        // if we're just creating the reference, we can dump the current output
        if (dump) {
            // whole dump
            if (dump === true || dump === 'true') {
                const out = path.join(
                    path.dirname(input_path),
                    path.basename(input_path, '.yaml') + '___ref_candidate.json'
                )
                fs.writeJSONSync(out, actual, {spaces: 4})
            // partial, type-specific dump
            } else {
                const part = u.deep(actual, dump)
                const out = path.join(
                    path.dirname(input_path),
                    path.basename(input_path, '.yaml') + '___' + dump.split('.').join('_')
                )
                if (a.type(part)() == 'string') {
                    fs.writeFileSync(out + '.txt', part)
                } else {
                    fs.writeJSONSync(out + '.json', part, {spaces: 4})
                }
            }
        }

        // compare actual vs. reference
        const base = path.join(path.dirname(input_path), path.basename(input_path, '.yaml'))
        for (const expected_path of glob.sync(base + '___*')) {
            let expected = fs.readFileSync(expected_path).toString()
            if (expected_path.endsWith('.json')) {
                expected = JSON.parse(expected)
            }
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

// End-to-end tests to actually drive the CLI as well
// --what filter is the same as above ('cli', or 'cli/prefix')
// --dump saves the log, as well as prevents the output from being deleted

const read = (d, p) => fs.readFileSync(path.join(d, p)).toString()
const exists = (d, p) => fs.existsSync(path.join(d, p))
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
                if (exists(t, 'log')) {
                    const ref_log = read(t, 'log').replace(version_regex, '<version>')
                    const actual_log = execSync(command).toString().replace(version_regex, '<version>')
                    if (dump) {
                        fs.writeFileSync(path.join(t, 'log'), actual_log)
                    }
                    actual_log.should.equal(ref_log)
                    const comp_res = dircompare.compareSync(output_path, path.join(t, 'reference'), {
                        compareContent: true
                    })
                    if (dump) {
                        fs.moveSync(output_path, path.join(t, 'output'), {overwrite: true})
                    } else {
                        fs.removeSync(output_path)
                    }
                    comp_res.same.should.be.true
                } else {
                    const ref_error = read(t, 'error').replace(version_regex, '<version>')
                    try {
                        execSync(command, {stdio: 'pipe'})
                        throw 'should_have_thrown'
                    } catch (ex) {
                        if (ex === 'should_have_thrown') {
                            throw new Error('This command should have thrown!')
                        }
                        const actual_error = ex.stderr.toString().replace(version_regex, '<version>')
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