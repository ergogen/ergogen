#!/usr/bin/env node

// libs

const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')
const yargs = require('yargs')

// internals

const u = require('./utils')
const io = require('./io')
const points_lib = require('./points')
const outlines_lib = require('./outlines')
const pcbs_lib = require('./pcbs')
const cases_lib = require('./cases')

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
config = u.expand_nested_keys(config)

// points

console.log('Parsing points...')
const points = points_lib.parse(config.points)
if (args.debug) {
    const points_demo = points_lib.visualize(points)
    io.dump_model(points_demo, path.join(args.o, 'points/points_demo'), args.debug)
    fs.writeJSONSync(path.join(args.o, 'points/points.json'), points, {spaces: 4})
}

// outlines

console.log('Generating outlines...')
const outlines = outlines_lib.parse(config.outlines || {}, points)
for (const [name, outline] of Object.entries(outlines)) {
    if (!args.debug && name.startsWith('_')) continue
    io.dump_model(outline, path.join(args.o, `outlines/${name}`), args.debug)
}

// pcbs

console.log('Scaffolding PCBs...')
const pcbs = pcbs_lib.parse(config.pcbs || {}, points, outlines)
for (const [pcb_name, pcb_text] of Object.entries(pcbs)) {
    const pcb_file = path.join(args.o, `pcbs/${pcb_name}.kicad_pcb`)
    fs.mkdirpSync(path.dirname(pcb_file))
    fs.writeFileSync(pcb_file, pcb_text)
}

// cases

console.log('Extruding cases...')
const cases = cases_lib.parse(config.cases || {}, outlines)
for (const [case_name, case_text] of Object.entries(cases)) {
    const case_file = path.join(args.o, `cases/${case_name}.jscad`)
    fs.mkdirpSync(path.dirname(case_file))
    fs.writeFileSync(case_file, case_text)
}

// goodbye

console.log('Done.')
