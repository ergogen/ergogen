module.exports = {
  nets: [
    'RAW', 'GND', 'RST', 'VCC',
    'P21', 'P20', 'P19', 'P18',
    'P15', 'P14', 'P16', 'P10',
    'P1', 'P0', 'P2', 'P3', 'P4',
    'P5', 'P6', 'P7', 'P8', 'P9'
  ],
  body: `
  
    (module ProMicro (layer F.Cu) (tedit 5B307E4C)
    
      ${''/* parametric position */}
      __AT
    
      ${''/* illustration of the USB port overhang */}
      (fp_line (start -19.304 -3.556) (end -14.224 -3.556) (layer Dwgs.User) (width 0.2))
      (fp_line (start -19.304 3.81) (end -19.304 -3.556) (layer Dwgs.User) (width 0.2))
      (fp_line (start -14.224 3.81) (end -19.304 3.81) (layer Dwgs.User) (width 0.2))
      (fp_line (start -14.224 -3.556) (end -14.224 3.81) (layer Dwgs.User) (width 0.2))
    
      ${''/* component outline */}
      (fp_line (start -17.78 8.89) (end 15.24 8.89) (layer F.SilkS) (width 0.381))
      (fp_line (start 15.24 8.89) (end 15.24 -8.89) (layer F.SilkS) (width 0.381))
      (fp_line (start 15.24 -8.89) (end -17.78 -8.89) (layer F.SilkS) (width 0.381))
      (fp_line (start -17.78 -8.89) (end -17.78 8.89) (layer F.SilkS) (width 0.381))
      
      ${''/* extra border around "RAW", in case the rectangular shape is not distinctive enough */}
      (fp_line (start -15.24 6.35) (end -12.7 6.35) (layer F.SilkS) (width 0.381))
      (fp_line (start -15.24 6.35) (end -15.24 8.89) (layer F.SilkS) (width 0.381))
      (fp_line (start -12.7 6.35) (end -12.7 8.89) (layer F.SilkS) (width 0.381))
    
      ${''/* pin names */}
      (fp_text user RAW (at -13.97 5.0) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user GND (at -11.43 5.0) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user RST (at -8.89 5.0) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user VCC (at -6.35 5.0) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user 21 (at -3.81 5.461) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user 20 (at -1.27 5.461) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user 19 (at 1.27 5.461) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user 18 (at 3.81 5.461) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user 15 (at 6.35 5.461) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user 14 (at 8.89 5.461) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user 16 (at 11.43 5.461) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user 10 (at 13.97 5.461) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
    
      (fp_text user 1 (at -13.97 -5.461) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user 0 (at -11.43 -5.461) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user GND (at -8.89 -5.0) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user GND (at -6.35 -5.0) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user 2 (at -3.81 -5.461) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user 3 (at -1.27 -5.461) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user 4 (at 1.27 -5.461) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user 5 (at 3.81 -5.461) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user 6 (at 6.35 -5.461) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user 7 (at 8.89 -5.461) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user 8 (at 11.43 -5.461) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user 9 (at 13.97 -5.461) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
    
      ${''/* and now the actual pins */}
      (pad 1 thru_hole rect (at -13.97 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) __NET_RAW)
      (pad 2 thru_hole circle (at -11.43 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) __NET_GND)
      (pad 3 thru_hole circle (at -8.89 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) __NET_RST)
      (pad 4 thru_hole circle (at -6.35 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) __NET_VCC)
      (pad 5 thru_hole circle (at -3.81 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) __NET_P21)
      (pad 6 thru_hole circle (at -1.27 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) __NET_P20)
      (pad 7 thru_hole circle (at 1.27 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) __NET_P19)
      (pad 8 thru_hole circle (at 3.81 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) __NET_P18)
      (pad 9 thru_hole circle (at 6.35 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) __NET_P15)
      (pad 10 thru_hole circle (at 8.89 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) __NET_P14)
      (pad 11 thru_hole circle (at 11.43 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) __NET_P16)
      (pad 12 thru_hole circle (at 13.97 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) __NET_P10)
      
      (pad 13 thru_hole circle (at -13.97 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) __NET_P1)
      (pad 14 thru_hole circle (at -11.43 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) __NET_P0)
      (pad 15 thru_hole circle (at -8.89 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) __NET_GND)
      (pad 16 thru_hole circle (at -6.35 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) __NET_GND)
      (pad 17 thru_hole circle (at -3.81 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) __NET_P2)
      (pad 18 thru_hole circle (at -1.27 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) __NET_P3)
      (pad 19 thru_hole circle (at 1.27 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) __NET_P4)
      (pad 20 thru_hole circle (at 3.81 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) __NET_P5)
      (pad 21 thru_hole circle (at 6.35 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) __NET_P6)
      (pad 22 thru_hole circle (at 8.89 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) __NET_P7)
      (pad 23 thru_hole circle (at 11.43 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) __NET_P8)
      (pad 24 thru_hole circle (at 13.97 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) __NET_P9)
    )
  `
}
