module.exports = {
    nets: ['from', 'to'],
    body: `
  
    (module ComboDiode (layer F.Cu) (tedit 5B24D78E)


        ${''/* parametric position */}
        __AT
        
        ${''/* diode symbols */}
        (fp_line (start 0.25 0) (end 0.75 0) (layer F.SilkS) (width 0.1))
        (fp_line (start 0.25 0.4) (end -0.35 0) (layer F.SilkS) (width 0.1))
        (fp_line (start 0.25 -0.4) (end 0.25 0.4) (layer F.SilkS) (width 0.1))
        (fp_line (start -0.35 0) (end 0.25 -0.4) (layer F.SilkS) (width 0.1))
        (fp_line (start -0.35 0) (end -0.35 0.55) (layer F.SilkS) (width 0.1))
        (fp_line (start -0.35 0) (end -0.35 -0.55) (layer F.SilkS) (width 0.1))
        (fp_line (start -0.75 0) (end -0.35 0) (layer F.SilkS) (width 0.1))
        (fp_line (start 0.25 0) (end 0.75 0) (layer B.SilkS) (width 0.1))
        (fp_line (start 0.25 0.4) (end -0.35 0) (layer B.SilkS) (width 0.1))
        (fp_line (start 0.25 -0.4) (end 0.25 0.4) (layer B.SilkS) (width 0.1))
        (fp_line (start -0.35 0) (end 0.25 -0.4) (layer B.SilkS) (width 0.1))
        (fp_line (start -0.35 0) (end -0.35 0.55) (layer B.SilkS) (width 0.1))
        (fp_line (start -0.35 0) (end -0.35 -0.55) (layer B.SilkS) (width 0.1))
        (fp_line (start -0.75 0) (end -0.35 0) (layer B.SilkS) (width 0.1))
    
        ${''/* extra direction bars */}
        (fp_line (start -2.5 -0.9) (end -2.5 0.9) (layer F.SilkS) (width 0.12))
        (fp_line (start -2.5 -0.9) (end -2.5 0.9) (layer B.SilkS) (width 0.12))
        
        ${''/* SMD pads on both sides */}
        (pad 1 smd rect (at -1.65 0 __ROT(0)) (size 0.9 1.2) (layers F.Cu F.Paste F.Mask) __NET_TO)
        (pad 2 smd rect (at 1.65 0 __ROT(0)) (size 0.9 1.2) (layers B.Cu B.Paste B.Mask) __NET_FROM)
        (pad 1 smd rect (at -1.65 0 __ROT(0)) (size 0.9 1.2) (layers B.Cu B.Paste B.Mask) __NET_TO)
        (pad 2 smd rect (at 1.65 0 __ROT(0)) (size 0.9 1.2) (layers F.Cu F.Paste F.Mask) __NET_FROM)
        
        ${''/* THT terminals */}
        (pad 1 thru_hole rect (at -3.81 0 __ROT(0)) (size 1.778 1.778) (drill 0.9906) (layers *.Cu *.Mask) __NET_TO)
        (pad 2 thru_hole circle (at 3.81 0 __ROT(0)) (size 1.905 1.905) (drill 0.9906) (layers *.Cu *.Mask) __NET_FROM)
    )
  
    `
  }