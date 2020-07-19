module.exports = {
    static_nets: ['VCC', 'GND'],
    nets: ['din', 'dout'],
    params: {
        side: 'F'
    },
    body: p => `
    
        (module WS2812B (layer F.Cu) (tedit 53BEE615)

            ${p.at /* parametric position */}

            (fp_line (start -1.75 -1.75) (end -1.75 1.75) (layer ${p.param_side}.SilkS) (width 0.15))
            (fp_line (start -1.75 1.75) (end 1.75 1.75) (layer ${p.param_side}.SilkS) (width 0.15))
            (fp_line (start 1.75 1.75) (end 1.75 -1.75) (layer ${p.param_side}.SilkS) (width 0.15))
            (fp_line (start 1.75 -1.75) (end -1.75 -1.75) (layer ${p.param_side}.SilkS) (width 0.15))

            (fp_line (start -2.5 -2.5) (end -2.5 2.5) (layer ${p.param_side}.SilkS) (width 0.15))
            (fp_line (start -2.5 2.5) (end 2.5 2.5) (layer ${p.param_side}.SilkS) (width 0.15))
            (fp_line (start 2.5 2.5) (end 2.5 -2.5) (layer ${p.param_side}.SilkS) (width 0.15))
            (fp_line (start 2.5 -2.5) (end -2.5 -2.5) (layer ${p.param_side}.SilkS) (width 0.15))

            (fp_poly (pts (xy 4 2.2) (xy 4 0.375) (xy 5 1.2875)) (layer ${p.param_side}.SilkS) (width 0.1))

            (pad 1 smd rect (at -2.2 -0.875 ${p.rot}) (size 2.6 1) (layers ${p.param_side}.Cu ${p.param_side}.Paste ${p.param_side}.Mask) ${p.net_VCC})
            (pad 2 smd rect (at -2.2 0.875 ${p.rot}) (size 2.6 1) (layers ${p.param_side}.Cu ${p.param_side}.Paste ${p.param_side}.Mask) ${p.net_dout})
            (pad 3 smd rect (at 2.2 0.875 ${p.rot}) (size 2.6 1) (layers ${p.param_side}.Cu ${p.param_side}.Paste ${p.param_side}.Mask) ${p.net_GND})
            (pad 4 smd rect (at 2.2 -0.875 ${p.rot}) (size 2.6 1) (layers ${p.param_side}.Cu ${p.param_side}.Paste ${p.param_side}.Mask) ${p.net_din})

            (pad 11 smd rect (at -2.5 -1.6 ${p.rot}) (size 2 1.2) (layers ${p.param_side}.Cu ${p.param_side}.Paste ${p.param_side}.Mask) ${p.net_VCC})
            (pad 22 smd rect (at -2.5 1.6 ${p.rot}) (size 2 1.2) (layers ${p.param_side}.Cu ${p.param_side}.Paste ${p.param_side}.Mask) ${p.net_dout})
            (pad 33 smd rect (at 2.5 1.6 ${p.rot}) (size 2 1.2) (layers ${p.param_side}.Cu ${p.param_side}.Paste ${p.param_side}.Mask) ${p.net_GND})
            (pad 44 smd rect (at 2.5 -1.6 ${p.rot}) (size 2 1.2) (layers ${p.param_side}.Cu ${p.param_side}.Paste ${p.param_side}.Mask) ${p.net_din})
            
        )
    
    `
}