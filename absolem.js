const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')
const yargs = require('yargs')

const points_lib = require('./helpers/points')
const outline_lib = require('./helpers/outline')

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
    .option('debug', {
        default: false,
        hidden: true,
        type: 'boolean'
    })
    .option('outline', {
        default: true,
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
    yargs.showHelp('log')
    console.log('Nothing to do...')
    process.exit(0)
}

const config = yaml.load(fs.readFileSync(args.c).toString())
const points = points_lib.parse(config)

if (args.debug) {
    points_lib.dump(points)
}

// if (args.outline) {
//     outline_lib.draw(points, config)
// }

console.log('Done.')