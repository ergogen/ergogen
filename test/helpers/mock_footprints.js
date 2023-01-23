exports.inject = (ergogen) => {
    ergogen.inject('footprint', 'trace_test', {
        params: {
            designator: 'T',
            side: 'F',
            width: 0.25,
            P1: {type: 'net', value: 'P1'}
        },
        body: p => {
            return `

                (module trace_test (layer ${p.side}.Cu) (tedit 5CF31DEF)

                    ${p.at /* parametric position */}

                    (pad 1 smd rect (at ${p.ixy(0, 0)} ${p.rot}) (size 1 1) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask)
                        ${p.P1.str} (solder_mask_margin 0.2))

                    (pad 2 smd rect (at ${p.ixy(5, 5)} ${p.rot}) (size 1 1) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask)
                        ${p.P1.str} (solder_mask_margin 0.2))

                )

                (segment (start ${p.sxy(0, 0)}) (end ${p.sxy(5, 5)}) (width ${p.width}) (layer ${p.side}.Cu) (net ${p.P1.index}))

            `
        }
    })

    ergogen.inject('footprint', 'zone_test', {
        params: {
            designator: 'T',
            side: 'F',
            P1: {type: 'net', value: 'P1'}
        },
        body: p => {
            return `

                (module zone_test (layer ${p.side}.Cu) (tedit 5CF31DEF)

                    ${p.at /* parametric position */}

                    (pad 1 smd rect (at 0 0 ${p.rot}) (size 1 1) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask)
                        ${p.P1.str} (solder_mask_margin 0.2))

                    (pad 2 smd rect (at 5 5 ${p.rot}) (size 1 1) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask)
                        ${p.P1.str} (solder_mask_margin 0.2))

                )

                (zone (net ${p.P1.index}) (net_name ${p.P1.name}) (layer ${p.side}.Cu) (tstamp 0) (hatch full 0.508)
                    (connect_pads (clearance 0.508))
                    (min_thickness 0.254)
                    (fill yes (arc_segments 32) (thermal_gap 0.508) (thermal_bridge_width 0.508))
                    (polygon (pts (xy ${p.xy(5, 5)}) (xy ${p.xy(5, -5)}) (xy ${p.xy(-5, -5)}) (xy ${p.xy(-5, 5)})))
                )

            `
        }
    })

    ergogen.inject('footprint', 'dynamic_net_test', {
        params: {
            designator: 'T',
            side: 'F'
        },
        body: p => {
            return ` 

                (module dynamic_net_test (layer ${p.side}.Cu) (tedit 5CF31DEF)

                    ${p.at /* parametric position */}

                    (pad 1 smd rect (at 0 0 ${p.rot}) (size 1 1) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask)
                        ${p.local_net('1').str} (solder_mask_margin 0.2))

                    (pad 1 smd rect (at 0 0 ${p.rot}) (size 1 1) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask)
                        ${p.local_net('2').str} (solder_mask_margin 0.2))

                    (pad 1 smd rect (at 0 0 ${p.rot}) (size 1 1) (layers ${p.side}.Cu ${p.side}.Paste ${p.side}.Mask)
                        ${p.local_net('3').str} (solder_mask_margin 0.2))

                )

            `
        }
    })

    ergogen.inject('footprint', 'anchor_test', {
        params: {
            designator: 'T',
            side: 'F',
            end: {type: 'anchor', value: undefined}
        },
        body: p => {
            return ` 

                (module anchor_test (layer ${p.side}.Cu) (tedit 5CF31DEF)

                    ${p.at /* parametric position */}

                    (fp_line (start 0 0) (end ${p.end.x} ${p.end.y}) (layer Dwgs.User) (width 0.05))

                )

            `
        }
    })

    ergogen.inject('footprint', 'arrobj_test', {
        params: {
            designator: 'T',
            side: 'F',
            start: {x: 0, y: 0},
            end: [[1, 0], [0, 1]]
        },
        body: p => {
            lines = ''
            for (const item of p.end) {
                lines += `(fp_line (start ${p.start.x} ${p.start.y}) (end ${item[0]} ${item[1]}) (layer Dwgs.User) (width 0.05))\n`
            }
            return ` 

                (module arrobj_test (layer ${p.side}.Cu) (tedit 5CF31DEF)

                    ${p.at /* parametric position */}

                    ${lines}

                )

            `
        }
    })

    ergogen.inject('references_test', {
        params: {},
        body: p => {
            return `references ${p.ref_hide ? 'hidden' : 'shown'}`
        }
    })
}