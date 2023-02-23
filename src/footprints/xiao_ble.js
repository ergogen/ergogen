// Seeduino Xiao BLE
// Params
//  orientation: default is up

// ABOVE HERE IS RAW XIAO FOOTPRINT

module.exports = {
    nets: {
        D0: 'D0',
        D1: 'D1',
        D2: 'D2',
        D3: 'D3',
        D4: 'D4',
        D5: 'D5',
        D6: 'D6',
        D7: 'D7',
        D8: 'D8',
        D9: 'D9',
        D10: 'D10',
        CLK: 'CLK_DIO',
        DIO: 'DIO_CLK',
        RST: 'RST_GND',
        GND_PAD: 'GND_RST',
        BATP: 'BATP',
        BATN: 'BATN',
        GND: 'GND',
        VCC50: '5V',
        VCC33: '3V3'
    },
    params: {
        class: 'MCU',
        orientation: 'down'
    },
    body: p => {
      const standard = `
        (module XiaoBLE_SMD (layer F.Cu) (tedit 61D9009E)
        ${p.at /* parametric position */}

        ${'' /* footprint reference */}
        (fp_text reference "${p.ref}" (at -19.3989 -11.28268) (layer "F.SilkS") ${p.ref_hide} (effects (font (size 0.889 0.889) (thickness 0.1016))))

        ${''/* illustration of ??Stuff*/}
        (fp_rect (start -8.89 10.5) (end 8.89 -10.5) (layer "Dwgs.User") (width 0.12) (fill none) )
        (fp_rect (start 3.350197 -6.785813) (end 5.128197 -4.118813) (layer "Dwgs.User") (width 0.12) (fill none) )
        (fp_rect (start -3.507811 -8.182813) (end -5.285811 -10.849813) (layer "Dwgs.User") (width 0.12) (fill none) )
        (fp_rect (start 3.350197 -10.849813) (end 5.128197 -8.182813) (layer "Dwgs.User") (width 0.12) (fill none) )
        (fp_rect (start -5.285811 -6.785813) (end -3.507811 -4.118813) (layer "Dwgs.User") (width 0.12) (fill none) )
        `

    function pins() {
      return `
          ${''/* Pins TOP Layer */}
          (pad 1 smd oval (at -8.56996 -7.62 180) (size 2.75 1.8) (drill (offset -0.475 0)) (layers "F.Cu" "F.Paste" "F.Mask") ${p.net.D0.str})
          (pad 2 smd oval (at -8.56996 -5.08 180) (size 2.75 1.8) (drill (offset -0.475 0)) (layers "F.Cu" "F.Paste" "F.Mask") ${p.net.D1.str})
          (pad 3 smd oval (at -8.56996 -2.54 180) (size 2.75 1.8) (drill (offset -0.475 0)) (layers "F.Cu" "F.Paste" "F.Mask") ${p.net.D2.str})
          (pad 4 smd oval (at -8.56996 0 180) (size 2.75 1.8) (drill (offset -0.475 0)) (layers "F.Cu" "F.Paste" "F.Mask") ${p.net.D3.str})
          (pad 5 smd oval (at -8.56996 2.54 180) (size 2.75 1.8) (drill (offset -0.475 0)) (layers "F.Cu" "F.Paste" "F.Mask") ${p.net.D4.str})
          (pad 6 smd oval (at -8.56996 5.08 180) (size 2.75 1.8) (drill (offset -0.475 0)) (layers "F.Cu" "F.Paste" "F.Mask") ${p.net.D5.str})
          (pad 7 smd oval (at -8.56996 7.62 180) (size 2.75 1.8) (drill (offset -0.475 0)) (layers "F.Cu" "F.Paste" "F.Mask") ${p.net.D6.str})

          (pad 8 smd oval (at 8.56996 7.62) (size 2.75 1.8) (drill (offset -0.475 0)) (layers "F.Cu" "F.Paste" "F.Mask") ${p.net.D7.str})
          (pad 9 smd oval (at 8.56996 5.08) (size 2.75 1.8) (drill (offset -0.475 0)) (layers "F.Cu" "F.Paste" "F.Mask") ${p.net.D8.str})
          (pad 10 smd oval (at 8.56996 2.54) (size 2.75 1.8) (drill (offset -0.475 0)) (layers "F.Cu" "F.Paste" "F.Mask") ${p.net.D9.str})
          (pad 11 smd oval (at 8.56996 0) (size 2.75 1.8) (drill (offset -0.475 0)) (layers "F.Cu" "F.Paste" "F.Mask") ${p.net.D10.str})
          (pad 12 smd oval (at 8.56996 -2.54) (size 2.75 1.8) (drill (offset -0.475 0)) (layers "F.Cu" "F.Paste" "F.Mask") ${p.net.VCC33.str})
          (pad 13 smd oval (at 8.56996 -5.08) (size 2.75 1.8) (drill (offset -0.475 0)) (layers "F.Cu" "F.Paste" "F.Mask") ${p.net.GND.str})
          (pad 14 smd oval (at 8.56996 -7.62) (size 2.75 1.8) (drill (offset -0.475 0)) (layers "F.Cu" "F.Paste" "F.Mask") ${p.net.VCC50.str})

          (pad 19 thru_hole circle (at -4.445 -0.317 180) (size 1.397 1.397) (drill 1.016) (layers *.Cu *.Mask) ${p.net.BATP.str})
          (pad 20 thru_hole circle (at -4.445 -2.222 180) (size 1.397 1.397) (drill 1.016) (layers *.Cu *.Mask) ${p.net.BATN.str})

          ${''/* Pins Bottom Layer */}
          (pad 1 smd oval (at 8.56996 -7.62 180) (size 2.75 1.8) (drill (offset 0.475 0)) (layers "B.Cu" "B.Paste" "B.Mask") ${p.net.D0.str})
          (pad 2 smd oval (at 8.56996 -5.08 180) (size 2.75 1.8) (drill (offset 0.475 0)) (layers "B.Cu" "B.Paste" "B.Mask") ${p.net.D1.str})
          (pad 3 smd oval (at 8.56996 -2.54 180) (size 2.75 1.8) (drill (offset 0.475 0)) (layers "B.Cu" "B.Paste" "B.Mask") ${p.net.D2.str})
          (pad 4 smd oval (at 8.56996  0    180) (size 2.75 1.8) (drill (offset 0.475 0)) (layers "B.Cu" "B.Paste" "B.Mask") ${p.net.D3.str})
          (pad 5 smd oval (at 8.56996  2.54 180) (size 2.75 1.8) (drill (offset 0.475 0)) (layers "B.Cu" "B.Paste" "B.Mask") ${p.net.D4.str})
          (pad 6 smd oval (at 8.56996  5.08 180) (size 2.75 1.8) (drill (offset 0.475 0)) (layers "B.Cu" "B.Paste" "B.Mask") ${p.net.D5.str})
          (pad 7 smd oval (at 8.56996  7.62 180) (size 2.75 1.8) (drill (offset 0.475 0)) (layers "B.Cu" "B.Paste" "B.Mask") ${p.net.D6.str})

          (pad 8 smd oval  (at -8.56996 7.62)  (size 2.75 1.8) (drill (offset 0.475 0)) (layers "B.Cu" "B.Paste" "B.Mask") ${p.net.D7.str})
          (pad 9 smd oval  (at -8.56996 5.08)  (size 2.75 1.8) (drill (offset 0.475 0)) (layers "B.Cu" "B.Paste" "B.Mask") ${p.net.D8.str})
          (pad 10 smd oval (at -8.56996 2.54)  (size 2.75 1.8) (drill (offset 0.475 0)) (layers "B.Cu" "B.Paste" "B.Mask") ${p.net.D9.str})
          (pad 11 smd oval (at -8.56996 0)     (size 2.75 1.8) (drill (offset 0.475 0)) (layers "B.Cu" "B.Paste" "B.Mask") ${p.net.D10.str})
          (pad 12 smd oval (at -8.56996 -2.54) (size 2.75 1.8) (drill (offset 0.475 0)) (layers "B.Cu" "B.Paste" "B.Mask") ${p.net.VCC33.str})
          (pad 13 smd oval (at -8.56996 -5.08) (size 2.75 1.8) (drill (offset 0.475 0)) (layers "B.Cu" "B.Paste" "B.Mask") ${p.net.GND.str})
          (pad 14 smd oval (at -8.56996 -7.62) (size 2.75 1.8) (drill (offset 0.475 0)) (layers "B.Cu" "B.Paste" "B.Mask") ${p.net.VCC50.str})

          (pad 19 thru_hole circle (at 4.445 -0.317 180) (size 1.397 1.397) (drill 1.016) (layers *.Cu *.Mask) ${p.net.BATP.str})
          (pad 20 thru_hole circle (at 4.445 -2.222 180) (size 1.397 1.397) (drill 1.016) (layers *.Cu *.Mask) ${p.net.BATN.str})

          ${''/* "Ambidextrous thru-hole pins, SHOULD NOT be connected" */}
          (pad 15 thru_hole circle (at -1.27 -8.572 90) (size 1.397 1.397) (drill 1.016) (layers *.Cu *.Mask) ${p.net.DIO.str})
          (pad 16 thru_hole circle (at 1.27 -8.572 90) (size 1.397 1.397) (drill 1.016) (layers *.Cu *.Mask) ${p.net.CLK.str})
          (pad 17 thru_hole circle (at -1.27 -6.032 90) (size 1.397 1.397) (drill 1.016) (layers *.Cu *.Mask) ${p.net.RST.str})
          (pad 18 thru_hole circle (at 1.27 -6.032 90) (size 1.397 1.397) (drill 1.016) (layers *.Cu *.Mask) ${p.net.GND_PAD.str})
      `
    }

    return `
      ${standard}
      ${pins()})
    `
  }
}
