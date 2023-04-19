// reversible nice!nano footprint.
// stolen from: https://github.com/kvietcong/ergogen/blob/develop/src/footprints/niceview.js
module.exports = {
    params: {
        designator: 'nice!view',
        side: 'F',
        SCK: {type: 'net', value: 'SCK'},
        MOSI: {type: 'net', value: 'MOSI'},
        VCC: {type: 'net', value: 'VCC'},
        GND: {type: 'net', value: 'GND'},
        CS: {type: 'net', value: 'CS'},
    },
    body: p => `
        (module lib:niceview (layer F.Cu) (tedit 5E1ADAC2)
            ${p.at /* parametric position */}

            ${'' /* footprint reference */}
            (fp_text reference "${p.ref}" (at 0 0) (layer ${p.side}.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
            (fp_text value nice!view (at 0 -7.3) (layer ${p.side}.Fab) (effects (font (size 1 1) (thickness 0.15))))

            ${'' /* pins */}
            (pad 1 thru_hole oval (at 1.6 0 ${p.rot+270}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("1").str})
            (pad 1 smd rect (at 3.9 0 ${p.rot}) (size 0.635 1.143) (layers F.Cu F.Paste F.Mask)
                (clearance 0.1905) ${p.MOSI.str})
            (pad 1 smd rect (at 2.899 0 ${p.rot}) (size 0.635 1.143) (layers F.Cu F.Paste F.Mask)
                (clearance 0.1905) ${p.local_net("1").str})
            (pad 1 smd rect (at 3.9 0 ${p.rot}) (size 0.635 1.143) (layers B.Cu B.Paste B.Mask)
                (clearance 0.1905) ${p.CS.str})
            (pad 1 smd rect (at 2.899 0 ${p.rot}) (size 0.635 1.143) (layers B.Cu B.Paste B.Mask)
                (clearance 0.1905) ${p.local_net("1").str})

            (pad 2 thru_hole oval (at 1.6 2.54 ${p.rot+270}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("2").str})
            (pad 2 smd rect (at 3.9 2.54 ${p.rot}) (size 0.635 1.143) (layers F.Cu F.Paste F.Mask)
                (clearance 0.1905) ${p.SCK.str})
            (pad 2 smd rect (at 2.899 2.54 ${p.rot}) (size 0.635 1.143) (layers F.Cu F.Paste F.Mask)
                (clearance 0.1905) ${p.local_net("2").str})
            (pad 2 smd rect (at 3.9 2.54 ${p.rot}) (size 0.635 1.143) (layers B.Cu B.Paste B.Mask)
                (clearance 0.1905) ${p.GND.str})
            (pad 2 smd rect (at 2.899 2.54 ${p.rot}) (size 0.635 1.143) (layers B.Cu B.Paste B.Mask)
                (clearance 0.1905) ${p.local_net("2").str})

            (pad 3 thru_hole oval (at 1.6 5.08 ${p.rot+270}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.VCC.str})

            (pad 4 thru_hole oval (at 1.6 7.62 ${p.rot+270}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("4").str})
            (pad 4 smd rect (at 3.9 7.62 ${p.rot}) (size 0.635 1.143) (layers F.Cu F.Paste F.Mask)
                (clearance 0.1905) ${p.GND.str})
            (pad 4 smd rect (at 2.899 7.62 ${p.rot}) (size 0.635 1.143) (layers F.Cu F.Paste F.Mask)
                (clearance 0.1905) ${p.local_net("4").str})
            (pad 4 smd rect (at 3.9 7.62 ${p.rot}) (size 0.635 1.143) (layers B.Cu B.Paste B.Mask)
                (clearance 0.1905) ${p.SCK.str})
            (pad 4 smd rect (at 2.899 7.62 ${p.rot}) (size 0.635 1.143) (layers B.Cu B.Paste B.Mask)
                (clearance 0.1905) ${p.local_net("4").str})

            (pad 5 thru_hole oval (at 1.6 10.16 ${p.rot+270}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("5").str})
            (pad 5 smd rect (at 3.9 10.16 ${p.rot}) (size 0.635 1.143) (layers F.Cu F.Paste F.Mask)
                (clearance 0.1905) ${p.CS.str})
            (pad 5 smd rect (at 2.899 10.16 ${p.rot}) (size 0.635 1.143) (layers F.Cu F.Paste F.Mask)
                (clearance 0.1905) ${p.local_net("5").str})
            (pad 5 smd rect (at 3.9 10.16 ${p.rot}) (size 0.635 1.143) (layers B.Cu B.Paste B.Mask)
                (clearance 0.1905) ${p.MOSI.str})
            (pad 5 smd rect (at 2.899 10.16 ${p.rot}) (size 0.635 1.143) (layers B.Cu B.Paste B.Mask)
                (clearance 0.1905) ${p.local_net("5").str})
        )
        `
}
