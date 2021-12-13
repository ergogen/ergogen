#!/usr/bin/env node

const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')
const yargs = require('yargs')
const ergogen = require('./ergogen')
const pkg = require('../package.json')

// command line args

const args = yargs
    .option('output', {
        alias: 'o',
        default: path.resolve('output'),
        describe: 'Output folder',
        type: 'string'
    })
    .option('debug', {
        alias: 'd',
        default: false,
        describe: 'Debug mode',
        type: 'boolean'
    })
    .option('clean', {
        default: false,
        describe: 'Clean output dir before parsing',
        type: 'boolean'
    })
    .argv

// config reading

const config_file = args._[0]
if (!config_file) {
    console.error('Usage: ergogen <config_file> [options]')
    process.exit(1)
}

let config_text
try {
    config_text = fs.readFileSync(config_file).toString()
} catch (err) {
    console.error(`Could not read config file "${config_file}": ${err}`)
    process.exit(2)
}

const title_suffix = args.debug ? ' (Debug Mode)' : ''
console.log(`Ergogen v${pkg.version} CLI${title_suffix}`)
console.log()

;(async () => {

// processing

let results
try {
    results = await ergogen.process(config_text, args.debug, s => console.log(s))
} catch (err) {
    console.error(err)
    process.exit(3)
}

// helpers

const single = (data, rel) => {
    if (!data) return
    const abs = path.join(args.o, rel)
    fs.mkdirpSync(path.dirname(abs))
    if (abs.endsWith('.yaml')) {
        fs.writeFileSync(abs, yaml.dump(data, {indent: 4}))
    } else {
        fs.writeFileSync(abs, data)
    }
}

const composite = (data, rel) => {
    if (!data) return
    const abs = path.join(args.o, rel)
    if (data.yaml) {
        fs.mkdirpSync(path.dirname(abs))
        fs.writeFileSync(abs + '.yaml', yaml.dump(data.yaml, {indent: 4}))
    }
    for (const format of ['svg', 'dxf', 'jscad', 'stl']) {
        if (data[format]) {
            fs.mkdirpSync(path.dirname(abs))
            fs.writeFileSync(abs + '.' + format, data[format])
        }
    }
}

// output

if (args.clean) {
    console.log('Cleaning output folder...')
    fs.removeSync(args.o)
}

console.log('Writing output to disk...')
fs.mkdirpSync(args.o)

single(results.raw, 'source/raw.txt')
single(results.canonical, 'source/canonical.yaml')

single(results.units, 'points/units.yaml')
single(results.points, 'points/points.yaml')
composite(results.demo, 'points/demo')

for (const [name, outline] of Object.entries(results.outlines)) {
    composite(outline, `outlines/${name}`)
}

for (const [name, _case] of Object.entries(results.cases)) {
    composite(_case, `cases/${name}`)
}

for (const [name, pcb] of Object.entries(results.pcbs)) {
    single(pcb, `pcbs/${name}.kicad_pcb`)
}

// goodbye

console.log('Done.')
console.log()

})()
