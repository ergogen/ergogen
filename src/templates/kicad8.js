const m = require('makerjs')
const version = require('../../package.json').version

module.exports = {

    convert_outline: (model, layer) => {
        const grs = []
        const xy = val => `${val[0]} ${-val[1]}`
        m.model.walk(model, {
            onPath: wp => {
                const p = wp.pathContext
                switch (p.type) {
                    case 'line':
                        grs.push(`(gr_line (start ${xy(p.origin)}) (end ${xy(p.end)}) (layer ${layer}) (stroke (width 0.15) (type default)))`)
                        break
                    case 'arc':
                        const arc_center = p.origin
                        const angle_start = p.startAngle > p.endAngle ? p.startAngle - 360 : p.startAngle
                        const angle_diff = Math.abs(p.endAngle - angle_start)
                        const arc_start = m.point.rotate(m.point.add(arc_center, [p.radius, 0]), angle_start, arc_center)
                        const arc_mid = m.point.rotate(arc_start, angle_diff / 2, arc_center)
                        const arc_end = m.point.rotate(arc_start, angle_diff, arc_center)
                        grs.push(`(gr_arc (start ${xy(arc_start)}) (mid ${xy(arc_mid)}) (end ${xy(arc_end)}) (layer ${layer}) (stroke (width 0.15) (type default)))`)
                        break
                    case 'circle':
                        const circle_center = p.origin
                        const circle_end = m.point.add(circle_center, [p.radius, 0])
                        grs.push(`(gr_circle (center ${xy(circle_center)}) (end ${xy(circle_end)}) (layer ${layer}) (stroke (width 0.15) (type default)) (fill none))`)
                        break
                    default:
                        throw new Error(`Can't convert path type "${p.type}" to kicad!`)
                }
            }
        })
        return grs.join('\n')
    },

    body: params => {
        const date_text = new Date().toISOString().slice(0, 10)
        const net_text = params.nets.join('\n')
        const footprint_text = params.footprints.join('\n')
        const outline_text = Object.values(params.outlines).join('\n')

        return `

(kicad_pcb
  (version 20240108)
  (generator "ergogen")
  (generator_version "${version}")
  (general
    (thickness 1.6)
    (legacy_teardrops no)
  )
  (paper "A3")
  (title_block
    (title "${params.name}")
    (date "${date_text}")
    (rev "${params.version}")
    (company "${params.author}")
  )

  (layers
    (0 "F.Cu" signal)
    (31 "B.Cu" signal)
    (32 "B.Adhes" user "B.Adhesive")
    (33 "F.Adhes" user "F.Adhesive")
    (34 "B.Paste" user)
    (35 "F.Paste" user)
    (36 "B.SilkS" user "B.Silkscreen")
    (37 "F.SilkS" user "F.Silkscreen")
    (38 "B.Mask" user)
    (39 "F.Mask" user)
    (40 "Dwgs.User" user "User.Drawings")
    (41 "Cmts.User" user "User.Comments")
    (42 "Eco1.User" user "User.Eco1")
    (43 "Eco2.User" user "User.Eco2")
    (44 "Edge.Cuts" user)
    (45 "Margin" user)
    (46 "B.CrtYd" user "B.Courtyard")
    (47 "F.CrtYd" user "F.Courtyard")
    (48 "B.Fab" user)
    (49 "F.Fab" user)
  )

  (setup
    (pad_to_mask_clearance 0.05)
    (allow_soldermask_bridges_in_footprints no)
    (pcbplotparams
      (layerselection 0x00010fc_ffffffff)
      (plot_on_all_layers_selection 0x0000000_00000000)
      (disableapertmacros no)
      (usegerberextensions no)
      (usegerberattributes yes)
      (usegerberadvancedattributes yes)
      (creategerberjobfile yes)
      (dashed_line_dash_ratio 12.000000)
      (dashed_line_gap_ratio 3.000000)
      (svgprecision 4)
      (plotframeref no)
      (viasonmask no)
      (mode 1)
      (useauxorigin no)
      (hpglpennumber 1)
      (hpglpenspeed 20)
      (hpglpendiameter 15.000000)
      (pdf_front_fp_property_popups yes)
      (pdf_back_fp_property_popups yes)
      (dxfpolygonmode yes)
      (dxfimperialunits yes)
      (dxfusepcbnewfont yes)
      (psnegative no)
      (psa4output no)
      (plotreference yes)
      (plotvalue yes)
      (plotfptext yes)
      (plotinvisibletext no)
      (sketchpadsonfab no)
      (subtractmaskfromsilk no)
      (outputformat 1)
      (mirror no)
      (drillshape 1)
      (scaleselection 1)
      (outputdirectory "")
    )
  )

  ${net_text}

  ${footprint_text}
  ${outline_text}

)

`

}
}