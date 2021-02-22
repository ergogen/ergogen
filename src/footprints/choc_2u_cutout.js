module.exports = {
    nets: ['from', 'to'],
    params: {
        class: 'S'
    },
    body: p => `

    (module choc_2u_cutout (layer F.Cu) (tedit 6033D71B)

        ${p.at /* parametric position */}

        ${'' /* footprint reference */}
        (fp_text reference "${p.ref}" (at -16.51 -11.43) (layer F.SilkS) ${p.ref_hide}
            (effects (font (size 1 1) (thickness 0.15))))
        (fp_text value choc_2u_cutout (at 0 11.43) (layer F.Fab)
            (effects (font (size 1 1) (thickness 0.15))))

        (fp_line (start -10.2 -3.8) (end -8.85 -3.8) (layer Cmts.User) (width 0.12))
        (fp_line (start -13.8 -8.45) (end -10.2 -8.45) (layer Cmts.User) (width 0.12))
        (fp_line (start 8.85 3.05) (end 8.85 -3.8) (layer Cmts.User) (width 0.12))
        (fp_line (start -19.05 9.525) (end 19.05 9.525) (layer Eco1.User) (width 0.12))
        (fp_line (start 14 -5.5) (end 14 -9) (layer Edge.Cuts) (width 0.12))
        (fp_line (start -10 -5.5) (end -10 -9) (layer Edge.Cuts) (width 0.12))
        (fp_line (start -14.65 -3.2) (end -14.65 2.3) (layer Edge.Cuts) (width 0.12))
        (fp_line (start -14 -9) (end -10 -9) (layer Edge.Cuts) (width 0.12))
        (fp_line (start -14.65 -3.2) (end -9.35 -3.2) (layer Edge.Cuts) (width 0.12))
        (fp_line (start -14.65 2.3) (end -9.35 2.3) (layer Edge.Cuts) (width 0.12))
        (fp_line (start -19.05 -9.525) (end -19.05 9.525) (layer Eco1.User) (width 0.12))

        (fp_line (start 13.8 -8.45) (end 13.8 -3.8) (layer Cmts.User) (width 0.12))
        (fp_line (start -15.15 -3.8) (end -13.8 -3.8) (layer Cmts.User) (width 0.12))
        (fp_line (start 9.35 -3.2) (end 9.35 2.3) (layer Edge.Cuts) (width 0.12))
        (fp_line (start -15.15 3.05) (end -8.85 3.05) (layer Cmts.User) (width 0.12))
        (fp_line (start 14.65 2.3) (end 14.65 -3.2) (layer Edge.Cuts) (width 0.12))
        (fp_line (start 13.8 -3.8) (end 15.15 -3.8) (layer Cmts.User) (width 0.12))
        (fp_line (start -14 -5.5) (end -10 -5.5) (layer Edge.Cuts) (width 0.12))
        (fp_line (start -13.8 -8.45) (end -13.8 -3.8) (layer Cmts.User) (width 0.12))
        (fp_line (start 10 -9) (end 14 -9) (layer Edge.Cuts) (width 0.12))
        (fp_line (start -15.15 3.05) (end -15.15 -3.8) (layer Cmts.User) (width 0.12))
        (fp_line (start 8.85 -3.8) (end 10.2 -3.8) (layer Cmts.User) (width 0.12))
        (fp_line (start -8.85 3.05) (end -8.85 -3.8) (layer Cmts.User) (width 0.12))
        (fp_line (start 8.85 3.05) (end 15.15 3.05) (layer Cmts.User) (width 0.12))
        (fp_line (start 10.2 -8.45) (end 13.8 -8.45) (layer Cmts.User) (width 0.12))
        (fp_line (start 10 -5.5) (end 14 -5.5) (layer Edge.Cuts) (width 0.12))

        (fp_line (start -19.05 -9.525) (end 19.05 -9.525) (layer Eco1.User) (width 0.12))
        (fp_line (start 19.05 -9.525) (end 19.05 9.525) (layer Eco1.User) (width 0.12))


        (fp_line (start 10.2 -8.45) (end 10.2 -3.8) (layer Cmts.User) (width 0.12))
        (fp_line (start 9.35 2.3) (end 14.65 2.3) (layer Edge.Cuts) (width 0.12))
        (fp_line (start 10 -9) (end 10 -5.5) (layer Edge.Cuts) (width 0.12))
        (fp_line (start -9.35 2.3) (end -9.35 -3.2) (layer Edge.Cuts) (width 0.12))
        (fp_line (start 9.35 -3.2) (end 14.65 -3.2) (layer Edge.Cuts) (width 0.12))
        (fp_line (start -10.2 -8.45) (end -10.2 -3.8) (layer Cmts.User) (width 0.12))
        (fp_line (start -14 -9) (end -14 -5.5) (layer Edge.Cuts) (width 0.12))
        (fp_line (start 15.15 3.05) (end 15.15 -3.8) (layer Cmts.User) (width 0.12))
    )

    `
}