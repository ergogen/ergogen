const u = require('../utils')

// SSD1306 128x32 oled module (12mm by 38mm), matching the built-in oled footprint and seen from the top
// the module extends west of its pin header, with the display facing up
module.exports = (config, name, points, outlines, units) => {
    // svg coordinates relative to the footprint center (y pointing down), so the default origin needs no offset
    // these are subpaths of a single path, so they stay visible as separate loops instead of being unioned
    const paths = [[
        // the board of the module
        'M -34.8 -0.01 L 3.2 -0.01 L 3.2 11.99 L -34.8 11.99 Z',
        // the glass of the display, as wide as the board
        'M -33.55 -0.01 L -2.55 -0.01 L -2.55 11.99 L -33.55 11.99 Z',
        // the visible area of the display
        'M -26.24 4.24 L -3.86 4.24 L -3.86 9.76 L -26.24 9.76 Z',
        // the four pins
        'M 2.1 2.18 A 0.5 0.5 0 1 0 1.1 2.18 A 0.5 0.5 0 1 0 2.1 2.18 Z',
        'M 2.1 4.72 A 0.5 0.5 0 1 0 1.1 4.72 A 0.5 0.5 0 1 0 2.1 4.72 Z',
        'M 2.1 7.26 A 0.5 0.5 0 1 0 1.1 7.26 A 0.5 0.5 0 1 0 2.1 7.26 Z',
        'M 2.1 9.8 A 0.5 0.5 0 1 0 1.1 9.8 A 0.5 0.5 0 1 0 2.1 9.8 Z'
    ].join(' ')]
    return u.svg_paths_to_outline(paths, config, name, points, outlines, units)
}