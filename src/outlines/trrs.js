const u = require('../utils')

// PJ-320A TRRS jack, matching the built-in trrs footprint (not reversed) and seen from the top
module.exports = (config, name, points, outlines, units) => {
    // svg coordinates relative to the footprint center (y pointing down), so the default origin needs no offset
    // these are subpaths of a single path, so they stay visible as separate loops instead of being unioned
    const paths = [[
        // the body
        'M -5.35 0 L 0.75 0 L 0.75 12.1 L -5.35 12.1 Z',
        // the barrel that the plug enters from the north
        'M -5.1 -2 L 0.5 -2 L 0.5 0 L -5.1 0 Z',
        // the four pins
        'M -4.15 11.3 A 0.45 0.45 0 1 0 -5.05 11.3 A 0.45 0.45 0 1 0 -4.15 11.3 Z',
        'M 0.45 10.2 A 0.45 0.45 0 1 0 -0.45 10.2 A 0.45 0.45 0 1 0 0.45 10.2 Z',
        'M 0.45 6.2 A 0.45 0.45 0 1 0 -0.45 6.2 A 0.45 0.45 0 1 0 0.45 6.2 Z',
        'M 0.45 3.2 A 0.45 0.45 0 1 0 -0.45 3.2 A 0.45 0.45 0 1 0 0.45 3.2 Z',
        // the two locating pegs
        'M -1.55 8.6 A 0.75 0.75 0 1 0 -3.05 8.6 A 0.75 0.75 0 1 0 -1.55 8.6 Z',
        'M -1.55 1.6 A 0.75 0.75 0 1 0 -3.05 1.6 A 0.75 0.75 0 1 0 -1.55 1.6 Z'
    ].join(' ')]
    return u.svg_paths_to_outline(paths, config, name, points, outlines, units)
}