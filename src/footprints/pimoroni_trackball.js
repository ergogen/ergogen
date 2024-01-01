module.exports = {
  params: {
    VCC: {type:'net', value: 'VCC'},
    SDA: {type:'net', value: 'P2' },
    SCL: {type:'net', value: 'P3' },
    //INT: {type:'net', value: undefined } // this pin is not needed for normal use, and can be unhelpful
    GND: {type:'net', value: 'GND'},
  },
  body: p => {
    return `
      (module pimoroni_trackball (layer F.Cu) (tedit 5D20B36F)
      ${p.at /* parametric position */}
        (descr "Pimoroni I2C trackball breakout")
        (tags "Through hole pin header THT 1x05 2.54mm single row")
        (fp_text value pimoroni_trackball (at 0 12.49) (layer F.Fab)
          (effects (font (size 1 1) (thickness 0.15)))
        )

        ${''/* pins outline */}
        (fp_line (start -0.635 -1.27) (end 1.27 -1.27) (layer F.Fab) (width 0.1))
        (fp_line (start 1.27 -1.27) (end 1.27 11.43) (layer F.Fab) (width 0.1))
        (fp_line (start 1.27 11.43) (end -1.27 11.43) (layer F.Fab) (width 0.1))
        (fp_line (start -1.27 11.43) (end -1.27 -0.635) (layer F.Fab) (width 0.1))
        (fp_line (start -1.27 -0.635) (end -0.635 -1.27) (layer F.Fab) (width 0.1))

        (fp_line (start -1.33 11.49) (end 1.33 11.49) (layer F.SilkS) (width 0.12))
        (fp_line (start -1.33 1.27) (end -1.33 11.49) (layer F.SilkS) (width 0.12))
        (fp_line (start 1.33 1.27) (end 1.33 11.49) (layer F.SilkS) (width 0.12))
        (fp_line (start -1.33 1.27) (end 1.33 1.27) (layer F.SilkS) (width 0.12))
        (fp_line (start -1.33 0) (end -1.33 -1.33) (layer F.SilkS) (width 0.12))
        (fp_line (start -1.33 -1.33) (end 0 -1.33) (layer F.SilkS) (width 0.12))
        (fp_line (start -1.8 -1.8) (end -1.8 11.95) (layer F.CrtYd) (width 0.05))
        (fp_line (start -1.8 11.95) (end 1.8 11.95) (layer F.CrtYd) (width 0.05))
        (fp_line (start 1.8 11.95) (end 1.8 -1.8) (layer F.CrtYd) (width 0.05))
        (fp_line (start 1.8 -1.8) (end -1.8 -1.8) (layer F.CrtYd) (width 0.05))
        (fp_line (start -1.5 -2.6) (end -1.5 12.5) (layer F.SilkS) (width 0.12))
        (fp_line (start -1.5 12.5) (end 4.5 12.5) (layer F.SilkS) (width 0.12))
        (fp_line (start 4.5 12.5) (end 4.5 17.5) (layer F.SilkS) (width 0.12))
        (fp_line (start 4.5 17.5) (end 20.5 17.5) (layer F.SilkS) (width 0.12))
        (fp_line (start -1.5 -2.6) (end 4.5 -2.6) (layer F.SilkS) (width 0.12))
        (fp_line (start 4.5 -7.6) (end 20.5 -7.6) (layer F.SilkS) (width 0.12))
        (fp_line (start 4.5 -2.6) (end 4.5 -7.6) (layer F.SilkS) (width 0.12))
        (fp_line (start 20.5 17.5) (end 20.5 -7.6) (layer F.SilkS) (width 0.12))

        ${''/* mounting holes */}
        (pad 1 np_thru_hole circle (at 7.05 14.7) (size 2.5 2.5) (drill 2.5) (layers *.Cu *.Mask))
        (pad 2 np_thru_hole circle (at 17.95 14.7) (size 2.5 2.5) (drill 2.5) (layers *.Cu *.Mask))
        (pad 3 np_thru_hole circle (at 17.95 -4.9) (size 2.5 2.5) (drill 2.5) (layers *.Cu *.Mask))
        (pad 4 np_thru_hole circle (at 7.05 -4.9) (size 2.5 2.5) (drill 2.5) (layers *.Cu *.Mask))

        ${''/* pins */}
        (pad 1 thru_hole rect (at 0 0) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.net.VCC.str})
        (pad 2 thru_hole oval (at 0 2.54) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.net.SDA.str})
        (pad 3 thru_hole oval (at 0 5.08) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.net.SCL.str})
        ${''/*(pad 4 thru_hole oval (at 0 7.62) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.net.INT.str})*/ }
        (pad 5 thru_hole oval (at 0 10.16) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.net.GND.str})

        ${''/* pin name text */}
        (fp_text user VCC (at 3 0 ) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user SDA (at 3 2.54 ) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user SCL (at 3 5.08 ) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user GND (at 3 10.16 ) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      )
    `
  }
}
