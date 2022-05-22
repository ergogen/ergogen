module.exports = {
    nets: {
        r1: 'r1',
        r2: 'r2'
    },
    params: {
        class: 'S', 
	reverse: true
    },
    body: p => {
	    const standard = `
	(module Button_Switch_SMD:SW_SPST_B3U-1000P (layer F.Cu) (tedit 5A02FC95)
        ${p.at /* parametric position */}
	  (descr "Ultra-small-sized Tactile Switch with High Contact Reliability, Top-actuated Model, without Ground Terminal, without Boss")
	  (tags "Tactile Switch")
	  (attr smd)
	  (fp_circle (center 0 0) (end 0.75 0) (layer F.Fab) (width 0.1))
	  (fp_line (start -1.5 1.25) (end -1.5 -1.25) (layer F.Fab) (width 0.1))
	  (fp_line (start 1.5 1.25) (end -1.5 1.25) (layer F.Fab) (width 0.1))
	  (fp_line (start 1.5 -1.25) (end 1.5 1.25) (layer F.Fab) (width 0.1))
	  (fp_line (start -1.5 -1.25) (end 1.5 -1.25) (layer F.Fab) (width 0.1))
	  (fp_line (start -2.4 -1.65) (end -2.4 1.65) (layer F.CrtYd) (width 0.05))
	  (fp_line (start 2.4 -1.65) (end -2.4 -1.65) (layer F.CrtYd) (width 0.05))
	  (fp_line (start 2.4 1.65) (end 2.4 -1.65) (layer F.CrtYd) (width 0.05))
	  (fp_line (start -2.4 1.65) (end 2.4 1.65) (layer F.CrtYd) (width 0.05))
	  (fp_text user %R (at 0 -2.5) (layer F.Fab)
	    (effects (font (size 1 1) (thickness 0.15)))
	  )

	      `
	    function pins(def_neg, def_pos, def_side) {
		  return `
		    ${''/* pins */}
	  (pad 1 smd rect (at ${def_neg}1.7 0) (size 0.9 1.7) (layers ${def_side}.Cu ${def_side}.Paste ${def_side}.Mask) ${p.net.r1.str})
	  (pad 2 smd rect (at ${def_pos}1.7 0) (size 0.9 1.7) (layers ${def_side}.Cu ${def_side}.Paste ${def_side}.Mask) ${p.net.r2.str})
		  `
	    }
	    if(p.param.reverse) {
	      return `
		${standard}
		${pins('-', '', 'B')}
		${pins('', '-', 'F')})
		`
	    } else {
	      return `
		${standard}
		${pins('-', '', 'B')})
		`
	    }
	}
}
