import pkg from './package.json' with { type: 'json' }
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import path from 'node:path'
import {createRequire} from 'node:module'
import {fileURLToPath} from 'node:url'

// the svg helpers are resolved from this file, so .svg files can live anywhere
const require = createRequire(import.meta.url)
const svg_lib = require('./src/svg.js')
const utils_path = fileURLToPath(new URL('./src/utils.js', import.meta.url))

// turns .svg imports into ESM outline factories, with the same path extraction as bundle loading
export const svg_outline_plugin = () => {
  return {
    name: 'svg-outline-plugin',
    transform(code, id) {
      if (!id.endsWith('.svg')) return null
      const paths = svg_lib.extract(code, path.basename(id, '.svg'))
      return {
        code: [
          `import u from ${JSON.stringify(utils_path)}`,
          `const paths = ${JSON.stringify(paths)}`,
          'export default (config, name, points, outlines, units) => u.svg_paths_to_outline(paths, config, name, points, outlines, units)',
        ].join('\n'),
        map: {mappings: ''}
      }
    }
  }
}

export default {
  input: 'src/ergogen.js',
  external: ['makerjs', 'js-yaml', 'mathjs', 'kle-serial', 'jszip', 'hull'],
  output: {
    name: 'ergogen',
    file: 'dist/ergogen.js',
    format: 'umd',
    banner: `/*!\n * Ergogen v${pkg.version}\n * https://ergogen.xyz\n */\n`,
    globals: {
      'makerjs': 'makerjs',
      'js-yaml': 'jsyaml',
      'mathjs': 'math',
      'kle-serial': 'kle',
      'jszip': 'jszip',
      'hull': 'hull'
    }
  },
  plugins: [
    svg_outline_plugin(),
    json(),
    commonjs()
  ]
}