const u = require('../utils')

// Kailh Choc v1 switch (PG1350), seen from the top
module.exports = (config, name, points, outlines, units) => {
    // svg coordinates relative to the key center (y pointing down), so the default origin needs no offset
    // these are subpaths of a single path, so they stay visible as separate loops instead of being unioned
    const paths = [[
        // the 15mm flange that rests on the plate
        'M -6.5 -7.5 L 6.5 -7.5 A 1 1 0 0 1 7.5 -6.5 L 7.5 6.5 A 1 1 0 0 1 6.5 7.5 L -6.5 7.5 A 1 1 0 0 1 -7.5 6.5 L -7.5 -6.5 A 1 1 0 0 1 -6.5 -7.5 Z',
        // the 13.8mm housing
        'M -6.4 -6.9 L 6.4 -6.9 A 0.5 0.5 0 0 1 6.9 -6.4 L 6.9 6.4 A 0.5 0.5 0 0 1 6.4 6.9 L -6.4 6.9 A 0.5 0.5 0 0 1 -6.9 6.4 L -6.9 -6.4 A 0.5 0.5 0 0 1 -6.4 -6.9 Z',
        // the stem, with a tab on its south side
        'M -5.15 -2.25 L 5.15 -2.25 L 5.15 2.25 L 1.55 2.25 L 1.55 3.45 L -1.55 3.45 L -1.55 2.25 L -5.15 2.25 Z',
        // the two slots that hold the keycap, 5.7mm apart
        'M -3.45 -1.5 L -2.25 -1.5 L -2.25 1.5 L -3.45 1.5 Z',
        'M 2.25 -1.5 L 3.45 -1.5 L 3.45 1.5 L 2.25 1.5 Z'
    ].join(' ')]
    return u.svg_paths_to_outline(paths, config, name, points, outlines, units)
}