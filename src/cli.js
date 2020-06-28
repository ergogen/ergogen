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
const outline_lib = require('./outline')

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
    .argv

fs.mkdirpSync(args.o)

const config_parser = args.c.endsWith('.yaml') ? yaml.load : JSON.parse
let config
try {
    config = config_parser(fs.readFileSync(args.c).toString())
} catch (err) {
    throw new Error(`Malformed input "${args.c}": ${err}`)
}

// points

console.log('Parsing points...')
const points = points_lib.parse(config.points)
if (args.debug) {
    fs.writeJSONSync(path.join(args.o, 'points.json'), points, {spaces: 4})
    const rect = u.rect(18, 18, [-9, -9])
    const points_demo = points_lib.position(points, rect)
    io.dump_model(points_demo, path.join(args.o, 'points_demo'), args.debug)
}

// outlines

// console.log('Generating outlines...')

// goodbye

console.log('Done.')
