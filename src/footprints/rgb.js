module.exports = {
    nets: {
        din: undefined,
        dout: undefined,
        VCC: 'VCC',
        GND: 'GND'
    },
    params: {
        class: 'LED',
        side: 'F'
    },
    body: p => `
    
        (module WS2812B (layer F.Cu) (tedit 53BEE615)

            ${p.at /* parametric position */}

            ${'' /* footprint reference */}
            (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
            (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))

            (fp_line (start -1.75 -1.75) (end -1.75 1.75) (layer ${p.param.side}.SilkS) (width 0.15))
            (fp_line (start -1.75 1.75) (end 1.75 1.75) (layer ${p.param.side}.SilkS) (width 0.15))
            (fp_line (start 1.75 1.75) (end 1.75 -1.75) (layer ${p.param.side}.SilkS) (width 0.15))
            (fp_line (start 1.75 -1.75) (end -1.75 -1.75) (layer ${p.param.side}.SilkS) (width 0.15))

            (fp_line (start -2.5 -2.5) (end -2.5 2.5) (layer ${p.param.side}.SilkS) (width 0.15))
            (fp_line (start -2.5 2.5) (end 2.5 2.5) (layer ${p.param.side}.SilkS) (width 0.15))
            (fp_line (start 2.5 2.5) (end 2.5 -2.5) (layer ${p.param.side}.SilkS) (width 0.15))
            (fp_line (start 2.5 -2.5) (end -2.5 -2.5) (layer ${p.param.side}.SilkS) (width 0.15))

            (fp_poly (pts (xy 4 2.2) (xy 4 0.375) (xy 5 1.2875)) (layer ${p.param.side}.SilkS) (width 0.1))

            (pad 1 smd rect (at -2.2 -0.875 ${p.rot}) (size 2.6 1) (layers ${p.param.side}.Cu ${p.param.side}.Paste ${p.param.side}.Mask) ${p.net.VCC.str})
            (pad 2 smd rect (at -2.2 0.875 ${p.rot}) (size 2.6 1) (layers ${p.param.side}.Cu ${p.param.side}.Paste ${p.param.side}.Mask) ${p.net.dout.str})
            (pad 3 smd rect (at 2.2 0.875 ${p.rot}) (size 2.6 1) (layers ${p.param.side}.Cu ${p.param.side}.Paste ${p.param.side}.Mask) ${p.net.GND.str})
            (pad 4 smd rect (at 2.2 -0.875 ${p.rot}) (size 2.6 1) (layers ${p.param.side}.Cu ${p.param.side}.Paste ${p.param.side}.Mask) ${p.net.din.str})

            (pad 11 smd rect (at -2.5 -1.6 ${p.rot}) (size 2 1.2) (layers ${p.param.side}.Cu ${p.param.side}.Paste ${p.param.side}.Mask) ${p.net.VCC.str})
            (pad 22 smd rect (at -2.5 1.6 ${p.rot}) (size 2 1.2) (layers ${p.param.side}.Cu ${p.param.side}.Paste ${p.param.side}.Mask) ${p.net.dout.str})
            (pad 33 smd rect (at 2.5 1.6 ${p.rot}) (size 2 1.2) (layers ${p.param.side}.Cu ${p.param.side}.Paste ${p.param.side}.Mask) ${p.net.GND.str})
            (pad 44 smd rect (at 2.5 -1.6 ${p.rot}) (size 2 1.2) (layers ${p.param.side}.Cu ${p.param.side}.Paste ${p.param.side}.Mask) ${p.net.din.str})
            
        )
    
    `
}