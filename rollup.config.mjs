import pkg from './package.json' assert { type: 'json' }
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'src/ergogen.js',
  external: ['makerjs', 'js-yaml', 'mathjs', 'kle-serial', 'jszip'],
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
      'jszip': 'jszip'
    }
  },
  plugins: [
    json(),
    commonjs()
  ]
}