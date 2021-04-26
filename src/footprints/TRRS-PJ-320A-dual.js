module.exports = {
  nets: ['A', 'B', 'C', 'D'],
    params: {
        class: 'T', // for TRRS
		reverse: true
    },
    body: p => {
		
		const reversal = (j) => {
			if (j == true) return `
			(pad 1 thru_hole oval (at 0 11.3 ${p.rot}) (size 1.6 2.2) (drill oval 0.9 1.5) (layers *.Cu *.Mask) ${p.net.A})
            (pad 2 thru_hole oval (at -4.6 10.2 ${p.rot}) (size 1.6 2.2) (drill oval 0.9 1.5) (layers *.Cu *.Mask) ${p.net.B})
            (pad 3 thru_hole oval (at -4.6 6.2 ${p.rot}) (size 1.6 2.2) (drill oval 0.9 1.5) (layers *.Cu *.Mask) ${p.net.C})
            (pad 4 thru_hole oval (at -4.6 3.2 ${p.rot}) (size 1.6 2.2) (drill oval 0.9 1.5) (layers *.Cu *.Mask) ${p.net.D})
			(fp_line (start 0.5 -2) (end -5.1 -2) (layer B.SilkS) (width 0.15))
            (fp_line (start -5.1 0) (end -5.1 -2) (layer B.SilkS) (width 0.15))
            (fp_line (start 0.5 0) (end 0.5 -2) (layer B.SilkS) (width 0.15))
            (fp_line (start -5.35 0) (end -5.35 12.1) (layer B.SilkS) (width 0.15))
            (fp_line (start 0.75 0) (end 0.75 12.1) (layer B.SilkS) (width 0.15))
            (fp_line (start 0.75 12.1) (end -5.35 12.1) (layer B.SilkS) (width 0.15))
            (fp_line (start 0.75 0) (end -5.35 0) (layer B.SilkS) (width 0.15))
			`
			else return ''
		}

		return `
		
		(module TRRS-PJ-320A-dual (layer F.Cu) (tedit 5970F8E5)

			${p.at /* parametric position */}   
			
			(fp_text reference REF** (at 0 14.2) (layer Dwgs.User) (effects (font (size 1 1) (thickness 0.15))))
			(fp_text value TRRS-PJ-320A-dual (at 0 -5.6) (layer F.Fab) (effects (font (size 1 1) (thickness 0.15))))
            (fp_line (start 0.5 -2) (end -5.1 -2) (layer F.SilkS) (width 0.15))
            (fp_line (start -5.1 0) (end -5.1 -2) (layer F.SilkS) (width 0.15))
            (fp_line (start 0.5 0) (end 0.5 -2) (layer F.SilkS) (width 0.15))
            (fp_line (start -5.35 0) (end -5.35 12.1) (layer F.SilkS) (width 0.15))
            (fp_line (start 0.75 0) (end 0.75 12.1) (layer F.SilkS) (width 0.15))
            (fp_line (start 0.75 12.1) (end -5.35 12.1) (layer F.SilkS) (width 0.15))
            (fp_line (start 0.75 0) (end -5.35 0) (layer F.SilkS) (width 0.15))
			  
            (pad 1 thru_hole oval (at -4.6 11.3 ${p.rot}) (size 1.6 2.2) (drill oval 0.9 1.5) (layers *.Cu *.Mask) ${p.net.A})
            (pad 2 thru_hole oval (at 0 10.2 ${p.rot}) (size 1.6 2.2) (drill oval 0.9 1.5) (layers *.Cu *.Mask) ${p.net.B})
            (pad 3 thru_hole oval (at 0 6.2 ${p.rot}) (size 1.6 2.2) (drill oval 0.9 1.5) (layers *.Cu *.Mask) ${p.net.C})
            (pad 4 thru_hole oval (at 0 3.2 ${p.rot}) (size 1.6 2.2) (drill oval 0.9 1.5) (layers *.Cu *.Mask) ${p.net.D})
			
			${reversal(p.param.reverse)}
			
            (pad "" np_thru_hole circle (at -2.3 8.6) (size 1.5 1.5) (drill 1.5) (layers *.Cu *.Mask))
            (pad "" np_thru_hole circle (at -2.3 8.6) (size 1.5 1.5) (drill 1.5) (layers *.Cu *.Mask))
            (pad "" np_thru_hole circle (at -2.3 1.6) (size 1.5 1.5) (drill 1.5) (layers *.Cu *.Mask))
			)
    `
}
}