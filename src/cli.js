#!/usr/bin/env node

const m = require('makerjs')
const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')
const yargs = require('yargs')

const u = require('./utils')
const points_lib = require('./points')
const outline_lib = require('./outline')

const dump_model = (model, file='model') => {
    const assembly = m.model.originate({
        models: u.deepcopy(model),
        units: 'mm'
    })

    fs.mkdirpSync(path.dirname(`${file}.dxf`))
    fs.writeFileSync(`${file}.dxf`, m.exporter.toDXF(assembly))
    if (args.debug) {
        fs.writeJSONSync(`${file}.json`, assembly, {spaces: 4})
    }
}

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
    .argv

fs.mkdirpSync(args.o)

const config_parser = args.c.endsWith('.yaml') ? yaml.load : JSON.parse
const config = config_parser(fs.readFileSync(args.c).toString())

const points = points_lib.parse(config.points)
if (args.debug) {
    fs.writeJSONSync(path.join(args.o, 'points.json'), points, {spaces: 4})
    const size = 14
    const rect = u.rect(size, size, [-size/2, -size/2])
    const points_demo = outline_lib.layout(points, rect)
    dump_model(points_demo, path.join(args.o, 'points_demo'))
}

console.log('Done.')
