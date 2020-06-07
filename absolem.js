const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')

const args = require('yargs')
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
    .argv

const config = yaml.load(fs.readFileSync(args.c).toString())

console.log(config)