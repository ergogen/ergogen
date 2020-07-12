const m = require('makerjs')
const u = require('./utils')
const a = require('./assert')

const Point = require('./point')

const kicad_prefix = `
(kicad_pcb (version 20171130) (host pcbnew 5.1.6)

  (page A3)
  (title_block
    (title KEYBOARD_NAME_HERE)
    (rev VERSION_HERE)
    (company YOUR_NAME_HERE)
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
`

const kicad_suffix = `
)
`

const kicad_netclass = `
  (net_class Default "This is the default net class."
    (clearance 0.2)
    (trace_width 0.25)
    (via_dia 0.8)
    (via_drill 0.4)
    (uvia_dia 0.3)
    (uvia_drill 0.1)
    __ADD_NET
  )
`

const makerjs2kicad = exports._makerjs2kicad = (model, layer='Edge.Cuts') => {
    const grs = []
    const xy = val => `${val[0]} ${val[1]}`
    m.model.walk(model, {
        onPath: wp => {
            const p = wp.pathContext
            switch (p.type) {
                case 'line':
                    grs.push(`(gr_line (start ${xy(p.origin)}) (end ${xy(p.end)}) (angle 90) (layer ${layer}) (width 0.15))`)
                    break
                case 'arc':
                    const center = p.origin
                    const angle_start = p.startAngle > p.endAngle ? p.startAngle - 360 : p.startAngle
                    const angle_diff = Math.abs(p.endAngle - angle_start)
                    const end = m.point.rotate(m.point.add(center, [p.radius, 0]), angle_start, center)
                    grs.push(`(gr_arc (start ${xy(center)}) (end ${xy(end)}) (angle ${angle_diff}) (layer ${layer}) (width 0.15))`)
                    break
                case 'circle':
                    break
                default:
                    throw new Error(`Can't convert path type "${p.type}" to kicad!`)
            }
        }
    })
    return grs
}

const footprint_types = require('./footprints')
const footprint = exports._footprint = (config, name, points, net_indexer, default_anchor) => {
    
    // config sanitization
    a.detect_unexpected(config, name, ['type', 'anchor', 'between', 'params'])
    const type = a.in(config.type, `${name}.type`, Object.keys(footprint_types))
    let anchor = a.anchor(config.anchor, `${name}.anchor`, points, true, default_anchor)
    const params = a.sane(config.params, `${name}.params`, 'object')

    // averaging multiple anchors, if necessary
    if (config.between) {
        const between = a.sane(config.between, `${name}.between`, 'array')
        let x = 0, y = 0, r = 0, bi = 0
        const len = between.length
        for (const b of between) {
            ba = a.anchor(b, `${name}.between[${++bi}]`, points, true)
            x += ba.x
            y += ba.y
            r += ba.r
        }
        anchor = new Point(x / len, y / len, r / len)
    }

    // basic setup
    const fp = footprint_types[type]
    let result = fp.body

    // footprint positioning
    const at = `(at ${anchor.x} ${anchor.y} ${anchor.r})`
    result = result.replace('__AT', at)

    // connecting static nets
    for (const net of (fp.nets || [])) {
        const index = net_indexer(net)
        result = result.replace('__NET_' + net.toUpperCase(), `(net ${index} "${net}")`)
    }

    // connecting parametric nets
    for (const param of (fp.params || [])) {
        const net = params[param]
        a.sane(net, `${name}.params.${param}`, 'string')
        const index = net_indexer(net)
        result = result.replace('__PARAM_' + net.toUpperCase(), `(net ${index} "${net}")`)
    }

    return result
}

exports.parse = (config, points, outlines) => {

    // config sanitization
    a.detect_unexpected(config, 'pcb', ['edge', 'footprints'])
    const edge = outlines[config.edge]
    if (!edge) throw new Error(`Field "pcb.edge" doesn't name a valid outline!`)

    // Edge.Cuts conversion
    const kicad_edge = makerjs2kicad(edge)

    // making a global net index registry
    const nets = {}
    const net_indexer = net => {
        if (nets[net]) return nets[net]
        const index = Object.keys(nets).length
        return nets[net] = index
    }

    const footprints = []

    // key-level footprints
    for (const [pname, point] of Object.entries(points)) {
        let f_index = 0
        for (const f of (point.meta.footprints || [])) {
            footprints.push(footprint(f, `${pname}.footprints[${++f_index}]`, points, net_indexer, point))
        }
    }

    // global one-off footprints
    const global_footprints = a.sane(config.footprints || [], 'pcb.footprints', 'array')
    let gf_index = 0
    for (const gf of global_footprints) {
        footprints.push(footprint(gf, `pcb.footprints[${++gf_index}]`, points, net_indexer))
    }

    // finalizing nets
    const nets_arr = []
    const add_nets_arr = []
    for (const [net, index] of Object.entries(nets)) {
        nets_arr.push(`(net ${index} "${net}")`)
        add_nets_arr.push(`(add_net "${net}")`)
    }

    const netclass = kicad_netclass.replace('__ADD_NET', add_nets_arr.join('\n'))
    const nets_text = nets_arr.join('\n')
    const footprint_text = footprints.join('\n')
    return `
    
        ${kicad_prefix}
        ${nets_text}
        ${netclass}
        ${footprint_text}
        ${kicad_suffix}
    
    `
}