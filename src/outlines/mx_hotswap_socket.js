const u = require('../utils')

// Kailh MX hotswap socket (CPG151101S11), soldered to the back of the pcb and seen from the top
// the switch is south facing, so its pins (and the socket) are north of the key center, with the led cutout to the south
// the contact tabs follow the pads of the built-in mx footprint
module.exports = (config, name, points, outlines, units) => {
    // svg coordinates relative to the key center (y pointing down), so the default origin needs no offset
    const paths = [
        'M -4 -6.8 L 4.8 -6.8 L 4.8 -6.33 L 7.117 -6.33 L 7.117 -3.83 L 4.8 -3.83 L 4.8 -2.8 L -0.3 -2.8 A 2 2 0 0 0 -2.3 -0.8 L -6 -0.8 L -6 -1.29 L -8.36 -1.29 L -8.36 -3.79 L -6 -3.79 L -6 -4.8 A 2 2 0 0 1 -4 -6.8 Z'
    ]
    return u.svg_paths_to_outline(paths, config, name, points, outlines, units)
}
