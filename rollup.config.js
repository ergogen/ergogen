import pkg from './package.json'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'

export default {
  input: 'src/ergogen.js',
  external: ['makerjs', 'js-yaml', 'mathjs', 'json5'],
  output: {
    name: 'ergogen',
    file: 'dist/ergogen.js',
    format: 'umd',
    banner: `/*!\n * ergogen v${pkg.version}\n * https://zealot.hu/ergogen\n */\n`,
    globals: {
      'makerjs': 'makerjs',
      'js-yaml': 'jsyaml',
      'mathjs': 'math',
      'json5': 'json5'
    }
  },
  plugins: [
    commonjs(),
    replace({
      __ergogen_version: pkg.version
    })
  ]
}