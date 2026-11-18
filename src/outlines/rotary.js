const u = require('../utils')

// the shaft of the built-in rotary footprint, in svg coordinates relative to the footprint center (y pointing down)
const center = [-0.12, -0.04]

// a 17mm knob, wide enough to cover the body, with its rim alternating between two radii
const knurling = (teeth, outer, inner) => {
    const vertices = []
    for (let i = 0; i < teeth * 2; i++) {
        const angle = i * Math.PI / teeth
        const radius = i % 2 ? inner : outer
        const x = center[0] + radius * Math.cos(angle)
        const y = center[1] + radius * Math.sin(angle)
        vertices.push(`${x.toFixed(3)} ${y.toFixed(3)}`)
    }
    return `M ${vertices.join(' L ')} Z`
}

// EC11 rotary encoder with a knurled knob, matching the built-in rotary footprint and seen from the top
module.exports = (config, name, points, outlines, units) => {
    // these are subpaths of a single path, so they stay visible as separate loops instead of being unioned
    const paths = [[
        knurling(36, 8.5, 8),
        // the body under the knob
        'M -6.12 -4.74 L -5.12 -5.84 L 5.88 -5.84 L 5.88 5.76 L -6.12 5.76 Z',
        // a small circle near the rim marks the direction of the knob, at 1 o'clock (7.4mm from the center)
        'M 4.08 -6.449 A 0.5 0.5 0 1 0 3.08 -6.449 A 0.5 0.5 0 1 0 4.08 -6.449 Z'
    ].join(' ')]
    return u.svg_paths_to_outline(paths, config, name, points, outlines, units)
}