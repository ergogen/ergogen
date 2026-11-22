const svg_lib = require('../svg')

// the three strokes of the Ergogen logo, 15mm wide and without the square around them
// the shape follows the utility_ergogen_logo footprint of ceoloide/ergogen-footprints
// svg coordinates relative to the center of the logo (y pointing down), so the default origin needs no offset
module.exports = svg_lib.outline([
    'M -7.5 -4.529 L 7.5 -4.529 L 7.5 -1.527 L 6.003 -3.002 L -7.5 -3.002 Z',
    'M -4.476 -0.764 L 2.129 -0.764 L 0.602 0.764 L -5.999 0.764 Z',
    'M -7.5 3.002 L 6.003 3.002 L 7.5 1.501 L 7.5 4.529 L -7.5 4.529 Z'
])