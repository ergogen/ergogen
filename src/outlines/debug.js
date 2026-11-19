const u = require('../utils')

// two arrows that show where a point is and how it is oriented
// the longer arrow follows the y axis of the point (up) and the shorter one its x axis (right)
// on a mirrored point the x arrow points left, like any other svg outline
module.exports = (config, name, points, outlines, units) => {
    // svg coordinates relative to the point (y pointing down), so the default origin needs no offset
    // the two arrows overlap at the point, and are unioned into a single shape
    const paths = [
        'M -0.25 -0.25 L 3.5 -0.25 L 3.5 -1 L 5 0 L 3.5 1 L 3.5 0.25 L -0.25 0.25 Z',
        'M -0.25 0.25 L -0.25 -5.5 L -1 -5.5 L 0 -7 L 1 -5.5 L 0.25 -5.5 L 0.25 0.25 Z'
    ]
    return u.svg_paths_to_outline(paths, config, name, points, outlines, units)
}