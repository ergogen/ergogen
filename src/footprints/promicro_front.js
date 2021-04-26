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

	(module ArduinoProMicro-TopSide (layer F.Cu) (tedit 591BD5DD)
	
	  ${p.at /* parametric position */}
	  (fp_text value "Arduino Pro Micro" (at 0 0) (layer F.SilkS) hide
		(effects (font (size 1.27 1.524) (thickness 0.2032)))
	  )
	  (fp_text user TX0 (at -13.9 4.6 90) (layer B.SilkS)
		(effects (font (size 1 1) (thickness 0.15)) (justify mirror))
	  )
	  (fp_text user RAW (at -13.9 -4.7 90) (layer B.SilkS)
		(effects (font (size 1 1) (thickness 0.15)) (justify mirror))
	  )
	  (fp_text user RAW (at -13.9 -4.6 90) (layer F.SilkS)
		(effects (font (size 1 1) (thickness 0.15)))
	  )
	  (fp_text user TX0 (at -13.9 4.5 90) (layer F.SilkS)
		(effects (font (size 1 1) (thickness 0.15)))
	  )
	  (fp_line (start -15.24 -8.89) (end -15.24 8.89) (layer F.SilkS) (width 0.381))
	  (fp_line (start -15.24 8.89) (end 15.24 8.89) (layer F.SilkS) (width 0.381))
	  (fp_line (start 15.24 8.89) (end 15.24 -8.89) (layer F.SilkS) (width 0.381))
	  (fp_line (start 15.24 -8.89) (end -15.24 -8.89) (layer F.SilkS) (width 0.381))
	  (fp_line (start -15.24 6.35) (end -12.7 6.35) (layer F.SilkS) (width 0.381))
	  (fp_line (start -12.7 6.35) (end -12.7 8.89) (layer F.SilkS) (width 0.381))
      (pad 1 thru_hole rect (at -13.97 -7.62 ${p.rot}) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.RAW})
      (pad 2 thru_hole circle (at -11.43 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.GND})
      (pad 3 thru_hole circle (at -8.89 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.RST})
      (pad 4 thru_hole circle (at -6.35 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.VCC})
      (pad 5 thru_hole circle (at -3.81 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P21})
      (pad 6 thru_hole circle (at -1.27 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P20})
      (pad 7 thru_hole circle (at 1.27 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P19})
      (pad 8 thru_hole circle (at 3.81 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P18})
      (pad 9 thru_hole circle (at 6.35 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P15})
      (pad 10 thru_hole circle (at 8.89 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P14})
      (pad 11 thru_hole circle (at 11.43 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P16})
      (pad 12 thru_hole circle (at 13.97 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P10})
      
      (pad 13 thru_hole circle (at -13.97 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P1})
      (pad 14 thru_hole circle (at -11.43 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P0})
      (pad 15 thru_hole circle (at -8.89 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.GND})
      (pad 16 thru_hole circle (at -6.35 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.GND})
      (pad 17 thru_hole circle (at -3.81 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P2})
      (pad 18 thru_hole circle (at -1.27 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P3})
      (pad 19 thru_hole circle (at 1.27 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P4})
      (pad 20 thru_hole circle (at 3.81 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P5})
      (pad 21 thru_hole circle (at 6.35 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P6})
      (pad 22 thru_hole circle (at 8.89 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P7})
      (pad 23 thru_hole circle (at 11.43 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P8})
      (pad 24 thru_hole circle (at 13.97 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P9})
    )
  `
}
