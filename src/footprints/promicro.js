module.exports = {
  static_nets: [
    'RAW', 'GND', 'RST', 'VCC',
    'P21', 'P20', 'P19', 'P18',
    'P15', 'P14', 'P16', 'P10',
    'P1', 'P0', 'P2', 'P3', 'P4',
    'P5', 'P6', 'P7', 'P8', 'P9'
  ],
  params: {
    class: 'C' // for Controller
  },
  body: p => `
  
    (module ProMicro (layer F.Cu) (tedit 5B307E4C)
    
      ${p.at /* parametric position */}

      ${'' /* footprint reference */}
      (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) (effects (font (size 1.27 1.27) (thickness 0.15))))
      (fp_text value "" (at 0 0) (layer F.SilkS) (effects (font (size 1.27 1.27) (thickness 0.15))))
    
      ${''/* illustration of the (possible) USB port overhang */}
      (fp_line (start -19.304 -3.556) (end -14.224 -3.556) (layer Dwgs.User) (width 0.15))
      (fp_line (start -19.304 3.81) (end -19.304 -3.556) (layer Dwgs.User) (width 0.15))
      (fp_line (start -14.224 3.81) (end -19.304 3.81) (layer Dwgs.User) (width 0.15))
      (fp_line (start -14.224 -3.556) (end -14.224 3.81) (layer Dwgs.User) (width 0.15))
    
      ${''/* component outline */}
      (fp_line (start -17.78 8.89) (end 15.24 8.89) (layer F.SilkS) (width 0.15))
      (fp_line (start 15.24 8.89) (end 15.24 -8.89) (layer F.SilkS) (width 0.15))
      (fp_line (start 15.24 -8.89) (end -17.78 -8.89) (layer F.SilkS) (width 0.15))
      (fp_line (start -17.78 -8.89) (end -17.78 8.89) (layer F.SilkS) (width 0.15))
      
      ${''/* extra border around "RAW", in case the rectangular shape is not distinctive enough */}
      (fp_line (start -15.24 6.35) (end -12.7 6.35) (layer F.SilkS) (width 0.15))
      (fp_line (start -15.24 6.35) (end -15.24 8.89) (layer F.SilkS) (width 0.15))
      (fp_line (start -12.7 6.35) (end -12.7 8.89) (layer F.SilkS) (width 0.15))
    
      ${''/* pin names */}
      (fp_text user RAW (at -13.97 4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user GND (at -11.43 4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user RST (at -8.89 4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user VCC (at -6.35 4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P21 (at -3.81 4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P20 (at -1.27 4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P19 (at 1.27 4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P18 (at 3.81 4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P15 (at 6.35 4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P14 (at 8.89 4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P16 (at 11.43 4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P10 (at 13.97 4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
    
      (fp_text user P01 (at -13.97 -4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P00 (at -11.43 -4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user GND (at -8.89 -4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user GND (at -6.35 -4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P02 (at -3.81 -4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P03 (at -1.27 -4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P04 (at 1.27 -4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P05 (at 3.81 -4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P06 (at 6.35 -4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P07 (at 8.89 -4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P08 (at 11.43 -4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P09 (at 13.97 -4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
    
      ${''/* and now the actual pins */}
      (pad 1 thru_hole rect (at -13.97 7.62 ${p.rot}) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.RAW})
      (pad 2 thru_hole circle (at -11.43 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.GND})
      (pad 3 thru_hole circle (at -8.89 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.RST})
      (pad 4 thru_hole circle (at -6.35 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.VCC})
      (pad 5 thru_hole circle (at -3.81 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P21})
      (pad 6 thru_hole circle (at -1.27 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P20})
      (pad 7 thru_hole circle (at 1.27 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P19})
      (pad 8 thru_hole circle (at 3.81 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P18})
      (pad 9 thru_hole circle (at 6.35 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P15})
      (pad 10 thru_hole circle (at 8.89 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P14})
      (pad 11 thru_hole circle (at 11.43 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P16})
      (pad 12 thru_hole circle (at 13.97 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P10})
      
      (pad 13 thru_hole circle (at -13.97 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P1})
      (pad 14 thru_hole circle (at -11.43 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P0})
      (pad 15 thru_hole circle (at -8.89 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.GND})
      (pad 16 thru_hole circle (at -6.35 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.GND})
      (pad 17 thru_hole circle (at -3.81 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P2})
      (pad 18 thru_hole circle (at -1.27 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P3})
      (pad 19 thru_hole circle (at 1.27 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P4})
      (pad 20 thru_hole circle (at 3.81 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P5})
      (pad 21 thru_hole circle (at 6.35 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P6})
      (pad 22 thru_hole circle (at 8.89 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P7})
      (pad 23 thru_hole circle (at 11.43 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P8})
      (pad 24 thru_hole circle (at 13.97 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P9})
    )
  `
}
