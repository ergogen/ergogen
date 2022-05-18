const promicro = require('../../src/footprints/promicro')

const normalize = str => str.split('\n').map(x => x.trim()).filter(x => x.length).join('\n')
const mapValues = (obj, f) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, f(v)]))

describe('promicro', function() {
  it('nets', function() {
    promicro.nets.should.be.deep.equal({
      GND: 'GND',
      RAW: 'RAW',
      RST: 'RST',
      VCC: 'VCC',
      P0: 'P0',
      P1: 'P1',
      P2: 'P2',
      P3: 'P3',
      P4: 'P4',
      P5: 'P5',
      P6: 'P6',
      P7: 'P7',
      P8: 'P8',
      P9: 'P9',
      P10: 'P10',
      P14: 'P14',
      P15: 'P15',
      P16: 'P16',
      P18: 'P18',
      P19: 'P19',
      P20: 'P20',
      P21: 'P21',
    })
  })

  describe('body', () => {
    it('orientation: down', function() {
      let n = 1
      let net = mapValues(promicro.nets, v => { return { str: `(net ${n++} ${v})` } })
      normalize(promicro.body({
        param: {
          orientation: 'down',
        },
        at: '(66.1416 36.8808)',
        rot: 45,
        ref: 'C1',
        ref_hide: 'hide',
        net,
      })).should.equal(normalize(`
        (module ProMicro (layer F.Cu) (tedit 5B307E4C)
        (66.1416 36.8808)

        (fp_text reference "C1" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))
        (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))

        (fp_line (start -19.304 -3.81) (end -14.224 -3.81) (layer Dwgs.User) (width 0.15))
        (fp_line (start -19.304 3.81) (end -19.304 -3.81) (layer Dwgs.User) (width 0.15))
        (fp_line (start -14.224 3.81) (end -19.304 3.81) (layer Dwgs.User) (width 0.15))
        (fp_line (start -14.224 -3.81) (end -14.224 3.81) (layer Dwgs.User) (width 0.15))

        (fp_line (start -17.78 8.89) (end 15.24 8.89) (layer F.SilkS) (width 0.15))
        (fp_line (start 15.24 8.89) (end 15.24 -8.89) (layer F.SilkS) (width 0.15))
        (fp_line (start 15.24 -8.89) (end -17.78 -8.89) (layer F.SilkS) (width 0.15))
        (fp_line (start -17.78 -8.89) (end -17.78 8.89) (layer F.SilkS) (width 0.15))

        (fp_line (start -15.24 6.35) (end -12.70 6.35) (layer F.SilkS) (width 0.15))
        (fp_line (start -15.24 6.35) (end -15.24 8.89) (layer F.SilkS) (width 0.15))
        (fp_line (start -12.70 6.35) (end -12.70 8.89) (layer F.SilkS) (width 0.15))

        (fp_text user RAW (at -13.97 4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user GND (at -11.43 4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user RST (at -8.89 4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user VCC (at -6.35 4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P21 (at -3.81 4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P20 (at -1.27 4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P19 (at 1.27 4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P18 (at 3.81 4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P15 (at 6.35 4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P14 (at 8.89 4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P16 (at 11.43 4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P10 (at 13.97 4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))

        (fp_text user P01 (at -13.97 -4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P00 (at -11.43 -4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user GND (at -8.89 -4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user GND (at -6.35 -4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P02 (at -3.81 -4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P03 (at -1.27 -4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P04 (at 1.27 -4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P05 (at 3.81 -4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P06 (at 6.35 -4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P07 (at 8.89 -4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P08 (at 11.43 -4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P09 (at 13.97 -4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))

        (pad 1 thru_hole rect (at -13.97 7.62 45) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 1 RAW))
        (pad 2 thru_hole circle (at -11.43 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 2 GND))
        (pad 3 thru_hole circle (at -8.89 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 3 RST))
        (pad 4 thru_hole circle (at -6.35 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 4 VCC))
        (pad 5 thru_hole circle (at -3.81 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 5 P21))
        (pad 6 thru_hole circle (at -1.27 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 6 P20))
        (pad 7 thru_hole circle (at 1.27 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 7 P19))
        (pad 8 thru_hole circle (at 3.81 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 8 P18))
        (pad 9 thru_hole circle (at 6.35 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 9 P15))
        (pad 10 thru_hole circle (at 8.89 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 10 P14))
        (pad 11 thru_hole circle (at 11.43 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 11 P16))
        (pad 12 thru_hole circle (at 13.97 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 12 P10))

        (pad 13 thru_hole circle (at -13.97 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 13 P1))
        (pad 14 thru_hole circle (at -11.43 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 14 P0))
        (pad 15 thru_hole circle (at -8.89 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 2 GND))
        (pad 16 thru_hole circle (at -6.35 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 2 GND))
        (pad 17 thru_hole circle (at -3.81 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 15 P2))
        (pad 18 thru_hole circle (at -1.27 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 16 P3))
        (pad 19 thru_hole circle (at 1.27 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 17 P4))
        (pad 20 thru_hole circle (at 3.81 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 18 P5))
        (pad 21 thru_hole circle (at 6.35 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 19 P6))
        (pad 22 thru_hole circle (at 8.89 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 20 P7))
        (pad 23 thru_hole circle (at 11.43 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 21 P8))
        (pad 24 thru_hole circle (at 13.97 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 22 P9))
        )`
      ))
    })
    it('orientation: up', function() {
      let n = 1
      let net = mapValues(promicro.nets, v => { return { str: `(net ${n++} ${v})` } })
      normalize(promicro.body({
        param: {
          orientation: 'up',
        },
        at: '(66.1416 36.8808)',
        rot: 45,
        ref: 'C1',
        ref_hide: 'hide',
        net,
      })).should.equal(normalize(`
        (module ProMicro (layer F.Cu) (tedit 5B307E4C)
        (66.1416 36.8808)

        (fp_text reference "C1" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))
        (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))

        (fp_line (start -19.304 -3.81) (end -14.224 -3.81) (layer Dwgs.User) (width 0.15))
        (fp_line (start -19.304 3.81) (end -19.304 -3.81) (layer Dwgs.User) (width 0.15))
        (fp_line (start -14.224 3.81) (end -19.304 3.81) (layer Dwgs.User) (width 0.15))
        (fp_line (start -14.224 -3.81) (end -14.224 3.81) (layer Dwgs.User) (width 0.15))

        (fp_line (start -17.78 8.89) (end 15.24 8.89) (layer F.SilkS) (width 0.15))
        (fp_line (start 15.24 8.89) (end 15.24 -8.89) (layer F.SilkS) (width 0.15))
        (fp_line (start 15.24 -8.89) (end -17.78 -8.89) (layer F.SilkS) (width 0.15))
        (fp_line (start -17.78 -8.89) (end -17.78 8.89) (layer F.SilkS) (width 0.15))

        (fp_line (start -15.24 -6.35) (end -12.70 -6.35) (layer F.SilkS) (width 0.15))
        (fp_line (start -15.24 -6.35) (end -15.24 -8.89) (layer F.SilkS) (width 0.15))
        (fp_line (start -12.70 -6.35) (end -12.70 -8.89) (layer F.SilkS) (width 0.15))

        (fp_text user RAW (at -13.97 -4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user GND (at -11.43 -4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user RST (at -8.89 -4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user VCC (at -6.35 -4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P21 (at -3.81 -4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P20 (at -1.27 -4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P19 (at 1.27 -4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P18 (at 3.81 -4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P15 (at 6.35 -4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P14 (at 8.89 -4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P16 (at 11.43 -4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P10 (at 13.97 -4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))

        (fp_text user P01 (at -13.97 4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P00 (at -11.43 4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user GND (at -8.89 4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user GND (at -6.35 4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P02 (at -3.81 4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P03 (at -1.27 4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P04 (at 1.27 4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P05 (at 3.81 4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P06 (at 6.35 4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P07 (at 8.89 4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P08 (at 11.43 4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        (fp_text user P09 (at 13.97 4.80 135) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))

        (pad 1 thru_hole rect (at -13.97 -7.62 45) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 1 RAW))
        (pad 2 thru_hole circle (at -11.43 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 2 GND))
        (pad 3 thru_hole circle (at -8.89 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 3 RST))
        (pad 4 thru_hole circle (at -6.35 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 4 VCC))
        (pad 5 thru_hole circle (at -3.81 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 5 P21))
        (pad 6 thru_hole circle (at -1.27 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 6 P20))
        (pad 7 thru_hole circle (at 1.27 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 7 P19))
        (pad 8 thru_hole circle (at 3.81 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 8 P18))
        (pad 9 thru_hole circle (at 6.35 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 9 P15))
        (pad 10 thru_hole circle (at 8.89 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 10 P14))
        (pad 11 thru_hole circle (at 11.43 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 11 P16))
        (pad 12 thru_hole circle (at 13.97 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 12 P10))

        (pad 13 thru_hole circle (at -13.97 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 13 P1))
        (pad 14 thru_hole circle (at -11.43 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 14 P0))
        (pad 15 thru_hole circle (at -8.89 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 2 GND))
        (pad 16 thru_hole circle (at -6.35 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 2 GND))
        (pad 17 thru_hole circle (at -3.81 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 15 P2))
        (pad 18 thru_hole circle (at -1.27 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 16 P3))
        (pad 19 thru_hole circle (at 1.27 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 17 P4))
        (pad 20 thru_hole circle (at 3.81 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 18 P5))
        (pad 21 thru_hole circle (at 6.35 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 19 P6))
        (pad 22 thru_hole circle (at 8.89 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 20 P7))
        (pad 23 thru_hole circle (at 11.43 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 21 P8))
        (pad 24 thru_hole circle (at 13.97 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) (net 22 P9))
        )`
      ))
    })
  })
})
