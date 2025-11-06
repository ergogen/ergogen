const ALPS_SKQGABE010 = (p) => {
  return `
    (module E73:SW_TACT_ALPS_SKQGABE010 (layer F.Cu) (tstamp 5BF2CC94)

      (descr "Low-profile SMD Tactile Switch, https://www.e-switch.com/product-catalog/tact/product-lines/tl3342-series-low-profile-smt-tact-switch")
      (tags "SPST Tactile Switch")

      ${p.at /* parametric position */}
      ${'' /* footprint reference */}
      (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
      (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))
        
      ${'' /* outline */}
      (fp_line (start 2.75 1.25) (end 1.25 2.75) (layer ${p.side}.SilkS) (width 0.15))
      (fp_line (start 2.75 -1.25) (end 1.25 -2.75) (layer ${p.side}.SilkS) (width 0.15))
      (fp_line (start 2.75 -1.25) (end 2.75 1.25) (layer ${p.side}.SilkS) (width 0.15))
      (fp_line (start -1.25 2.75) (end 1.25 2.75) (layer ${p.side}.SilkS) (width 0.15))
      (fp_line (start -1.25 -2.75) (end 1.25 -2.75) (layer ${p.side}.SilkS) (width 0.15))
      (fp_line (start -2.75 1.25) (end -1.25 2.75) (layer ${p.side}.SilkS) (width 0.15))
      (fp_line (start -2.75 -1.25) (end -1.25 -2.75) (layer ${p.side}.SilkS) (width 0.15))
      (fp_line (start -2.75 -1.25) (end -2.75 1.25) (layer ${p.side}.SilkS) (width 0.15))
      
      ${'' /* pins */}
      (pad 1 smd rect (at -3.1 -1.85 ${p.r}) (size 1.8 1.1) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask) ${p.from})
      (pad 1 smd rect (at 3.1 -1.85 ${p.r}) (size 1.8 1.1) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask) ${p.from})
      (pad 2 smd rect (at -3.1 1.85 ${p.r}) (size 1.8 1.1) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask) ${p.to})
      (pad 2 smd rect (at 3.1 1.85 ${p.r}) (size 1.8 1.1) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask) ${p.to})
    )   
  `;
};

const PTS636_SK43_LFS = (p) => {
  return `
    (module SW_TACT_PTS636_SK43_LFS (layer F.Cu) (tstamp 5BF2CC94)
  
      (descr "THT Tactile Switch, https://www.ckswitches.com/media/2779/pts636.pdf")
      (tags "THT Tactile Switch")
  
      ${p.at /* parametric position */}
      ${'' /* footprint reference */}
      (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
      (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))
      
      ${'' /* outline */}
      (fp_line (start -3 -1.75) (end 3 -1.75) (layer ${p.side}.SilkS) (width 0.15))
      (fp_line (start 3 -1.75) (end 3 1.75) (layer ${p.side}.SilkS) (width 0.15))
      (fp_line (start 3 1.75) (end -3 1.75) (layer ${p.side}.SilkS) (width 0.15))
      (fp_line (start -3 1.75) (end -3 -1.75) (layer ${p.side}.SilkS) (width 0.15))
      
      ${'' /* pins */}
      (pad 1 thru_hole circle (at 3.2 0 ${p.r}) (size 2 2) (drill 1.2) (layers *.Cu *.Mask) ${p.from})
      (pad 2 thru_hole circle (at -3.2 0 ${p.r}) (size 2 2) (drill 1.2) (layers *.Cu *.Mask) ${p.to})
    )
  `;
};

module.exports = {
  params: {
    designator: 'B', // for Button
    side: 'F',
    from: undefined,
    to: undefined,
    variant: 'ALPS_SKQGABE010'
  },
  body: (p) => {
    if (p.variant === 'ALPS_SKQGABE010') {
      return ALPS_SKQGABE010(p);
    }

    if (p.variant === 'PTS636_SK43_LFS') {
      return PTS636_SK43_LFS(p);
    }

    throw new Error(`Unknown button variant: ${p.variant}`)
  }
}
