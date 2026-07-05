import pkg from './package.json' with { type: 'json' }
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'

const svgOutlinePlugin = () => {
  return {
    name: 'svg-outline-plugin',
    transform(code, id) {
      if (!id.endsWith('.svg')) return null;

      // Extract paths from raw SVG content
      const paths = [];
      const pathRegex = /<path[\s\S]*?\sd=["']([\s\S]*?)["']/gi;
      let match;
      while ((match = pathRegex.exec(code)) !== null) {
        paths.push(match[1]);
      }

      // Return compiled JS code string invoking the shared svg_helper
      return {
        code: `
          const u = require('../utils');

          module.exports = (config, name, points, outlines, units) => {
            const paths = ${JSON.stringify(paths)};
            return u.svg_paths_to_outline(paths, config, name, points, outlines, units);
          };
        `,
        map: { mappings: '' }
      };
    }
  };
};

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
    svgOutlinePlugin(),
    json(),
    commonjs()
  ]
}