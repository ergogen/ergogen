// Arduino ProMicro atmega32u4au
// Params
//  orientation: default is down
//    if down, power led will face the pcb
//    if up, power led will face away from pcb

const pitch = 2.54
const row_spacing = 6 * pitch

const pins = [
  // left
  ['RAW', {shape: 'rect'}],
  ['GND', {}],
  ['RST', {}],
  ['VCC', {}],
  ['P21', {}],
  ['P20', {}],
  ['P19', {}],
  ['P18', {}],
  ['P15', {}],
  ['P14', {}],
  ['P16', {}],
  ['P10', {}],

  // right
  ['P1',  {silk: 'P01'}],
  ['P0',  {silk: 'P00'}],
  ['GND', {}],
  ['GND', {}],
  ['P2',  {silk: 'P02'}],
  ['P3',  {silk: 'P03'}],
  ['P4',  {silk: 'P04'}],
  ['P5',  {silk: 'P05'}],
  ['P6',  {silk: 'P06'}],
  ['P7',  {silk: 'P07'}],
  ['P8',  {silk: 'P08'}],
  ['P9',  {silk: 'P09'}],
]

const pins_per_side = Math.ceil(pins.length / 2)

module.exports = {
  params: {
    designator: 'MCU',
    orientation: 'down',
    side: 'F',
    ...Object.fromEntries(pins.map(([name, _]) => [name, { type: 'net', value: name }])),
  },
  body: p => {
    const isFlipped = p.orientation === 'down' && p.side === 'F' || p.orientation === 'up' && p.side === 'B';
    const orientation = isFlipped ? 1 : -1;
    const textJustify = p.side === 'B' ? '(justify mirror)' : '';

    const standard = `
      (module ProMicro (layer F.Cu) (tedit 5B307E4C)
      ${p.at /* parametric position */}

      ${'' /* footprint reference */}
      (fp_text reference "${p.ref}" (at 0 0) (layer ${p.side}.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15)) ${textJustify}))
      (fp_text value "" (at 0 0) (layer ${p.side}.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))
    
      ${''/* illustration of the (possible) USB port overhang */}
      (fp_line (start -19.304 -3.81) (end -14.224 -3.81) (layer Dwgs.User) (width 0.15))
      (fp_line (start -19.304 3.81) (end -19.304 -3.81) (layer Dwgs.User) (width 0.15))
      (fp_line (start -14.224 3.81) (end -19.304 3.81) (layer Dwgs.User) (width 0.15))
      (fp_line (start -14.224 -3.81) (end -14.224 3.81) (layer Dwgs.User) (width 0.15))
    
      ${''/* component outline */}
      (fp_line (start -17.78 8.89) (end 15.24 8.89) (layer ${p.side}.SilkS) (width 0.15))
      (fp_line (start 15.24 8.89) (end 15.24 -8.89) (layer ${p.side}.SilkS) (width 0.15))
      (fp_line (start 15.24 -8.89) (end -17.78 -8.89) (layer ${p.side}.SilkS) (width 0.15))
      (fp_line (start -17.78 -8.89) (end -17.78 8.89) (layer ${p.side}.SilkS) (width 0.15))
      `

    function position(pin, row_distance) {
      const row = pin % pins_per_side
      const side = Math.floor(pin / pins_per_side) ? -1 : 1
      return {
        x: (row + 0.5 - pins_per_side / 2) * pitch,
        y: orientation * side * row_distance / 2,
      }
    }

    function line(start, end) {
      return `(fp_line (start ${start.x.toFixed(2)} ${start.y.toFixed(2)}) (end ${end.x.toFixed(2)} ${end.y.toFixed(2)}) (layer ${p.side}.SilkS) (width 0.15))`
    }

    function pin_silk(pin) {
      return `(fp_text user ${pin.silk} (at ${pin.x.toFixed(2)} ${pin.y.toFixed(2)} ${p.r + 90}) (layer ${p.side}.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15)) ${textJustify}))`
    }

    function thru_hole_pad(pad) {
      return `(pad ${pad.number} thru_hole ${pad.shape} (at ${pad.x} ${pad.y} ${pad.angle}) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${pad.net})`
    }

    function square(center, width) {
      const d = width / 2
      const top_left = {
        x: center.x - orientation * d,
        y: center.y - orientation * d,
      }
      const bottom_right = {
        x: center.x + orientation * d,
        y: center.y + orientation * d,
      }
      const top_right = {
        x: bottom_right.x,
        y: top_left.y
      }
      const bottom_left = {
        x: top_left.x,
        y: bottom_right.y
      }
      return [
        line(top_left, top_right),
        line(top_left, bottom_left),
        line(top_right, bottom_right),
      ]
    }

    // extra border around "RAW", in case the rectangular shape is not distinctive enough
    const silk_raw_border = square(position(0, row_spacing), pitch)

    const silk = pins.map(([name, overrides], n) =>
      pin_silk(Object.assign({
        silk: name,
      }, position(n, 9.6), overrides)))

    const pads = pins.map(([name, overrides], n) =>
      thru_hole_pad(Object.assign({
        number: n + 1,
        shape: 'circle',
        angle: 0,
        net: p[name].str,
      }, position(n, row_spacing), overrides)))

    return [
      standard,
      silk_raw_border.join('\n'),
      silk.join('\n'),
      pads.join('\n'),
      ')',
      ].join('\n')
  }
}
