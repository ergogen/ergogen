const u = require('../utils');

module.exports = (config, name, points, outlines, units) => {
    const paths = [
        "M 7.1 0.7 A 1.5 1.5 0 0 0 8.6 2.2 L 11.6 2.2 L 11.6 3.15 L 14.2 3.15 L 14.2 5.75 L 11.6 5.75 L 11.6 6.7 L 7.6 6.7 L 7.6 5.2 A 0.5 0.5 0 0 0 7.1 4.7 L 2.6 4.7 L 2.6 3.5 L 0 3.5 L 0 0.95 L 2.6 0.95 L 2.6 0 L 7.1 0 L 7.1 0.7 Z"
    ];
    let new_origin = [9.6,1.5];
    if (config && config.origin) {
        new_origin[0] += config.origin[0] || 0;
        new_origin[1] += config.origin[1] || 0;
    }
    return u.svg_paths_to_outline(paths, {...config, origin: new_origin}, name, points, outlines, units);
};
