module.exports = {
    params: {
        pos: {type: 'net', value: 'pos'},
        neg: {type: 'net', value: 'neg'},
        designator: 'BAT' // for Button
    },
    body: p => `

    (module lib:bat (layer F.Cu) (tstamp 5BF2CC94)
        ${p.at /* parametric position */}
	  (pad 1 thru_hole circle (at 0 -0.75 0) (size 1 1) (drill 0.7) (layers *.Cu *.SilkS *.Mask) ${p.pos.str})
	  (pad 2 thru_hole circle (at 0 0.75 0) (size 1 1) (drill 0.7) (layers *.Cu *.SilkS *.Mask) ${p.neg.str})
     )
    `
}
