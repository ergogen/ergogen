const u = require('../utils');
const a = require('../assert')

module.exports = (config, name, points, outlines, units) => {
    const paths = [
        "M 7.1 0.7 A 1.5 1.5 0 0 0 8.6 2.2 L 11.6 2.2 L 11.6 3.15 L 14.2 3.15 L 14.2 5.75 L 11.6 5.75 L 11.6 6.7 L 7.6 6.7 L 7.6 5.2 A 0.5 0.5 0 0 0 7.1 4.7 L 2.6 4.7 L 2.6 3.5 L 0 3.5 L 0 0.95 L 2.6 0.95 L 2.6 0 L 7.1 0 L 7.1 0.7 Z"
    ];
    // evaluate origin expressions before offsetting them from the built-in origin
    const origin = a.xy(config.origin || [0, 0], `${name}.origin`)(units)
    const new_origin = [9.6 + origin[0], 1.5 + origin[1]]
    return u.svg_paths_to_outline(paths, {...config, origin: new_origin}, name, points, outlines, units);
};
