const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')
const yargs = require('yargs')

const args = yargs
    .option('config', {
        alias: 'c',
        demandOption: true,
        describe: 'Config yaml file',
        type: 'string'
    })
    .option('output', {
        alias: 'o',
        default: path.resolve('output'),
        describe: 'Output folder',
        type: 'string'
    })
    .option('outline', {
        default: false,
        describe: 'Generate 2D outlines',
        type: 'boolean'
    })
    .option('pcb', {
        default: false,
        describe: 'Generate PCB draft',
        type: 'boolean'
    })
    .option('case', {
        default: false,
        describe: 'Generate case files',
        type: 'boolean'
    })
    .argv

if (!args.outline && !args.pcb && !args.case) {
    yargs.showHelp("log")
    console.log('Nothing to do...')
    process.exit(0)
}

const config = yaml.load(fs.readFileSync(args.c).toString())
const points = require('./helpers/points').parse(config)

console.log(points)