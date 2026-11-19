const u = require('../utils')

// the two rows of 12 pins, at the pad positions of the built-in promicro footprint
const pins = () => {
    const result = []
    for (let i = 0; i < 12; i++) {
        const x = -13.97 + i * 2.54
        const left = x - 0.55
        const right = x + 0.55
        result.push(
            `M ${right} -7.62 A 0.55 0.55 0 1 0 ${left} -7.62 A 0.55 0.55 0 1 0 ${right} -7.62 Z`,
            `M ${right} 7.62 A 0.55 0.55 0 1 0 ${left} 7.62 A 0.55 0.55 0 1 0 ${right} 7.62 Z`
        )
    }
    return result
}

// Arduino Pro Micro with a usb-c connector, matching the built-in promicro footprint and seen from the top
module.exports = (config, name, points, outlines, units) => {
    // svg coordinates relative to the footprint center (y pointing down), so the default origin needs no offset
    // these are subpaths of a single path, so they stay visible as separate loops instead of being unioned
    const paths = [[
        // the board, joined with the part of the connector that overhangs it
        'M -17.78 -8.89 L 15.24 -8.89 L 15.24 8.89 L -17.78 8.89 L -17.78 4.47 L -19.304 4.47 L -19.304 -4.47 L -17.78 -4.47 Z',
        // the shell of the connector on the board
        'M -17.28 -4.47 L -12.45 -4.47 A 0.5 0.5 0 0 1 -11.95 -3.97 L -11.95 3.97 A 0.5 0.5 0 0 1 -12.45 4.47 L -17.28 4.47 Z',
        ...pins()
    ].join(' ')]
    return u.svg_paths_to_outline(paths, config, name, points, outlines, units)
}