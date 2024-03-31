const m = require('makerjs')

module.exports = {

    convert_outline: (model, layer) => {
        const grs = []
        const xy = val => `${val[0]} ${-val[1]}`
        m.model.walk(model, {
            onPath: wp => {
                const p = wp.pathContext
                switch (p.type) {
                    case 'line':
                        grs.push(`(gr_line (start ${xy(p.origin)}) (end ${xy(p.end)}) (angle 90) (layer ${layer}) (width 0.15))`)
                        break
                    case 'arc':
                        const arc_center = p.origin
                        const angle_start = p.startAngle > p.endAngle ? p.startAngle - 360 : p.startAngle
                        const angle_diff = Math.abs(p.endAngle - angle_start)
                        const arc_end = m.point.rotate(m.point.add(arc_center, [p.radius, 0]), angle_start, arc_center)
                        grs.push(`(gr_arc (start ${xy(arc_center)}) (end ${xy(arc_end)}) (angle ${-angle_diff}) (layer ${layer}) (width 0.15))`)
                        break
                    case 'circle':
                        const circle_center = p.origin
                        const circle_end = m.point.add(circle_center, [p.radius, 0])
                        grs.push(`(gr_circle (center ${xy(circle_center)}) (end ${xy(circle_end)}) (layer ${layer}) (width 0.15))`)
                        break
                    default:
                        throw new Error(`Can't convert path type "${p.type}" to kicad!`)
                }
            }
        })
        return grs.join('\n')
    },

    body: params => {

        const net_text = params.nets.join('\n')
        const netclass_text = params.nets.map(net => `(add_net "${net.name}")`).join('\n')
        const footprint_text = params.footprints.join('\n')
        const outline_text = Object.values(params.outlines).join('\n')
        
        return `

(kicad_pcb (version 20171130) (host pcbnew 5.1.6)

  (page A3)
  (title_block
    (title "${params.name}")
    (rev "${params.version}")
    (company "${params.author}")
  )

  (general
    (thickness 1.6)
  )

  (layers
    (0 F.Cu signal)
    (31 B.Cu signal)
    (32 B.Adhes user)
    (33 F.Adhes user)
    (34 B.Paste user)
    (35 F.Paste user)
    (36 B.SilkS user)
    (37 F.SilkS user)
    (38 B.Mask user)
    (39 F.Mask user)
    (40 Dwgs.User user)
    (41 Cmts.User user)
    (42 Eco1.User user)
    (43 Eco2.User user)
    (44 Edge.Cuts user)
    (45 Margin user)
    (46 B.CrtYd user)
    (47 F.CrtYd user)
    (48 B.Fab user)
    (49 F.Fab user)
  )

  (setup
    (last_trace_width 0.25)
    (trace_clearance 0.2)
    (zone_clearance 0.508)
    (zone_45_only no)
    (trace_min 0.2)
    (via_size 0.8)
    (via_drill 0.4)
    (via_min_size 0.4)
    (via_min_drill 0.3)
    (uvia_size 0.3)
    (uvia_drill 0.1)
    (uvias_allowed no)
    (uvia_min_size 0.2)
    (uvia_min_drill 0.1)
    (edge_width 0.05)
    (segment_width 0.2)
    (pcb_text_width 0.3)
    (pcb_text_size 1.5 1.5)
    (mod_edge_width 0.12)
    (mod_text_size 1 1)
    (mod_text_width 0.15)
    (pad_size 1.524 1.524)
    (pad_drill 0.762)
    (pad_to_mask_clearance 0.05)
    (aux_axis_origin 0 0)
    (visible_elements FFFFFF7F)
    (pcbplotparams
      (layerselection 0x010fc_ffffffff)
      (usegerberextensions false)
      (usegerberattributes true)
      (usegerberadvancedattributes true)
      (creategerberjobfile true)
      (excludeedgelayer true)
      (linewidth 0.100000)
      (plotframeref false)
      (viasonmask false)
      (mode 1)
      (useauxorigin false)
      (hpglpennumber 1)
      (hpglpenspeed 20)
      (hpglpendiameter 15.000000)
      (psnegative false)
      (psa4output false)
      (plotreference true)
      (plotvalue true)
      (plotinvisibletext false)
      (padsonsilk false)
      (subtractmaskfromsilk false)
      (outputformat 1)
      (mirror false)
      (drillshape 1)
      (scaleselection 1)
      (outputdirectory ""))
  )

  ${net_text}

  (net_class Default "This is the default net class."
    (clearance 0.2)
    (trace_width 0.25)
    (via_dia 0.8)
    (via_drill 0.4)
    (uvia_dia 0.3)
    (uvia_drill 0.1)
    ${netclass_text}
  )

  ${footprint_text}
  ${outline_text}

)

`

}
}