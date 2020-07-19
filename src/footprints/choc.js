module.exports = {
    nets: ['from', 'to'],
    body: p => `

    (module PG1350 (layer F.Cu) (tedit 5DD50112)

        ${p.at /* parametric position */}

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
        (pad 1 thru_hole circle (at 5 -3.8) (size 2.032 2.032) (drill 1.27) (layers *.Cu *.Mask) ${p.net_from})
        (pad 2 thru_hole circle (at 0 -5.9) (size 2.032 2.032) (drill 1.27) (layers *.Cu *.Mask) ${p.net_to})
        
        ${''/* middle shaft */}
        (pad "" np_thru_hole circle (at 0 0) (size 3.429 3.429) (drill 3.429) (layers *.Cu *.Mask))
        
        ${''/* stabilizers */}
        (pad "" np_thru_hole circle (at 5.5 0) (size 1.7018 1.7018) (drill 1.7018) (layers *.Cu *.Mask))
        (pad "" np_thru_hole circle (at -5.5 0) (size 1.7018 1.7018) (drill 1.7018) (layers *.Cu *.Mask))
    )

    `
}