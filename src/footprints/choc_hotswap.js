module.exports = {
    nets: ['from', 'to'],
    params: {
        class: 'S',
		reverse: true
    },
    body: p => {
		
		const reversal = (j) => {
			if (j == true) return `
			(pad "" np_thru_hole circle (at -5 -3.75) (size 3 3) (drill 3) (layers *.Cu *.Mask))
			(pad 1 smd rect (at 3.275 -5.95 ${p.rot}) (size 2.6 2.6) (layers F.Cu F.Paste F.Mask)  ${p.net.from})
			(pad 2 smd rect (at -8.275 -3.75 ${p.rot}) (size 2.6 2.6) (layers F.Cu F.Paste F.Mask)  ${p.net.to})
			`
			else return ''
		}

		return `
    (module Kailh_socket_PG1350_optional (layer F.Cu) (tedit 5DD50F3F)

        ${p.at /* parametric position */}   
  
        ${'' /* footprint reference */}
        (fp_text reference "${p.ref}" (at 0 -8.255) (layer F.SilkS) ${p.ref_hide}
            (effects (font (size 1 1) (thickness 0.15))))
        (fp_text value "" (at 0 8.25) (layer F.Fab)
            (effects (font (size 1 1) (thickness 0.15))))       
        
        
        (fp_line (start -6.9 6.9) (end 6.9 6.9) (layer Eco2.User) (width 0.15))
        (fp_line (start 6.9 -6.9) (end -6.9 -6.9) (layer Eco2.User) (width 0.15))
        (fp_line (start 6.9 -6.9) (end 6.9 6.9) (layer Eco2.User) (width 0.15))
        (fp_line (start -6.9 6.9) (end -6.9 -6.9) (layer Eco2.User) (width 0.15))
        
        ${''/* Outline */}
        (fp_line (start -7.5 -7.5) (end 7.5 -7.5) (layer F.Fab) (width 0.15))
        (fp_line (start 7.5 -7.5) (end 7.5 7.5) (layer F.Fab) (width 0.15))
        (fp_line (start 7.5 7.5) (end -7.5 7.5) (layer F.Fab) (width 0.15))
        (fp_line (start -7.5 7.5) (end -7.5 -7.5) (layer F.Fab) (width 0.15))
        
        ${'' /* holes */}
        (pad "" np_thru_hole circle (at -5.5 0) (size 1.7018 1.7018) (drill 1.7018) (layers *.Cu *.Mask))
        (pad "" np_thru_hole circle (at 5.5 0) (size 1.7018 1.7018) (drill 1.7018) (layers *.Cu *.Mask))
        (pad "" np_thru_hole circle (at 5 -3.75) (size 3 3) (drill 3) (layers *.Cu *.Mask))
        (pad "" np_thru_hole circle (at 0 0) (size 3.429 3.429) (drill 3.429) (layers *.Cu *.Mask))
        (pad "" np_thru_hole circle (at 0 -5.95) (size 3 3) (drill 3) (layers *.Cu *.Mask))
        
        ${'' /* net pads */}
        (pad 1 smd rect (at -3.275 -5.95 ${p.rot}) (size 2.6 2.6) (layers B.Cu B.Paste B.Mask)  ${p.net.from})
        (pad 2 smd rect (at 8.275 -3.75 ${p.rot}) (size 2.6 2.6) (layers B.Cu B.Paste B.Mask)  ${p.net.to})
		
		${reversal(p.param.reverse)}
		
    )


    `
}
}