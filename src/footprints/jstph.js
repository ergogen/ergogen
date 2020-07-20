module.exports = {
    nets: ['pos', 'neg'],
    params: {
        side: 'F'
    },
    body: p => `
    
    (module JST_PH_S2B-PH-K_02x2.00mm_Angled (layer F.Cu) (tedit 58D3FE32)

        (descr "JST PH series connector, S2B-PH-K, side entry type, through hole, Datasheet: http://www.jst-mfg.com/product/pdf/eng/ePH.pdf")
        (tags "connector jst ph")

        ${p.at /* parametric position */}

        (fp_line (start -2.25 0.25) (end -2.25 -1.35) (layer ${p.param_side}.SilkS) (width 0.15))
        (fp_line (start -2.25 -1.35) (end -2.95 -1.35) (layer ${p.param_side}.SilkS) (width 0.15))
        (fp_line (start -2.95 -1.35) (end -2.95 6.25) (layer ${p.param_side}.SilkS) (width 0.15))
        (fp_line (start -2.95 6.25) (end 2.95 6.25) (layer ${p.param_side}.SilkS) (width 0.15))
        (fp_line (start 2.95 6.25) (end 2.95 -1.35) (layer ${p.param_side}.SilkS) (width 0.15))
        (fp_line (start 2.95 -1.35) (end 2.25 -1.35) (layer ${p.param_side}.SilkS) (width 0.15))
        (fp_line (start 2.25 -1.35) (end 2.25 0.25) (layer ${p.param_side}.SilkS) (width 0.15))
        (fp_line (start 2.25 0.25) (end -2.25 0.25) (layer ${p.param_side}.SilkS) (width 0.15))

        (fp_line (start -1 1.5) (end -1 2.0) (layer ${p.param_side}.SilkS) (width 0.15))
        (fp_line (start -1.25 1.75) (end -0.75 1.75) (layer ${p.param_side}.SilkS) (width 0.15))

        (pad 1 thru_hole rect (at -1 0 ${p.rot}) (size 1.2 1.7) (drill 0.75) (layers *.Cu *.Mask) ${p.net_pos})
        (pad 2 thru_hole oval (at 1 0 ${p.rot}) (size 1.2 1.7) (drill 0.75) (layers *.Cu *.Mask) ${p.net_neg})
            
    )
    
    `
}