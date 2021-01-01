#!/usr/bin/env node

// libs

const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')
const yargs = require('yargs')

// internals

const io = require('./io')
const ergogen = require('./ergogen')

// command line args

const args = yargs
    .option('config', {
        alias: 'c',
        demandOption: true,
        describe: 'Config yaml/json file',
        type: 'string'
    })
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

if (args.clean) fs.removeSync(args.o)
fs.mkdirpSync(args.o)

// config parsing

let config_text
try {
    config_text = fs.readFileSync(args.c).toString()
} catch (err) {
    throw new Error(`Could not read file "${args.c}": ${err}`)
}

const is_yaml = args.c.endsWith('.yaml') || args.c.endsWith('.yml')
const config_parser = is_yaml ? yaml.load : JSON.parse
let config
try {
    config = config_parser(config_text)
} catch (err) {
    throw new Error(`Malformed input within "${args.c}": ${err}`)
}

// processing

const results = ergogen.process(config, args.debug, s => console.log(s))

// output

console.log('Writing output to disk...')

if (args.debug) {
    io.dump_model(results.points.demo, path.join(args.o, 'points/demo'), args.debug)
    fs.writeJSONSync(path.join(args.o, 'points/data.json'), results.points.data, {spaces: 4})
}

for (const [name, outline] of Object.entries(results.outlines)) {
    io.dump_model(outline, path.join(args.o, `outlines/${name}`), args.debug)
}

for (const [name, _case] of Object.entries(results.cases)) {
    const file = path.join(args.o, `cases/${name}.jscad`)
    fs.mkdirpSync(path.dirname(file))
    fs.writeFileSync(file, _case)
}

for (const [name, pcb] of Object.entries(results.pcbs)) {
    const file = path.join(args.o, `pcbs/${name}.kicad_pcb`)
    fs.mkdirpSync(path.dirname(file))
    fs.writeFileSync(file, pcb)
}

if (args.debug) {
    fs.writeJSONSync(path.join(args.o, 'results.json'), results, {spaces: 4})
}

// goodbye

console.log('Done.')
