// Kailh Choc PG1232
// Nets
//    from: corresponds to pin 1
//    to: corresponds to pin 2
// Params
//    reverse: default is false
//      if true, will flip the footprint such that the pcb can be reversible 

module.exports = {
    nets: ['from', 'to'],
    params: {
      class: 'S',
		  side: 'F',
		  reverse: false
    },
    body: p => {
	    const standard = `
        (module lib:Kailh_PG1232 (layer F.Cu) (tedit 5E1ADAC2)
        ${p.at /* parametric position */} 

        ${'' /* footprint reference */}        
        (fp_text reference REF** (at 0 7.4) (layer F.Fab) (effects (font (size 1 1) (thickness 0.15))))
        (fp_text value Kailh_PG1232 (at 0 -7.3) (layer F.Fab) (effects (font (size 1 1) (thickness 0.15))))

        ${''/* corner marks */}
        (fp_line (start 9 -8.5) (end -9 -8.5) (layer Dwgs.User) (width 0.12))
        (fp_line (start 9 8.5) (end 9 -8.5) (layer Dwgs.User) (width 0.12))
        (fp_line (start -9 8.5) (end 9 8.5) (layer Dwgs.User) (width 0.12))
        (fp_line (start -9 -8.5) (end -9 8.5) (layer Dwgs.User) (width 0.12))
        (fp_line (start 2.25 2.95) (end 5.95 2.95) (layer Dwgs.User) (width 0.12))
        (fp_line (start -2.25 2.95) (end -5.95 2.95) (layer Dwgs.User) (width 0.12))
        (fp_line (start 2.25 4) (end 2.25 2.95) (layer Dwgs.User) (width 0.12))
        (fp_line (start -2.25 4) (end 2.25 4) (layer Dwgs.User) (width 0.12))
        (fp_line (start -2.25 2.95) (end -2.25 4) (layer Dwgs.User) (width 0.12))
        (fp_line (start -6.75 6.25) (end -6.75 -6.25) (layer Dwgs.User) (width 0.12))
        (fp_line (start 6.75 6.25) (end -6.75 6.25) (layer Dwgs.User) (width 0.12))
        (fp_line (start 6.75 -6.25) (end 6.75 6.25) (layer Dwgs.User) (width 0.12))
        (fp_line (start -6.75 -6.25) (end 6.75 -6.25) (layer Dwgs.User) (width 0.12))
        (fp_line (start -5.95 2.95) (end -5.95 -2.95) (layer Dwgs.User) (width 0.12))
        (fp_line (start 5.95 -2.95) (end 5.95 2.95) (layer Dwgs.User) (width 0.12))
        (fp_line (start -5.95 -2.95) (end 5.95 -2.95) (layer Dwgs.User) (width 0.12))
        
        ${''/* stabilizers */}    
        (pad 3 thru_hole circle (at 5.3 -4.75) (size 1.6 1.6) (drill 1.1) (layers *.Cu *.Mask) (clearance 0.2))
        (pad 4 thru_hole circle (at -5.3 -4.75) (size 1.6 1.6) (drill 1.1) (layers *.Cu *.Mask) (clearance 0.2))
      `
      function pins(def_neg, def_pos) {
        return `
        ${''/* middle shaft */}        	 
        (pad "" np_thru_hole oval (at ${def_pos}0 3.5 ${p.rot}) (size 4.7 1) (drill oval 4.7 1) (layers *.Cu *.Mask))
        (pad "" np_thru_hole oval (at ${def_neg}2.2 3.5 ${90 + p.rot}) (size 1.2 0.3) (drill oval 1.2 0.3) (layers *.Cu *.Mask))
        (pad "" np_thru_hole oval (at ${def_pos}2.2 3.5 ${90 + p.rot}) (size 1.2 0.3) (drill oval 1.2 0.3) (layers *.Cu *.Mask))
        (pad "" np_thru_hole oval (at ${def_pos}0 3.95 ${p.rot}) (size 4.7 0.3) (drill oval 4.7 0.3) (layers *.Cu *.Mask))
        (pad "" np_thru_hole oval (at ${def_pos}5.36 0 ${p.rot}) (size 1 5.9) (drill oval 1 5.9) (layers *.Cu *.Mask))
        (pad "" np_thru_hole oval (at ${def_pos}4.59 0 ${p.rot}) (size 1 5.9) (drill oval 1 5.9) (layers *.Cu *.Mask))
        (pad "" np_thru_hole oval (at ${def_pos}4.2 0 ${p.rot}) (size 1 5.9) (drill oval 1 5.9) (layers *.Cu *.Mask))
        (pad "" np_thru_hole oval (at ${def_neg}4.2 0 ${p.rot}) (size 1 5.9) (drill oval 1 5.9) (layers *.Cu *.Mask))
        (pad "" np_thru_hole oval (at ${def_neg}4.59 0 ${p.rot}) (size 1 5.9) (drill oval 1 5.9) (layers *.Cu *.Mask))
        (pad "" np_thru_hole oval (at ${def_neg}5.9 0 ${90 + p.rot}) (size 6.1 0.3) (drill oval 6.1 0.3) (layers *.Cu *.Mask))
        (pad "" np_thru_hole oval (at ${def_pos}5.9 0 ${90 + p.rot}) (size 6.1 0.3) (drill oval 6.1 0.3) (layers *.Cu *.Mask))
        (pad "" np_thru_hole oval (at ${def_pos}0 2.9 ${p.rot}) (size 12.1 0.3) (drill oval 12.1 0.3) (layers *.Cu *.Mask))
        (pad "" np_thru_hole oval (at ${def_pos}0 -2.9 ${p.rot}) (size 12.1 0.3) (drill oval 12.1 0.3) (layers *.Cu *.Mask))
        (pad "" np_thru_hole oval (at ${def_neg}5.36 0 ${p.rot}) (size 1 5.9) (drill oval 1 5.9) (layers *.Cu *.Mask))
        (pad "" np_thru_hole oval (at ${def_pos}0 0 ${p.rot}) (size 11.85 5.9) (drill oval 11.85 5.9) (layers *.Cu *.Mask))
        
        ${''/* pins */}
        (pad 1 thru_hole circle (at ${def_neg}4.58 5.1) (size 1.6 1.6) (drill 1.1) (layers *.Cu *.Mask) ${p.net.from} (clearance 0.2))
        (pad 2 thru_hole circle (at ${def_pos}2 5.4) (size 1.6 1.6) (drill 1.1) (layers *.Cu *.Mask) ${p.net.to} (clearance 0.2))
			  `
      }
      if(p.param.reverse){
        return `
          ${standard}
          ${pins('-', '')}
          ${pins('', '-')})
          `
      } else {
        return `
          ${standard}
          ${pins('-', '')})
          `
      }
    }
  }