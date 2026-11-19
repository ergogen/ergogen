const u = require('../utils')

// Kailh Choc v2 switch (PG1353), seen from the top
module.exports = (config, name, points, outlines, units) => {
    // svg coordinates relative to the key center (y pointing down), so the default origin needs no offset
    // these are subpaths of a single path, so they stay visible as separate loops instead of being unioned
    const paths = [[
        // the 15mm flange that rests on the plate
        'M -6.5 -7.5 L 6.5 -7.5 A 1 1 0 0 1 7.5 -6.5 L 7.5 6.5 A 1 1 0 0 1 6.5 7.5 L -6.5 7.5 A 1 1 0 0 1 -7.5 6.5 L -7.5 -6.5 A 1 1 0 0 1 -6.5 -7.5 Z',
        // the 13.95mm housing
        'M -6.475 -6.975 L 6.475 -6.975 A 0.5 0.5 0 0 1 6.975 -6.475 L 6.975 6.475 A 0.5 0.5 0 0 1 6.475 6.975 L -6.475 6.975 A 0.5 0.5 0 0 1 -6.975 6.475 L -6.975 -6.475 A 0.5 0.5 0 0 1 -6.475 -6.975 Z',
        // the round stem, with its mx-compatible cross
        'M 2.75 0 A 2.75 2.75 0 1 0 -2.75 0 A 2.75 2.75 0 1 0 2.75 0 Z',
        'M -0.65 -2 L 0.65 -2 L 0.65 -0.65 L 2 -0.65 L 2 0.65 L 0.65 0.65 L 0.65 2 L -0.65 2 L -0.65 0.65 L -2 0.65 L -2 -0.65 L -0.65 -0.65 Z'
    ].join(' ')]
    return u.svg_paths_to_outline(paths, config, name, points, outlines, units)
}