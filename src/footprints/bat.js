module.exports = {
    nets: {
        pos: 'pos',
        neg: 'neg'
    },
    params: {
        class: 'PAD' // for Button
    },
    body: p => `
    
    (module lib:bat (layer F.Cu) (tstamp 5BF2CC94)
        ${p.at /* parametric position */}
	  (pad 1 thru_hole circle (at 0 -1.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.pos.str}) 
	  (pad 2 thru_hole circle (at 0 1.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.neg.str})
     )

    `
}
