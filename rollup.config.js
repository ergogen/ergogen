import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'src/ergogen.js',
  external: ['makerjs', 'js-yaml'],
  output: {
    name: 'ergogen',
    file: 'dist/bundle.js',
    format: 'umd',
    globals: {
      'makerjs': 'makerjs',
      'js-yaml': 'jsyaml'
    }
  },
  plugins: [commonjs()]
}