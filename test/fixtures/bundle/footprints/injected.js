module.exports = {
  params: {
      designator: 'I'
  },
  body: p => `
    (module injected_test_footprint (layer F.Cu) (tedit 5E1ADAC2)
    ${p.at /* parametric position */} 

    ${'' /* footprint reference */}        
    (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
    )
  `
}