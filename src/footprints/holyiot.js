// Arduino ProMicro atmega32u4au
// Params
//  orientation: default is down
//    if down, power led will face the pcb
//    if up, power led will face away from pcb

module.exports = {
  nets: {
    RAW: 'RAW',
    GND: 'GND',
    RST: 'RST',
    VCC: 'VCC',
    P21: 'P21',
    P20: 'P20',
    P19: 'P19',
    P18: 'P18',
    P15: 'P15',
    P14: 'P14',
    P16: 'P16',
    P10: 'P10',
    P1: 'P1',
    P0: 'P0',
    P2: 'P2',
    P3: 'P3',
    P4: 'P4',
    P5: 'P5',
    P6: 'P6',
    P7: 'P7',
    P8: 'P8',
    P9: 'P9',
  },
  params: {
    class: 'MCU',
    orientation: 'down'
  },
  body: p => `
      ${'' /* footprint reference */}
(module nRF52840_holyiot_18010 (layer F.Cu) (tedit 600753CA)

${p.at /* parametric position */}

  (fp_text reference REF** (at -5.3 10.75) (layer F.SilkS)
    (effects (font (size 1 1) (thickness 0.15)))
  )
  (fp_text value nRF52840_holyiot_18010 (at 0 2.8) (layer F.Fab)
    (effects (font (size 1 1) (thickness 0.15)))
  )
  (fp_line (start -6.75 -9) (end 6.75 -9) (layer F.CrtYd) (width 0.12))
  (fp_line (start 6.75 -9) (end 6.75 9) (layer F.CrtYd) (width 0.12))
  (fp_line (start 6.75 9) (end -6.75 9) (layer F.CrtYd) (width 0.12))
  (fp_line (start -6.75 9) (end -6.75 -9) (layer F.CrtYd) (width 0.12))
  (fp_line (start -7.25 8.5) (end -7.25 9.5) (layer F.SilkS) (width 0.12))
  (fp_line (start 7.25 8.5) (end 7.25 9.5) (layer F.SilkS) (width 0.12))
  (fp_line (start 6.25 9.5) (end 7.25 9.5) (layer F.SilkS) (width 0.12))
  (fp_line (start -6.25 9.5) (end -7.25 9.5) (layer F.SilkS) (width 0.12))
  (fp_line (start -9.5 -11.2) (end 9.5 -11.2) (layer Dwgs.User) (width 0.12))
  (fp_line (start 9.5 -11.2) (end 9.5 -6.2) (layer Dwgs.User) (width 0.12))
  (fp_line (start 9.5 -6.2) (end -9.5 -6.2) (layer Dwgs.User) (width 0.12))
  (fp_line (start -9.5 -6.2) (end -9.5 -11.2) (layer Dwgs.User) (width 0.12))
  (fp_text user "Add keepout (pour, via, tracks) on all layers here" (at 1.5 -12.5) (layer Dwgs.User)
    (effects (font (size 1 1) (thickness 0.15)))
  )
  (pad 1 smd rect (at -6.75 -5.7 ${p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 2 smd rect (at -6.75 -4.6 ${p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 3 smd rect (at -6.75 -3.5 ${p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 4 smd rect (at -6.75 -2.4 ${p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 5 smd rect (at -6.75 -1.3 ${p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 6 smd rect (at -6.75 -0.2 ${p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 7 smd rect (at -6.75 0.9 ${p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 8 smd rect (at -6.75 2 ${p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 9 smd rect (at -6.75 3.1 ${p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 10 smd rect (at -6.75 4.2 ${p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 11 smd rect (at -6.75 5.3 ${p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 12 smd rect (at -6.75 6.4 ${p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 13 smd rect (at -6.75 7.5 ${p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 14 smd rect (at -5.5 9 ${90 + p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 15 smd rect (at -4.4 9 ${90 + p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 16 smd rect (at -3.3 9 ${90 + p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 17 smd rect (at -2.2 9 ${90 + p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 18 smd rect (at -1.1 9 ${90 + p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 19 smd rect (at 0 9 ${90 + p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 20 smd rect (at 1.1 9 ${90 + p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 21 smd rect (at 2.2 9 ${90 + p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 22 smd rect (at 3.3 9 ${90 + p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 23 smd rect (at 4.4 9 ${90 + p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 24 smd rect (at 5.5 9 ${90 + p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 25 smd rect (at 6.75 7.5 ${180 + p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 26 smd rect (at 6.75 6.4 ${180 + p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 27 smd rect (at 6.75 5.3 ${180 + p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 28 smd rect (at 6.75 4.2 ${180 + p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 29 smd rect (at 6.75 3.1 ${180 + p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 30 smd rect (at 6.75 2 ${180 + p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 31 smd rect (at 6.75 0.9 ${180 + p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 32 smd rect (at 6.75 -0.2 ${180 + p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 33 smd rect (at 6.75 -1.3 ${180 + p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 34 smd rect (at 6.75 -2.4 ${180 + p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 35 smd rect (at 6.75 -3.5 ${180 + p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 36 smd rect (at 6.75 -4.6 ${180 + p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 37 smd rect (at 6.75 -5.7 ${180 + p.rot}) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask))
  (pad 38 thru_hole rect (at -4.25 -3.5 ${180 + p.rot}) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask))
  (pad 39 thru_hole rect (at -4.25 -2.4 ${180 + p.rot}) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask))
  (pad 40 thru_hole rect (at -4.25 -1.3 ${180 + p.rot}) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask))
  (pad 41 thru_hole rect (at -4.25 -0.2 ${180 + p.rot}) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask))
  (pad 42 thru_hole rect (at -4.25 0.9 ${180 + p.rot}) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask))
  (pad 43 thru_hole rect (at -4.25 2 ${180 + p.rot}) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask))
  (pad 44 thru_hole rect (at -4.25 3.1 ${180 + p.rot}) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask))
  (pad 45 thru_hole rect (at -4.25 4.2 ${180 + p.rot}) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask))
  (pad 46 thru_hole rect (at -4.25 5.3 ${180 + p.rot}) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask))
  (pad 47 thru_hole rect (at 4.25 -3.5 ${180 + p.rot}) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask))
  (pad 48 thru_hole rect (at 4.25 -2.4 ${180 + p.rot}) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask))
  (pad 49 thru_hole rect (at 4.25 -1.3 ${180 + p.rot}) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask))
  (pad 50 thru_hole rect (at 4.25 -0.2 ${180 + p.rot}) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask))
  (pad 51 thru_hole rect (at 4.25 0.9 ${180 + p.rot}) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask))
  (pad 52 thru_hole rect (at 4.25 2 ${180 + p.rot}) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask))
  (pad 53 thru_hole rect (at 4.25 3.1 ${180 + p.rot}) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask))
  (pad 54 thru_hole rect (at 4.25 4.2 ${180 + p.rot}) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask))
  (pad 55 thru_hole rect (at 4.25 5.3 ${180 + p.rot}) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask))
)
      `
}