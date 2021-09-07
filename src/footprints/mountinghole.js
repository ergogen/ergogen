// MountingHole_2.2mm_M2_Pad_Via
// TODO add more sizes as param?
module.exports = {
    nets: {
        net: undefined
    },
    params: {
        class: 'HOLE',
    },
    body: p => `
    (module "MountingHole_2.2mm_M2_Pad_Via" (version 20210722) (generator pcbnew) (layer "F.Cu")
      (tedit 56DDB9C7)
      ${p.at /* parametric position */} 
    
      (fp_text reference "${p.ref}" (at 0 -3.2) (layer "F.SilkS") ${p.ref_hide} 
        (effects (font (size 1 1) (thickness 0.15)))
        (tstamp b68bb25c-687d-44b1-b966-dad4cac66b35)
      )
    
      (fp_circle (center 0 0) (end 2.45 0) (layer "F.CrtYd") (width 0.05) (fill none) (tstamp b2688462-c375-45d3-9095-3425fb17c88f))
      (pad "1" thru_hole circle locked (at 1.166726 1.166726) (size 0.7 0.7) (drill 0.4) (layers *.Cu *.Mask) (tstamp 2a7fc905-328f-4bbb-9222-ca8d15d03a86))
      (pad "1" thru_hole circle locked (at 0 0) (size 4.4 4.4) (drill 2.2) (layers *.Cu *.Mask) (tstamp 47ee1d53-0551-4b6d-bc24-3f3f14c73c36))
      (pad "1" thru_hole circle locked (at 0 1.65) (size 0.7 0.7) (drill 0.4) (layers *.Cu *.Mask) (tstamp 4eef65bc-4add-40d7-8319-14dcdbae0d44))
      (pad "1" thru_hole circle locked (at 1.166726 -1.166726) (size 0.7 0.7) (drill 0.4) (layers *.Cu *.Mask) (tstamp 56155f4d-2ebc-4ad4-8d82-7aa7846deba8))
      (pad "1" thru_hole circle locked (at -1.65 0) (size 0.7 0.7) (drill 0.4) (layers *.Cu *.Mask) (tstamp 787d6162-1d3c-4def-859e-6532ce27c1ef))
      (pad "1" thru_hole circle locked (at -1.166726 -1.166726) (size 0.7 0.7) (drill 0.4) (layers *.Cu *.Mask) (tstamp 8d699d12-7099-4814-bbe6-11bc74c6e8b2))
      (pad "1" thru_hole circle locked (at -1.166726 1.166726) (size 0.7 0.7) (drill 0.4) (layers *.Cu *.Mask) (tstamp 95ab0420-a56b-46ee-98ad-5072a1a93a6f))
      (pad "1" thru_hole circle locked (at 1.65 0) (size 0.7 0.7) (drill 0.4) (layers *.Cu *.Mask) (tstamp cde0acf2-b3b4-46de-9f6e-3ab519744000))
      (pad "1" thru_hole circle locked (at 0 -1.65) (size 0.7 0.7) (drill 0.4) (layers *.Cu *.Mask) (tstamp ff0de415-ae11-46fb-b780-c24aee621212))
    )`
}