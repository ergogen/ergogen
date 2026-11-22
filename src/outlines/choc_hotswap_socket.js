const svg_lib = require('../svg')

// the svg coordinates are not centered on the key, so the built-in origin at 9.6 1.5 aligns the socket with the key center
// a configured origin is relative to the built-in one
module.exports = svg_lib.outline([
    'M 7.1 0.7 A 1.5 1.5 0 0 0 8.6 2.2 L 11.6 2.2 L 11.6 3.15 L 14.2 3.15 L 14.2 5.75 L 11.6 5.75 L 11.6 6.7 L 7.6 6.7 L 7.6 5.2 A 0.5 0.5 0 0 0 7.1 4.7 L 2.6 4.7 L 2.6 3.5 L 0 3.5 L 0 0.95 L 2.6 0.95 L 2.6 0 L 7.1 0 L 7.1 0.7 Z'
], [9.6, 1.5])
