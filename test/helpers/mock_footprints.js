exports.inject = (ergogen) => {
    ergogen.inject_footprint('trace_test', {
        nets: {
            P1: 'P1'
        },
        params: {
            class: 'T',
            side: 'F'
        },
        body: p => {
            return `

                (module trace_test (layer F.Cu) (tedit 5CF31DEF)

                    ${p.at /* parametric position */}

                    (pad 1 smd rect (at 0 0 ${p.rot}) (size 1 1) (layers F.Cu F.Paste F.Mask)
                        ${p.net.P1.str} (solder_mask_margin 0.2))

                    (pad 2 smd rect (at 5 5 ${p.rot}) (size 1 1) (layers F.Cu F.Paste F.Mask)
                        ${p.net.P1.str} (solder_mask_margin 0.2))

                )

                (segment (start ${p.xy(0, 0)}) (end ${p.xy(5, 5)}) (width 0.25) (layer F.Cu) (net ${p.net.P1.index}))

            `
        }
    })

    ergogen.inject_footprint('zone_test', {
        nets: {
            P1: 'P1'
        },
        params: {
            class: 'T',
            side: 'F'
        },
        body: p => {
            return `

                (module zone_test (layer F.Cu) (tedit 5CF31DEF)

                    ${p.at /* parametric position */}

                    (pad 1 smd rect (at 0 0 ${p.rot}) (size 1 1) (layers F.Cu F.Paste F.Mask)
                        ${p.net.P1.str} (solder_mask_margin 0.2))

                    (pad 2 smd rect (at 5 5 ${p.rot}) (size 1 1) (layers F.Cu F.Paste F.Mask)
                        ${p.net.P1.str} (solder_mask_margin 0.2))

                )

                (zone (net ${p.net.P1.index}) (net_name ${p.net.P1.name}) (layer ${p.param.side}.Cu) (tstamp 0) (hatch full 0.508)
                    (connect_pads (clearance 0.508))
                    (min_thickness 0.254)
                    (fill yes (arc_segments 32) (thermal_gap 0.508) (thermal_bridge_width 0.508))
                    (polygon (pts (xy ${p.xy(5, 5)}) (xy ${p.xy(5, -5)}) (xy ${p.xy(-5, -5)}) (xy ${p.xy(-5, 5)})))
                )

            `
        }
    })

    ergogen.inject_footprint('dynamic_net_test', {
        nets: {},
        params: {
            class: 'T',
            side: 'F'
        },
        body: p => {
            return ` 

                (module dynamic_net_test (layer F.Cu) (tedit 5CF31DEF)

                    ${p.at /* parametric position */}

                    (pad 1 smd rect (at 0 0 ${p.rot}) (size 1 1) (layers F.Cu F.Paste F.Mask)
                        ${p.local_net('1').str} (solder_mask_margin 0.2))

                    (pad 1 smd rect (at 0 0 ${p.rot}) (size 1 1) (layers F.Cu F.Paste F.Mask)
                        ${p.local_net('2').str} (solder_mask_margin 0.2))

                    (pad 1 smd rect (at 0 0 ${p.rot}) (size 1 1) (layers F.Cu F.Paste F.Mask)
                        ${p.local_net('3').str} (solder_mask_margin 0.2))

                )

            `
        }
    })

    ergogen.inject_footprint('anchor_test', {
        nets: {},
        params: {
            class: 'T',
            side: 'F'
        },
        anchors: {
            end: undefined
        },
        body: p => {
            return ` 

                (module anchor_test (layer F.Cu) (tedit 5CF31DEF)

                    ${p.at /* parametric position */}

                    (fp_line (start 0 0) (end ${p.anchors.end.x} ${p.anchors.end.y}) (layer Dwgs.User) (width 0.05))

                )

            `
        }
    })

    ergogen.inject_footprint('references_test', {
        nets: {},
        params: {},
        body: p => {
            return `references ${p.ref_hide ? 'hidden' : 'shown'}`
        }
    })
}