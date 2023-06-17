module.exports = {
    params: {
        designator: 'Nice!View',
        side: 'F',
        VCC: { type: 'net', value: 'VCC' },
        GND: { type: 'net', value: 'GND' },
        SDA: undefined,
        SCL: undefined,
        CS: undefined,
    },
    body: p => `
        (module lib:niceview_headers (layer F.Cu) (tedit 648E0265)
        ${p.at /* parametric position */} 

        ${'' /* footprint reference */}        
        (fp_text reference "${p.ref}" (at -1.6 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
        (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1 1) (thickness 0.15))))

        ${'' /* pins */}
        (pad 4 thru_hole oval (at 0.0 -5.08 ${p.rot + 270}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask)
        ${p.SDA.str})
        (pad 3 thru_hole oval (at 0.0 -2.54 ${p.rot + 270}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask)
        ${p.SCL.str})
        (pad 2 thru_hole oval (at 0.0  0.00 ${p.rot + 270}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask)
        ${p.VCC.str})
        (pad 1 thru_hole rect (at 0.0  2.54 ${p.rot + 270}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask)
        ${p.GND.str})
        (pad 1 thru_hole oval (at 0.0  5.08 ${p.rot + 270}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask)
        ${p.CS.str})
        )
        `
}
