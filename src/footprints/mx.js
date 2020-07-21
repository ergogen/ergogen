module.exports = {
  nets: ['from', 'to'],
  params: {
    class: 'S'
  },
  body: p => `

    (module MX (layer F.Cu) (tedit 5DD4F656)

      ${p.at /* parametric position */}

      ${'' /* footprint reference */}
      (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) (effects (font (size 1.27 1.27) (thickness 0.15))))
      (fp_text value "" (at 0 0) (layer F.SilkS) (effects (font (size 1.27 1.27) (thickness 0.15))))

      ${''/* corner marks */}
      (fp_line (start -7 -6) (end -7 -7) (layer Dwgs.User) (width 0.15))
      (fp_line (start -7 7) (end -6 7) (layer Dwgs.User) (width 0.15))
      (fp_line (start -6 -7) (end -7 -7) (layer Dwgs.User) (width 0.15))
      (fp_line (start -7 7) (end -7 6) (layer Dwgs.User) (width 0.15))
      (fp_line (start 7 6) (end 7 7) (layer Dwgs.User) (width 0.15))
      (fp_line (start 7 -7) (end 6 -7) (layer Dwgs.User) (width 0.15))
      (fp_line (start 6 7) (end 7 7) (layer Dwgs.User) (width 0.15))
      (fp_line (start 7 -7) (end 7 -6) (layer Dwgs.User) (width 0.15))
      
      ${''/* pins */}
      (pad 1 thru_hole circle (at 2.54 -5.08) (size 2.286 2.286) (drill 1.4986) (layers *.Cu *.Mask) ${p.net.from})
      (pad 2 thru_hole circle (at -3.81 -2.54) (size 2.286 2.286) (drill 1.4986) (layers *.Cu *.Mask) ${p.net.to})

      ${''/* middle shaft */}
      (pad "" np_thru_hole circle (at 0 0) (size 3.9878 3.9878) (drill 3.9878) (layers *.Cu *.Mask))

      ${''/* stabilizers */}
      (pad "" np_thru_hole circle (at 5.08 0) (size 1.7018 1.7018) (drill 1.7018) (layers *.Cu *.Mask))
      (pad "" np_thru_hole circle (at -5.08 0) (size 1.7018 1.7018) (drill 1.7018) (layers *.Cu *.Mask))
    )

  `
}