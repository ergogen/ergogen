#!/usr/bin/env node

const fs = require('fs-extra')
const fsp = require('fs/promises')
const path = require('path')
const yaml = require('js-yaml')
const yargs = require('yargs')
const jszip = require('jszip')

const io = require('./io')
const pkg = require('../package.json')
const ergogen = require('./ergogen')

// input helpers

// zip handling is baked in at the io level, so that both the cli and the webui can use it
// if, for local development, we want to use a folder as input, we temporarily zip it in
// memory so that it can be handled the exact same way
// functions shamelessly repurposed from https://github.com/Stuk/jszip/issues/386

// return a flat array of absolute paths of all files recursively contained in the dir
const list_files_in_dir = async (dir) => {
    const list = await fsp.readdir(dir)
    const statPromises = list.map(async (file) => {
        const fullPath = path.resolve(dir, file)
        const stat = await fsp.stat(fullPath)
        if (stat && stat.isDirectory()) {
            return list_files_in_dir(fullPath)
        }
        return fullPath
    })

    return (await Promise.all(statPromises)).flat(Infinity)
}

// create an in-memory zip stream from a folder in the file system
const zip_from_dir = async (dir) => {
    const absRoot = path.resolve(dir)
    const filePaths = await list_files_in_dir(dir)
    return filePaths.reduce((z, filePath) => {
        const relative = filePath.replace(absRoot, '')
        // create folder trees manually :(
        const zipFolder = path
            .dirname(relative)
            .split(path.sep)
            .reduce((zf, dirName) => zf.folder(dirName), z)

        zipFolder.file(path.basename(filePath), fs.createReadStream(filePath))
        return z
    }, new jszip())
}

// output helpers

const yamldump = data => yaml.dump(data, {indent: 4, noRefs: true})

const single = (data, output_directory, rel) => {
    if (!data) return
    const abs = path.join(output_directory, rel)
    fs.mkdirpSync(path.dirname(abs))
    if (abs.endsWith('.yaml')) {
        fs.writeFileSync(abs, yamldump(data))
    } else {
        fs.writeFileSync(abs, data)
    }
}

const composite = (data, output_directory, rel) => {
    if (!data) return
    const abs = path.join(output_directory, rel)
    if (data.yaml) {
        fs.mkdirpSync(path.dirname(abs))
        fs.writeFileSync(abs + '.yaml', yamldump(data.yaml))
    }
    for (const format of ['svg', 'dxf', 'jscad']) {
        if (data[format]) {
            fs.mkdirpSync(path.dirname(abs))
            fs.writeFileSync(abs + '.' + format, data[format])
        }
    }
}

const read_config = async (config_file) => {
    let config_text = ''
    let injections = []

    try {
        if (config_file.endsWith('.zip') || config_file.endsWith('.ekb')) {
            console.log('Analyzing bundle...');
            [config_text, injections] = await io.unpack(
                await (new jszip()).loadAsync(fs.readFileSync(config_file))
            )
        } else if (fs.statSync(config_file).isDirectory()) {
            console.log('Analyzing folder...');
            [config_text, injections] = await io.unpack(
                await zip_from_dir(config_file)
            )
        } else {
            config_text = fs.readFileSync(config_file).toString()
            // no injections...
        }
        for (const [type, name, value] of injections) {
            ergogen.inject(type, name, value)
        }
    } catch (err) {
        console.error(`Could not read config file "${config_file}"!`)
        throw err
    }
    return config_text
}

const process_context = async (config_text, debug) => {
    let results
    results = await ergogen.process(config_text, debug, s => console.log(s))
    return results
}

const generate_output = async (results, output_directory, clean) => {
    if (clean) {
        console.log('Cleaning output folder...')
        fs.removeSync(output_directory)
    }
    
    console.log('Writing output to disk...')
    fs.mkdirpSync(output_directory)
    
    single(results.raw, output_directory, 'source/raw.txt')
    single(results.canonical, output_directory, 'source/canonical.yaml')
    
    single(results.units, output_directory, 'points/units.yaml')
    single(results.points, output_directory, 'points/points.yaml')
    composite(results.demo, output_directory, 'points/demo')
    
    for (const [name, outline] of Object.entries(results.outlines)) {
        composite(outline,output_directory, `outlines/${name}`)
    }
    
    for (const [name, _case] of Object.entries(results.cases)) {
        composite(_case, output_directory, `cases/${name}`)
    }
    
    for (const [name, pcb] of Object.entries(results.pcbs)) {
        single(pcb, output_directory, `pcbs/${name}.kicad_pcb`)
    }
}

const generate = async (config_text, output_directory, clean, debug) => {
    try {
        const results = await process_context(config_text, debug)
        await generate_output(results, output_directory, clean)
    } catch (err) {
        console.error(err)
    }
    console.log('Done.')
    console.log()
}

;(async () => {

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
    .option('watch', {
        alias: 'w',
        default: false,
        describe: 'Watch config file for changes and automatically regenerate files',
        type: 'boolean'
    })
    .argv

// greetings

const title_suffix = args.debug ? ' (Debug Mode)' : ''
console.log(`Ergogen v${pkg.version} CLI${title_suffix}`)
console.log()

// input reading

const config_file = args._[0]
if (!config_file) {
    console.error('Usage: ergogen <config_file> [options]')
    process.exit(1)
}

if (!fs.existsSync(config_file)) {
    console.error(`Could not read config file "${config_file}": File does not exist!`)
    process.exit(2)
}

let config_text = await read_config(config_file)
if (args.w) {
    console.log(`Watching "${config_file}" for changes... (Ctrl+C to stop)`)
    await generate(config_text, args.o, args.clean, args.debug)
    fs.watch(config_file, async (event, filename) => {
        if (event !== 'change') return
        const new_config_text = await read_config(config_file)
        if (new_config_text === config_text) return
        config_text = new_config_text
        console.log(`"${config_file}" changed, regenerating...`)
        await generate(config_text, args.o, args.clean, args.debug)
    })
} else {
    const config_text = await read_config(config_file)
    await generate(config_text, args.o, args.clean, args.debug)
}
})()
