module.exports = {
    nets: {
        net: undefined
    },
    params: {
        class: 'HOLE',
        diameter: 2.2,
    },
    body: p => {
        const mainHoleRadius = p.diameter / 1.35;
        const radStep = Math.PI / 4; // For 8 surrounding holes
        let pads = '';
        for (let i = 0; i < 8; i++) {
            let x = mainHoleRadius * Math.cos(radStep * i);
            let y = mainHoleRadius * Math.sin(radStep * i);
            pads += `(pad "1" thru_hole circle locked (at ${x} ${y}) (size 0.7 0.7) (drill 0.4) (layers *.Cu *.Mask))\n`;
        }
        return `
        (module "Mount_Hole_${p.diameter}mm_Pad_Via" (layer "F.Cu")
          ${p.at /* parametric position */}

          (fp_text reference "${p.ref}" (at 0 ${-p.diameter - 1}) (layer "F.SilkS") ${p.ref_hide}
            (effects (font (size 1 1) (thickness 0.15)))
          )

          (fp_circle (center 0 0) (end ${p.diameter + 0.25} 0) (layer "F.CrtYd") (width 0.05) (fill none))
          (pad "1" thru_hole circle locked (at 0 0) (size ${p.diameter * 2} ${p.diameter * 2}) (drill ${p.diameter}) (layers *.Cu *.Mask))
          ${pads}
        )`
    }
}
