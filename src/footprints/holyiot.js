// Holyiot 18010 nRF52840 module

module.exports = {
    nets: {
        GND: 'GND',
        P110: 'P110',
        P111: 'P111',
        P113: 'P113',
        P115: 'P115',
        P003: 'P003',
        P002: 'P002',
        P028: 'P028',
        P029: 'P029',
        P030: 'P030',
        P031: 'P031',
        P004: 'P004',
        P005: 'P005',
        VDD: 'VDD',
        P007: 'P007',
        P109: 'P109',
        P012: 'P012',
        P023: 'P023',
        P021: 'P021',
        P019: 'P019',
        P018: 'P018',
        VBUS: 'VBUS',
        PDMIN: 'PDMIN',
        DPLUS: 'DPLUS',
        P022: 'P022',
        P100: 'P100',
        P103: 'P103',
        P101: 'P101',
        P102: 'P102',
        SWDCLK: 'SWDCLK',
        SWDIO: 'SWDIO',
        P104: 'P104',
        P106: 'P106',
        P009: 'P009',
        P010: 'P010',
        P114: 'P114',
        P112: 'P112',
        P025: 'P025',
        P011: 'P011',
        P108: 'P108',
        P027: 'P027',
        P008: 'P008',
        P006: 'P006',
        P026: 'P026',
        P107: 'P107',
        P105: 'P105',
        P024: 'P024',
        P020: 'P020',
        P017: 'P017',
        P015: 'P015',
        P014: 'P014',
        P013: 'P013',
        P016: 'P016'
    },
    params: {
        class: 'MCU'
    },
    body: p => `
      ${ '' /* footprint reference */ }
(module nRF52840_holyiot_18010 (layer F.Cu) (tedit 600753CA)

${ p.at /* parametric position */ }

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
  (pad 1 smd rect (at -6.75 -5.7 ${ p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask)  ${ p.net.GND.str })
  (pad 2 smd rect (at -6.75 -4.6 ${ p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask)  ${ p.net.P110.str })
  (pad 3 smd rect (at -6.75 -3.5 ${ p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask)  ${ p.net.P111.str })
  (pad 4 smd rect (at -6.75 -2.4 ${ p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.P113.str })
  (pad 5 smd rect (at -6.75 -1.3 ${ p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.P115.str })
  (pad 6 smd rect (at -6.75 -0.2 ${ p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.P003.str })
  (pad 7 smd rect (at -6.75 0.9 ${ p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.P002.str })
  (pad 8 smd rect (at -6.75 2 ${ p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask)  ${ p.net.P028.str })
  (pad 9 smd rect (at -6.75 3.1 ${ p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.P029.str })
  (pad 10 smd rect (at -6.75 4.2 ${ p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.P030.str })
  (pad 11 smd rect (at -6.75 5.3 ${ p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.P031.str })
  (pad 12 smd rect (at -6.75 6.4 ${ p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.P004.str })
  (pad 13 smd rect (at -6.75 7.5 ${ p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.P005.str })
  (pad 14 smd rect (at -5.5 9 ${ 90 + p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.VDD.str })
  (pad 15 smd rect (at -4.4 9 ${ 90 + p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.P007.str })
  (pad 16 smd rect (at -3.3 9 ${ 90 + p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.P109.str })
  (pad 17 smd rect (at -2.2 9 ${ 90 + p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.P012.str })
  (pad 18 smd rect (at -1.1 9 ${ 90 + p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.P023.str })
  (pad 19 smd rect (at 0 9 ${ 90 + p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.P021.str })
  (pad 20 smd rect (at 1.1 9 ${ 90 + p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.P019.str })
  (pad 21 smd rect (at 2.2 9 ${ 90 + p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.P018.str })
  (pad 22 smd rect (at 3.3 9 ${ 90 + p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.VBUS.str })
  (pad 23 smd rect (at 4.4 9 ${ 90 + p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.PDMIN.str })
  (pad 24 smd rect (at 5.5 9 ${ 90 + p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.DPLUS.str })
  (pad 25 smd rect (at 6.75 7.5 ${ 180 + p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.GND.str })
  (pad 26 smd rect (at 6.75 6.4 ${ 180 + p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.P022.str })
  (pad 27 smd rect (at 6.75 5.3 ${ 180 + p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.P100.str })
  (pad 28 smd rect (at 6.75 4.2 ${ 180 + p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.P103.str })
  (pad 29 smd rect (at 6.75 3.1 ${ 180 + p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.P101.str })
  (pad 30 smd rect (at 6.75 2 ${ 180 + p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.P102.str })
  (pad 31 smd rect (at 6.75 0.9 ${ 180 + p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.SWDCLK.str })
  (pad 32 smd rect (at 6.75 -0.2 ${ 180 + p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.SWDIO.str })
  (pad 33 smd rect (at 6.75 -1.3 ${ 180 + p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.P104.str })
  (pad 34 smd rect (at 6.75 -2.4 ${ 180 + p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.P106.str })
  (pad 35 smd rect (at 6.75 -3.5 ${ 180 + p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.P009.str })
  (pad 36 smd rect (at 6.75 -4.6 ${ 180 + p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.P010.str })
  (pad 37 smd rect (at 6.75 -5.7 ${ 180 + p.rot }) (size 1.524 0.7) (layers F.Cu F.Paste F.Mask) ${ p.net.GND.str })
  (pad 38 thru_hole rect (at -4.25 -3.5 ${ 180 + p.rot }) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask) ${ p.net.P114.str })
  (pad 39 thru_hole rect (at -4.25 -2.4 ${ 180 + p.rot }) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask) ${ p.net.P112.str })
  (pad 40 thru_hole rect (at -4.25 -1.3 ${ 180 + p.rot }) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask) ${ p.net.P025.str })
  (pad 41 thru_hole rect (at -4.25 -0.2 ${ 180 + p.rot }) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask) ${ p.net.P011.str })
  (pad 42 thru_hole rect (at -4.25 0.9 ${ 180 + p.rot }) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask) ${ p.net.P108.str })
  (pad 43 thru_hole rect (at -4.25 2 ${ 180 + p.rot }) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask) ${ p.net.P027.str })
  (pad 44 thru_hole rect (at -4.25 3.1 ${ 180 + p.rot }) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask) ${ p.net.P008.str })
  (pad 45 thru_hole rect (at -4.25 4.2 ${ 180 + p.rot }) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask) ${ p.net.P006.str })
  (pad 46 thru_hole rect (at -4.25 5.3 ${ 180 + p.rot }) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask) ${ p.net.P026.str })
  (pad 47 thru_hole rect (at 4.25 -3.5 ${ 180 + p.rot }) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask) ${ p.net.P107.str })
  (pad 48 thru_hole rect (at 4.25 -2.4 ${ 180 + p.rot }) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask) ${ p.net.P105.str })
  (pad 49 thru_hole rect (at 4.25 -1.3 ${ 180 + p.rot }) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask) ${ p.net.P024.str })
  (pad 50 thru_hole rect (at 4.25 -0.2 ${ 180 + p.rot }) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask) ${ p.net.P020.str })
  (pad 51 thru_hole rect (at 4.25 0.9 ${ 180 + p.rot }) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask) ${ p.net.P017.str })
  (pad 52 thru_hole rect (at 4.25 2 ${ 180 + p.rot }) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask) ${ p.net.P015.str })
  (pad 53 thru_hole rect (at 4.25 3.1 ${ 180 + p.rot }) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask) ${ p.net.P014.str })
  (pad 54 thru_hole rect (at 4.25 4.2 ${ 180 + p.rot }) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask) ${ p.net.P013.str })
  (pad 55 thru_hole rect (at 4.25 5.3 ${ 180 + p.rot }) (size 1.524 0.7) (drill 0.4) (layers *.Cu *.Mask) ${ p.net.P016.str })
)
      `
}