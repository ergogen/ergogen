const u = require('../utils')

// Alps SKBM compatible switch, seen from the top
module.exports = (config, name, points, outlines, units) => {
    // svg coordinates relative to the key center (y pointing down), so the default origin needs no offset
    // these are subpaths of a single path, so they stay visible as separate loops instead of being unioned
    const paths = [[
        // the body that fits the 15.5mm by 12.8mm plate cutout
        'M -7.75 -6.4 L 7.75 -6.4 L 7.75 6.4 L -7.75 6.4 Z',
        // the upper housing
        'M -6.7 -5.8 L 6.7 -5.8 L 6.7 5.8 L -6.7 5.8 Z',
        // the slider, wider in the middle and with a notch on each of its short sides
        'M -3.3 -2.7 L 3.3 -2.7 L 3.3 -1.7 L 4 -1.7 L 4 -0.45 L 3.7 -0.45 L 3.7 0.45 L 4 0.45 L 4 1.7 L 3.3 1.7 L 3.3 2.7 L -3.3 2.7 L -3.3 1.7 L -4 1.7 L -4 0.45 L -3.7 0.45 L -3.7 -0.45 L -4 -0.45 L -4 -1.7 L -3.3 -1.7 Z',
        // the 4.5mm by 2.2mm slot in the slider that holds the keycap
        'M -2.25 -1.1 L 2.25 -1.1 L 2.25 1.1 L -2.25 1.1 Z'
    ].join(' ')]
    return u.svg_paths_to_outline(paths, config, name, points, outlines, units)
}