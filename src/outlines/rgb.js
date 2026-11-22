const svg_lib = require('../svg')

// WS2812B rgb led in a 5mm package, matching the built-in rgb footprint and seen from the top
// svg coordinates relative to the footprint center (y pointing down), so the default origin needs no offset
// these are subpaths of a single path, so they stay visible as separate loops instead of being unioned
module.exports = svg_lib.outline([[
    // the package
    'M -2.5 -2.5 L 2.5 -2.5 L 2.5 2.5 L -2.5 2.5 Z',
    // the round lens
    'M 2 0 A 2 2 0 1 0 -2 0 A 2 2 0 1 0 2 0 Z'
].join(' ')])