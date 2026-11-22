const svg_lib = require('../svg')

// JST PH side entry connector with 2 pins (S2B-PH-K), matching the built-in jstph footprint and seen from the top
// svg coordinates relative to the footprint center (y pointing down), so the default origin needs no offset
// these are subpaths of a single path, so they stay visible as separate loops instead of being unioned
module.exports = svg_lib.outline([[
    // the housing covers the pins, and the plug enters from the south
    'M -2.95 -1.35 L 2.95 -1.35 L 2.95 6.25 L -2.95 6.25 Z',
    // the two windows on top of the housing, one above each contact
    'M -1.4 3 L -0.6 3 L -0.6 5.2 L -1.4 5.2 Z',
    'M 0.6 3 L 1.4 3 L 1.4 5.2 L 0.6 5.2 Z',
    // the recess at the back of the housing, around the two pins
    'M -2.25 -1.35 L 2.25 -1.35 L 2.25 0.25 L -2.25 0.25 Z',
    'M -0.8 0 A 0.2 0.2 0 1 0 -1.2 0 A 0.2 0.2 0 1 0 -0.8 0 Z',
    'M 1.2 0 A 0.2 0.2 0 1 0 0.8 0 A 0.2 0.2 0 1 0 1.2 0 Z'
].join(' ')])