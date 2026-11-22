const svg_lib = require('../svg')

// Cherry MX switch, seen from the top
// svg coordinates relative to the key center (y pointing down), so the default origin needs no offset
// these are subpaths of a single path, so they stay visible as separate loops instead of being unioned
module.exports = svg_lib.outline([[
    // the 15.6mm flange that rests on the plate
    'M -7.3 -7.8 L 7.3 -7.8 A 0.5 0.5 0 0 1 7.8 -7.3 L 7.8 7.3 A 0.5 0.5 0 0 1 7.3 7.8 L -7.3 7.8 A 0.5 0.5 0 0 1 -7.8 7.3 L -7.8 -7.3 A 0.5 0.5 0 0 1 -7.3 -7.8 Z',
    // the 14mm housing
    'M -6.5 -7 L 6.5 -7 A 0.5 0.5 0 0 1 7 -6.5 L 7 6.5 A 0.5 0.5 0 0 1 6.5 7 L -6.5 7 A 0.5 0.5 0 0 1 -7 6.5 L -7 -6.5 A 0.5 0.5 0 0 1 -6.5 -7 Z',
    // the stem, with its cross
    'M -3.3 -2.8 L 3.3 -2.8 A 0.3 0.3 0 0 1 3.6 -2.5 L 3.6 2.5 A 0.3 0.3 0 0 1 3.3 2.8 L -3.3 2.8 A 0.3 0.3 0 0 1 -3.6 2.5 L -3.6 -2.5 A 0.3 0.3 0 0 1 -3.3 -2.8 Z',
    'M -0.585 -2.05 L 0.585 -2.05 L 0.585 -0.675 L 2.05 -0.675 L 2.05 0.675 L 0.585 0.675 L 0.585 2.05 L -0.585 2.05 L -0.585 0.675 L -2.05 0.675 L -2.05 -0.675 L -0.585 -0.675 Z'
].join(' ')])