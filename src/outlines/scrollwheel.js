const u = require('../utils')

// grip ribs along the axis of the roller, to distinguish it from the body
const rib = y => `M -4.6 ${y - 0.15} L 6.1 ${y - 0.15} L 6.1 ${y + 0.15} L -4.6 ${y + 0.15} Z`

// Panasonic EVQWGD001 roller encoder with its roller, matching the built-in scrollwheel footprint and seen from the top
module.exports = (config, name, points, outlines, units) => {
    // svg coordinates relative to the footprint center (y pointing down), so the default origin needs no offset
    // these are subpaths of a single path, so they stay visible as separate loops instead of being unioned
    const paths = [[
        // the body, joined with the slot at the far end of the roller
        'M -8.4 -6.4 L 7.417 -6.4 A 0.3 0.3 0 0 1 7.7 -6.6 L 9.5 -6.6 A 0.3 0.3 0 0 1 9.8 -6.3 L 9.8 7.3 A 0.3 0.3 0 0 1 9.5 7.6 L 7.7 7.6 A 0.3 0.3 0 0 1 7.417 7.4 L -8.4 7.4 Z',
        // the roller is a drum that fills most of the body, with its axis along the length of the body
        'M -4.9 -5.2 L 6.4 -5.2 A 0.5 0.5 0 0 1 6.9 -4.7 L 6.9 5.7 A 0.5 0.5 0 0 1 6.4 6.2 L -4.9 6.2 A 0.5 0.5 0 0 1 -5.4 5.7 L -5.4 -4.7 A 0.5 0.5 0 0 1 -4.9 -5.2 Z',
        ...[-4, -2.5, -1, 0.5, 2, 3.5, 5].map(rib)
    ].join(' ')]
    return u.svg_paths_to_outline(paths, config, name, points, outlines, units)
}