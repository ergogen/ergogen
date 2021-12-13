module.exports = {
    nets: {
        from: undefined,
        to: undefined
    },
    params: {
      class: 'J',
	  side: 'F'
    },
    body: p => `
        (module lib:Jumper (layer F.Cu) (tedit 5E1ADAC2)
        ${p.at /* parametric position */} 

        ${'' /* footprint reference */}        
        (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
        (fp_text value Jumper (at 0 -7.3) (layer F.Fab) (effects (font (size 1 1) (thickness 0.15))))

        ${'' /* pins */}
        (pad 1 smd rect (at -0.50038 0 ${p.rot}) (size 0.635 1.143) (layers ${p.param.side}.Cu ${p.param.side}.Paste ${p.param.side}.Mask)
        (clearance 0.1905) ${p.net.from.str})
        (pad 2 smd rect (at 0.50038 0 ${p.rot}) (size 0.635 1.143) (layers ${p.param.side}.Cu ${p.param.side}.Paste ${p.param.side}.Mask)
        (clearance 0.1905) ${p.net.to.str}))
    `
}