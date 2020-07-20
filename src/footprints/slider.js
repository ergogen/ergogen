module.exports = {
    nets: ['from', 'to'],
    params: {
        side: 'F'
    },
    body: p => {

        const sign = p.param_side == 'F' ? '-' : ''

        return `
        
        (module E73:SPDT_C128955 (layer F.Cu) (tstamp 5BF2CC3C)

            ${p.at /* parametric position */}
            
            ${'' /* outline */}
            (fp_line (start 1.95 -1.35) (end -1.95 -1.35) (layer ${p.param_side}.SilkS) (width 0.15))
            (fp_line (start 0 -1.35) (end -3.3 -1.35) (layer ${p.param_side}.SilkS) (width 0.15))
            (fp_line (start -3.3 -1.35) (end -3.3 1.5) (layer ${p.param_side}.SilkS) (width 0.15))
            (fp_line (start -3.3 1.5) (end 3.3 1.5) (layer ${p.param_side}.SilkS) (width 0.15))
            (fp_line (start 3.3 1.5) (end 3.3 -1.35) (layer ${p.param_side}.SilkS) (width 0.15))
            (fp_line (start 0 -1.35) (end 3.3 -1.35) (layer ${p.param_side}.SilkS) (width 0.15))
            
            ${'' /* extra indicator for the slider */}
            (fp_line (start -1.95 -3.85) (end 1.95 -3.85) (layer Dwgs.User) (width 0.15))
            (fp_line (start 1.95 -3.85) (end 1.95 -1.35) (layer Dwgs.User) (width 0.15))
            (fp_line (start -1.95 -1.35) (end -1.95 -3.85) (layer Dwgs.User) (width 0.15))
            
            ${'' /* bottom cutouts */}
            (pad "" np_thru_hole circle (at 1.5 0) (size 1 1) (drill 0.9) (layers *.Cu *.Mask))
            (pad "" np_thru_hole circle (at -1.5 0) (size 1 1) (drill 0.9) (layers *.Cu *.Mask))

            ${'' /* pins */}
            (pad 1 smd rect (at 2.25 2.075 ${p.rot}) (size 0.9 1.25) (layers ${p.param_side}.Cu ${p.param_side}.Paste ${p.param_side}.Mask) ${p.net_from})
            (pad 2 smd rect (at ${sign}0.75 2.075 ${p.rot}) (size 0.9 1.25) (layers ${p.param_side}.Cu ${p.param_side}.Paste ${p.param_side}.Mask) ${p.net_to})
            (pad 3 smd rect (at -2.25 2.075 ${p.rot}) (size 0.9 1.25) (layers ${p.param_side}.Cu ${p.param_side}.Paste ${p.param_side}.Mask))
            
            ${'' /* side mounts */}
            (pad "" smd rect (at 3.7 -1.1 ${p.rot}) (size 0.9 0.9) (layers ${p.param_side}.Cu ${p.param_side}.Paste ${p.param_side}.Mask))
            (pad "" smd rect (at 3.7 1.1 ${p.rot}) (size 0.9 0.9) (layers ${p.param_side}.Cu ${p.param_side}.Paste ${p.param_side}.Mask))
            (pad "" smd rect (at -3.7 1.1 ${p.rot}) (size 0.9 0.9) (layers ${p.param_side}.Cu ${p.param_side}.Paste ${p.param_side}.Mask))
            (pad "" smd rect (at -3.7 -1.1 ${p.rot}) (size 0.9 0.9) (layers ${p.param_side}.Cu ${p.param_side}.Paste ${p.param_side}.Mask))
        )
        
        `
    }
}