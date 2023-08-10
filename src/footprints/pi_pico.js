// Raspberry Pi Pico

function justify(p, normal) {
  const other = normal == "right" ? "left" : "right";
  let rot = p.rot % 360;
  if (rot >= 270) rot -= 360;
  if (rot <= -270) rot += 360;
  return rot <= -90 ? `(justify ${other})` : `(justify ${normal})`;
}

module.exports = {
    params: {
        designator: "MCU",
        ADC_VREF: { type: "net", value: "ADC_VREF" },
        AGND: { type: "net", value: "AGND" },
        GND: { type: "net", value: "GND" },
        P0: { type: "net", value: "GP0" },
        P1: { type: "net", value: "GP1" },
        P2: { type: "net", value: "GP2" },
        P3: { type: "net", value: "GP3" },
        P4: { type: "net", value: "GP4" },
        P5: { type: "net", value: "GP5" },
        P6: { type: "net", value: "GP6" },
        P7: { type: "net", value: "GP7" },
        P8: { type: "net", value: "GP8" },
        P9: { type: "net", value: "GP9" },
        P10: { type: "net", value: "GP10" },
        P11: { type: "net", value: "GP11" },
        P12: { type: "net", value: "GP12" },
        P13: { type: "net", value: "GP13" },
        P14: { type: "net", value: "GP14" },
        P15: { type: "net", value: "GP15" },
        P16: { type: "net", value: "GP16" },
        P17: { type: "net", value: "GP17" },
        P18: { type: "net", value: "GP18" },
        P19: { type: "net", value: "GP19" },
        P20: { type: "net", value: "GP20" },
        P21: { type: "net", value: "GP21" },
        P22: { type: "net", value: "GP22" },
        P26: { type: "net", value: "GP26" },
        P27: { type: "net", value: "GP27" },
        P28: { type: "net", value: "GP28" },
        RUN: { type: "net", value: "RUN" },
        SWCLK: { type: "net", value: "SWCLK" },
        SWDIO: { type: "net", value: "SWDIO" },
        V3: { type: "net", value: "3V3" },
        V3_EN: { type: "net", value: "3V3_EN" },
        VBUS: { type: "net", value: "VBUS" },
        VSYS: { type: "net", value: "VSYS" },
    },
    body: (p) => `
    (module "RPi_Pico_SMD_TH"
        ${p.at}
        (fp_text reference "${p.ref}" (at -2.54 0 ${ 90 + p.rot }) (layer "F.SilkS")
            ${p.ref_hide}
            (effects (font (size 1 1) (thickness 0.15))))
        ${'' /* pin names */ }
        (fp_text user "GND" (at 0 20.32 ${ 90 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user "GP12" (at -7.5 13.97 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "left") }))
        (fp_text user "GP13" (at -7.5 16.51 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "left") }))
        (fp_text user "GP2" (at -7.5 -16.51 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "left") }))
        (fp_text user "GP22" (at 7.5 3.81 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "right") }))
        (fp_text user "3V3" (at 7.5 -13.9 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "right") }))
        (fp_text user "GP1" (at -7.5 -21.6 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "left") }))
        (fp_text user "GP8" (at -7.5 1.27 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "left") }))
        (fp_text user "GND" (at 7.5 19.05 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "right") }))
        (fp_text user "GP10" (at -7.5 8.89 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "left") }))
        (fp_text user "GP26" (at 7.5 -1.27 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "right") }))
        (fp_text user "GP14" (at -7.5 21.59 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "left") }))
        (fp_text user "GP9" (at -7.5 3.81 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "left") }))
        (fp_text user "GND" (at -7.5 -6.35 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "left") }))
        (fp_text user "GP0" (at -7.5 -24.13 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "left") }))
        (fp_text user "AGND" (at 7.5 -6.35 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "right") }))
        (fp_text user "SWCLK" (at -2.54 20.32 ${ 90 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user "GP6" (at -7.5 -3.81 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "left") }))
        (fp_text user "GP28" (at 7.5 -9.144 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "right") }))
        (fp_text user "GP3" (at -7.5 -13.97 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "left") }))
        (fp_text user "GND" (at -7.5 19.05 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "left") }))
        (fp_text user "GND" (at -7.5 6.35 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "left") }))
        (fp_text user "SWDIO" (at 2.54 20.32 ${ 90 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user "GP16" (at 7.5 24.13 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "right") }))
        (fp_text user "VSYS" (at 7.5 -21.59 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "right") }))
        (fp_text user "GP15" (at -7.5 24.13 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "left") }))
        (fp_text user "3V3_EN" (at 7.5 -16.51 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "right") }))
        (fp_text user "RUN" (at 7.5 1.27 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "right") }))
        (fp_text user "GP7" (at -7.5 -1.3 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "left") }))
        (fp_text user "GP27" (at 7.5 -3.8 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "right") }))
        (fp_text user "VBUS" (at 7.5 -24.13 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "right") }))
        (fp_text user "GP4" (at -7.5 -11.43 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "left") }))
        (fp_text user "GP5" (at -7.5 -8.89 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "left") }))
        (fp_text user "GP21" (at 7.5 8.9 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "right") }))
        (fp_text user "GP18" (at 7.5 16.51 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "right") }))
        (fp_text user "GND" (at 7.5 -19.05 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "right") }))
        (fp_text user "GND" (at -7.5 -19.05 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "left") }))
        (fp_text user "GP11" (at -7.5 11.43 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "left") }))
        (fp_text user "ADC_VREF" (at 7.5 -11.43 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "right") }))
        (fp_text user "GND" (at 7.5 6.35 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "right") }))
        (fp_text user "GP17" (at 7.5 21.59 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "right") }))
        (fp_text user "GP20" (at 7.5 11.43 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "right") }))
        (fp_text user "GP19" (at 7.5 13.97 ${ 0 + p.rot }) (layer "F.SilkS")
            (effects (font (size 0.8 0.8) (thickness 0.15)) ${ justify(p, "right") }))
        ${'' /* component outline */ }
        (fp_line (start -11 -26) (end -11 26) (layer "F.SilkS") (width 0.15))
        (fp_line (start -11 -26) (end 11 -26) (layer "F.SilkS") (width 0.15))
        (fp_line (start 11 26) (end -11 26) (layer "F.SilkS") (width 0.15))
        (fp_line (start 11 26) (end 11 -26) (layer "F.SilkS") (width 0.15))
        ${'' /* USB through-holes */ }
        (pad "" np_thru_hole oval (at -2.725 -24 ${ 0 + p.rot }) (size 1.8 1.8) (drill 1.8) (layers "*.Cu" "*.Mask"))
        (pad "" np_thru_hole oval (at -2.425 -20.97 ${ 0 + p.rot }) (size 1.5 1.5) (drill 1.5) (layers "*.Cu" "*.Mask"))
        (pad "" np_thru_hole oval (at 2.425 -20.97 ${ 0 + p.rot }) (size 1.5 1.5) (drill 1.5) (layers "*.Cu" "*.Mask"))
        (pad "" np_thru_hole oval (at 2.725 -24 ${ 0 + p.rot }) (size 1.8 1.8) (drill 1.8) (layers "*.Cu" "*.Mask"))
        ${'' /* pads */ }
        (pad "1" thru_hole oval (at -8.89 -24.13 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "1" smd rect (at -8.89 -24.13 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset -0.9 0)) (layers "F.Cu" "F.Mask") ${p.P0.str})
        (pad "2" thru_hole oval (at -8.89 -21.59 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "2" smd rect (at -8.89 -21.59 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset -0.9 0)) (layers "F.Cu" "F.Mask") ${p.P1.str})
        (pad "3" thru_hole rect (at -8.89 -19.05 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "3" smd rect (at -8.89 -19.05 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset -0.9 0)) (layers "F.Cu" "F.Mask") ${p.GND.str})
        (pad "4" thru_hole oval (at -8.89 -16.51 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "4" smd rect (at -8.89 -16.51 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset -0.9 0)) (layers "F.Cu" "F.Mask") ${p.P2.str})
        (pad "5" thru_hole oval (at -8.89 -13.97 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "5" smd rect (at -8.89 -13.97 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset -0.9 0)) (layers "F.Cu" "F.Mask") ${p.P3.str})
        (pad "6" thru_hole oval (at -8.89 -11.43 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "6" smd rect (at -8.89 -11.43 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset -0.9 0)) (layers "F.Cu" "F.Mask") ${p.P4.str})
        (pad "7" thru_hole oval (at -8.89 -8.89 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "7" smd rect (at -8.89 -8.89 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset -0.9 0)) (layers "F.Cu" "F.Mask") ${p.P5.str})
        (pad "8" thru_hole rect (at -8.89 -6.35 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "8" smd rect (at -8.89 -6.35 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset -0.9 0)) (layers "F.Cu" "F.Mask") ${p.GND.str})
        (pad "9" thru_hole oval (at -8.89 -3.81 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "9" smd rect (at -8.89 -3.81 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset -0.9 0)) (layers "F.Cu" "F.Mask") ${p.P6.str})
        (pad "10" thru_hole oval (at -8.89 -1.27 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "10" smd rect (at -8.89 -1.27 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset -0.9 0)) (layers "F.Cu" "F.Mask") ${p.P7.str})
        (pad "11" thru_hole oval (at -8.89 1.27 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "11" smd rect (at -8.89 1.27 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset -0.9 0)) (layers "F.Cu" "F.Mask") ${p.P8.str})
        (pad "12" thru_hole oval (at -8.89 3.81 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "12" smd rect (at -8.89 3.81 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset -0.9 0)) (layers "F.Cu" "F.Mask") ${p.P9.str})
        (pad "13" thru_hole rect (at -8.89 6.35 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "13" smd rect (at -8.89 6.35 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset -0.9 0)) (layers "F.Cu" "F.Mask") ${p.GND.str})
        (pad "14" thru_hole oval (at -8.89 8.89 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "14" smd rect (at -8.89 8.89 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset -0.9 0)) (layers "F.Cu" "F.Mask") ${p.P10.str})
        (pad "15" thru_hole oval (at -8.89 11.43 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "15" smd rect (at -8.89 11.43 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset -0.9 0)) (layers "F.Cu" "F.Mask") ${p.P11.str})
        (pad "16" thru_hole oval (at -8.89 13.97 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "16" smd rect (at -8.89 13.97 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset -0.9 0)) (layers "F.Cu" "F.Mask") ${p.P12.str})
        (pad "17" thru_hole oval (at -8.89 16.51 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "17" smd rect (at -8.89 16.51 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset -0.9 0)) (layers "F.Cu" "F.Mask") ${p.P13.str})
        (pad "18" thru_hole rect (at -8.89 19.05 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "18" smd rect (at -8.89 19.05 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset -0.9 0)) (layers "F.Cu" "F.Mask") ${p.GND.str})
        (pad "19" thru_hole oval (at -8.89 21.59 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "19" smd rect (at -8.89 21.59 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset -0.9 0)) (layers "F.Cu" "F.Mask") ${p.P14.str})
        (pad "20" thru_hole oval (at -8.89 24.13 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "20" smd rect (at -8.89 24.13 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset -0.9 0)) (layers "F.Cu" "F.Mask") ${p.P15.str})
        (pad "21" thru_hole oval (at 8.89 24.13 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "21" smd rect (at 8.89 24.13 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset 0.9 0)) (layers "F.Cu" "F.Mask") ${p.P16.str})
        (pad "22" thru_hole oval (at 8.89 21.59 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "22" smd rect (at 8.89 21.59 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset 0.9 0)) (layers "F.Cu" "F.Mask") ${p.P17.str})
        (pad "23" thru_hole rect (at 8.89 19.05 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "23" smd rect (at 8.89 19.05 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset 0.9 0)) (layers "F.Cu" "F.Mask") ${p.GND.str})
        (pad "24" thru_hole oval (at 8.89 16.51 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "24" smd rect (at 8.89 16.51 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset 0.9 0)) (layers "F.Cu" "F.Mask") ${p.P18.str})
        (pad "25" thru_hole oval (at 8.89 13.97 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "25" smd rect (at 8.89 13.97 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset 0.9 0)) (layers "F.Cu" "F.Mask") ${p.P19.str})
        (pad "26" thru_hole oval (at 8.89 11.43 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "26" smd rect (at 8.89 11.43 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset 0.9 0)) (layers "F.Cu" "F.Mask") ${p.P20.str})
        (pad "27" thru_hole oval (at 8.89 8.89 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "27" smd rect (at 8.89 8.89 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset 0.9 0)) (layers "F.Cu" "F.Mask") ${p.P21.str})
        (pad "28" thru_hole rect (at 8.89 6.35 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "28" smd rect (at 8.89 6.35 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset 0.9 0)) (layers "F.Cu" "F.Mask") ${p.GND.str})
        (pad "29" thru_hole oval (at 8.89 3.81 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "29" smd rect (at 8.89 3.81 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset 0.9 0)) (layers "F.Cu" "F.Mask") ${p.P22.str})
        (pad "30" thru_hole oval (at 8.89 1.27 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "30" smd rect (at 8.89 1.27 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset 0.9 0)) (layers "F.Cu" "F.Mask") ${p.RUN.str})
        (pad "31" thru_hole oval (at 8.89 -1.27 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "31" smd rect (at 8.89 -1.27 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset 0.9 0)) (layers "F.Cu" "F.Mask") ${p.P26.str})
        (pad "32" thru_hole oval (at 8.89 -3.81 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "32" smd rect (at 8.89 -3.81 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset 0.9 0)) (layers "F.Cu" "F.Mask") ${p.P27.str})
        (pad "33" thru_hole rect (at 8.89 -6.35 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "33" smd rect (at 8.89 -6.35 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset 0.9 0)) (layers "F.Cu" "F.Mask") ${p.AGND.str})
        (pad "34" thru_hole oval (at 8.89 -8.89 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "34" smd rect (at 8.89 -8.89 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset 0.9 0)) (layers "F.Cu" "F.Mask") ${p.P28.str})
        (pad "35" thru_hole oval (at 8.89 -11.43 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "35" smd rect (at 8.89 -11.43 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset 0.9 0)) (layers "F.Cu" "F.Mask") ${p.ADC_VREF.str})
        (pad "36" thru_hole oval (at 8.89 -13.97 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "36" smd rect (at 8.89 -13.97 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset 0.9 0)) (layers "F.Cu" "F.Mask") ${p.V3.str})
        (pad "37" thru_hole oval (at 8.89 -16.51 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "37" smd rect (at 8.89 -16.51 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset 0.9 0)) (layers "F.Cu" "F.Mask") ${p.V3_EN.str})
        (pad "38" thru_hole rect (at 8.89 -19.05 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "38" smd rect (at 8.89 -19.05 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset 0.9 0)) (layers "F.Cu" "F.Mask") ${p.GND.str})
        (pad "39" thru_hole oval (at 8.89 -21.59 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "39" smd rect (at 8.89 -21.59 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset 0.9 0)) (layers "F.Cu" "F.Mask") ${p.VSYS.str})
        (pad "40" thru_hole oval (at 8.89 -24.13 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "40" smd rect (at 8.89 -24.13 ${ 0 + p.rot }) (size 3.5 1.7) (drill (offset 0.9 0)) (layers "F.Cu" "F.Mask") ${p.VBUS.str})
        (pad "41" thru_hole oval (at -2.54 23.9 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "41" smd rect (at -2.54 23.9 ${ 90 + p.rot }) (size 3.5 1.7) (drill (offset -0.9 0)) (layers "F.Cu" "F.Mask") ${p.SWCLK.str})
        (pad "42" thru_hole rect (at 0 23.9 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "42" smd rect (at 0 23.9 ${ 90 + p.rot }) (size 3.5 1.7) (drill (offset -0.9 0)) (layers "F.Cu" "F.Mask") ${p.GND.str})
        (pad "43" thru_hole oval (at 2.54 23.9 ${ 0 + p.rot }) (size 1.7 1.7) (drill 1.02) (layers "*.Cu" "*.Mask"))
        (pad "43" smd rect (at 2.54 23.9 ${ 90 + p.rot }) (size 3.5 1.7) (drill (offset -0.9 0)) (layers "F.Cu" "F.Mask") ${p.SWDIO.str})
    )`,
};
