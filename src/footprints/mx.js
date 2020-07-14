module.exports = {
  nets: ['from', 'to'],
  body: `

    (module MX (layer F.Cu) (tedit 5DD4F656)

      ${''/* parametric position */}
      __AT

      ${''/* corner marks */}
      (fp_line (start -7 -6) (end -7 -7) (layer F.SilkS) (width 0.15))
      (fp_line (start -7 7) (end -6 7) (layer F.SilkS) (width 0.15))
      (fp_line (start -6 -7) (end -7 -7) (layer F.SilkS) (width 0.15))
      (fp_line (start -7 7) (end -7 6) (layer F.SilkS) (width 0.15))
      (fp_line (start 7 6) (end 7 7) (layer F.SilkS) (width 0.15))
      (fp_line (start 7 -7) (end 6 -7) (layer F.SilkS) (width 0.15))
      (fp_line (start 6 7) (end 7 7) (layer F.SilkS) (width 0.15))
      (fp_line (start 7 -7) (end 7 -6) (layer F.SilkS) (width 0.15))
      
      ${''/* pins */}
      (pad 1 thru_hole circle (at 2.54 -5.08) (size 2.286 2.286) (drill 1.4986) (layers *.Cu *.Mask) __NET_FROM)
      (pad 2 thru_hole circle (at -3.81 -2.54) (size 2.286 2.286) (drill 1.4986) (layers *.Cu *.Mask) __NET_TO)

      ${''/* middle shaft */}
      (pad "" np_thru_hole circle (at 0 0) (size 3.9878 3.9878) (drill 3.9878) (layers *.Cu *.Mask))

      ${''/* stabilizers */}
      (pad "" np_thru_hole circle (at 5.08 0) (size 1.7018 1.7018) (drill 1.7018) (layers *.Cu *.Mask))
      (pad "" np_thru_hole circle (at -5.08 0) (size 1.7018 1.7018) (drill 1.7018) (layers *.Cu *.Mask))
    )

  `
}