module.exports = {
  params: {
    designator: "OLED",
    side: "F",
    SDA: undefined,
    SCL: undefined,
    VCC: undefined,
    GND: undefined,
  },
  body: (p) => {
    const side = p.side;
    const reverseSide = side === "F" ? "B" : "F";
    return `
(module OLED-128x32-double-sided (layer F.Cu) (tedit 61D90230)
  (attr through_hole exclude_from_pos_files)

  ${p.at /* parametric position */}

  ${"" /* footprint reference */}
  (fp_text reference "${p.ref}" (at 3 6 ${p.rot}) (layer "F.SilkS") ${
      p.ref_hide
    }
    (effects (font (size 1 1) (thickness 0.15)))
    (tstamp 699b9319-ecb2-4925-b120-e35c0e4885b6)
  )
  (fp_text value "OLED-double-sided" (at 6.553 -0.614 ${p.rot}) (layer "F.Fab")
    (effects (font (size 1 1) (thickness 0.15)))
    (tstamp 94b04c0b-709c-4851-adcb-54c8bd9b1fbc)
  )
  (fp_text user "D" (at -0.559 2.18 unlocked) (layer "F.Fab")
    (effects (font (size 1 1) (thickness 0.15)))
    (tstamp 014269b9-c8e9-4d69-9fca-a0258f002e62)
  )
  (fp_text user "V" (at -0.559 7.26 unlocked) (layer "F.Fab")
    (effects (font (size 1 1) (thickness 0.15)))
    (tstamp 78c6c1c1-4e33-4c9a-9c31-7290a6bb66e8)
  )
  (fp_text user "C" (at -0.559 4.72 unlocked) (layer "F.Fab")
    (effects (font (size 1 1) (thickness 0.15)))
    (tstamp cc4612a7-e476-4eb8-a72a-0a9ad2894a65)
  )
  (fp_text user "G" (at -0.559 9.8 unlocked) (layer "F.Fab")
    (effects (font (size 1 1) (thickness 0.15)))
    (tstamp d25deb3e-bd1b-4300-a14e-83e9d02866dc)
  )
  (fp_line (start 29.44 7.74) (end 29.44 2.22) (layer "Dwgs.User") (width 0.12) (tstamp 03cd96c4-4ac4-4a49-be5f-b4d9db3b093e))
  (fp_line (start 0 0) (end 0 12) (layer "Dwgs.User") (width 0.12) (tstamp 182c81f8-3aa6-4c30-b276-61b4e190756b))
  (fp_line (start 7.06 7.74) (end 29.44 7.74) (layer "Dwgs.User") (width 0.12) (tstamp 23a5f698-1088-4404-a279-3eb8d98b91cf))
  (fp_line (start 7.06 2.22) (end 29.44 2.22) (layer "Dwgs.User") (width 0.12) (tstamp 34483ed0-cd79-4333-8c78-a6ffded299d0))
  (fp_line (start 38 0) (end 38 12) (layer "Dwgs.User") (width 0.12) (tstamp 834553dc-80e6-4f0e-866e-42f3ca7d3c59))
  (fp_line (start 0 0) (end 38 0) (layer "Dwgs.User") (width 0.12) (tstamp 9501d189-a63c-4406-8ba4-797a6d322707))
  (fp_line (start 35.75 0) (end 35.75 12) (layer "Dwgs.User") (width 0.12) (tstamp a85f0c17-df41-4422-84ab-5061adf205de))
  (fp_line (start 7.06 2.22) (end 7.06 7.74) (layer "Dwgs.User") (width 0.12) (tstamp ba4a0e9c-c7a0-45ad-b486-86ec7d23aa13))
  (fp_line (start 5.75 0) (end 5.75 12) (layer "Dwgs.User") (width 0.12) (tstamp d874bd96-fe66-4ad2-84cf-5e14c7544c3c))
  (fp_line (start 38 12) (end 0 12) (layer "Dwgs.User") (width 0.12) (tstamp fc8186e3-3a01-462b-bdc4-5838f0f73429))
  (pad "1" smd custom (at 3.251 9.8 ${
    p.rot
  }) (size 1 0.7) (layers "${side}.Cu" "${side}.Mask")
    (zone_connect 2)
    (options (clearance outline) (anchor rect))
    (primitives
      (gr_circle (center 0 0.35) (end 0.5 0.35) (width 0) (fill yes))
      (gr_circle (center 0 -0.35) (end 0.5 -0.35) (width 0) (fill yes))
      (gr_poly (pts
          (xy 0 0.85)
          (xy -0.5 0.85)
          (xy -0.5 -0.85)
          (xy 0 -0.85)
        ) (width 0) (fill yes))
    ) ${p.SDA.str} (tstamp 453f4a68-122d-44bf-a828-c5d1029a227d))
  (pad "1" smd custom (at 3.251 2.18  ${
    p.rot + 180
  }) (size 1 0.7) (layers "${reverseSide}.Cu" "${reverseSide}.Mask")
    (zone_connect 2)
    (options (clearance outline) (anchor rect))
    (primitives
      (gr_circle (center 0 0.35) (end 0.5 0.35) (width 0) (fill yes))
      (gr_circle (center 0 -0.35) (end 0.5 -0.35) (width 0) (fill yes))
      (gr_poly (pts
          (xy 0.5 0.85)
          (xy 0 0.85)
          (xy 0 -0.85)
          (xy 0.5 -0.85)
        ) (width 0) (fill yes))
    ) ${p.SDA.str} (tstamp 7efbe668-94c3-40dc-89c1-c2ef37a7844a))
  (pad "2" smd custom (at 3.251 7.26 ${
    p.rot
  }) (size 1 0.7) (layers "${side}.Cu" "${side}.Mask")
    (zone_connect 2)
    (options (clearance outline) (anchor rect))
    (primitives
      (gr_circle (center 0 0.35) (end 0.5 0.35) (width 0) (fill yes))
      (gr_circle (center 0 -0.35) (end 0.5 -0.35) (width 0) (fill yes))
      (gr_poly (pts
          (xy 0 0.85)
          (xy -0.5 0.85)
          (xy -0.5 -0.85)
          (xy 0 -0.85)
        ) (width 0) (fill yes))
    ) ${p.SCL.str} (tstamp 3bbd7815-8ad7-4d72-92c3-96826a0c302c))
  (pad "2" smd custom (at 3.251 4.72 ${
    p.rot + 180
  }) (size 1 0.7) (layers "${reverseSide}.Cu" "${reverseSide}.Mask")
    (zone_connect 2)
    (options (clearance outline) (anchor rect))
    (primitives
      (gr_circle (center 0 0.35) (end 0.5 0.35) (width 0) (fill yes))
      (gr_circle (center 0 -0.35) (end 0.5 -0.35) (width 0) (fill yes))
      (gr_poly (pts
          (xy 0.5 0.85)
          (xy 0 0.85)
          (xy 0 -0.85)
          (xy 0.5 -0.85)
        ) (width 0) (fill yes))
    ) ${p.SCL.str} (tstamp be8e71c5-6a5d-4355-890f-ba576fc74f3e))
  (pad "3" smd custom (at 3.251 7.26 ${
    p.rot + 180
  }) (size 1 0.7) (layers "${reverseSide}.Cu" "${reverseSide}.Mask")
    (zone_connect 2)
    (options (clearance outline) (anchor rect))
    (primitives
      (gr_circle (center 0 0.35) (end 0.5 0.35) (width 0) (fill yes))
      (gr_circle (center 0 -0.35) (end 0.5 -0.35) (width 0) (fill yes))
      (gr_poly (pts
          (xy 0.5 0.85)
          (xy 0 0.85)
          (xy 0 -0.85)
          (xy 0.5 -0.85)
        ) (width 0) (fill yes))
    ) ${p.VCC.str} (tstamp 32749c0b-3f32-4b9e-b6b7-926362372b0b))
  (pad "3" smd custom (at 3.251 4.72 ${
    p.rot
  }) (size 1 0.7) (layers "${side}.Cu" "${side}.Mask")
    (zone_connect 2)
    (options (clearance outline) (anchor rect))
    (primitives
      (gr_circle (center 0 0.35) (end 0.5 0.35) (width 0) (fill yes))
      (gr_circle (center 0 -0.35) (end 0.5 -0.35) (width 0) (fill yes))
      (gr_poly (pts
          (xy 0 0.85)
          (xy -0.5 0.85)
          (xy -0.5 -0.85)
          (xy 0 -0.85)
        ) (width 0) (fill yes))
    ) ${p.VCC.str} (tstamp bbf3ffa2-6e2a-4d77-b6ab-83f8717260ae))
  (pad "4" smd custom (at 3.251 2.18 ${
    p.rot
  }) (size 1 0.7) (layers "${side}.Cu" "${side}.Mask")
    (zone_connect 2)
    (options (clearance outline) (anchor rect))
    (primitives
      (gr_circle (center 0 0.35) (end 0.5 0.35) (width 0) (fill yes))
      (gr_circle (center 0 -0.35) (end 0.5 -0.35) (width 0) (fill yes))
      (gr_poly (pts
          (xy 0 0.85)
          (xy -0.5 0.85)
          (xy -0.5 -0.85)
          (xy 0 -0.85)
        ) (width 0) (fill yes))
    ) ${p.GND.str} (tstamp 3826d188-92e9-43ce-adfa-6e69d777dc8d))
  (pad "4" smd custom (at 3.251 9.8 ${
    p.rot + 180
  }) (size 1 0.7) (layers "${reverseSide}.Cu" "${reverseSide}.Mask")
    (zone_connect 2)
    (options (clearance outline) (anchor rect))
    (primitives
      (gr_circle (center 0 0.35) (end 0.5 0.35) (width 0) (fill yes))
      (gr_circle (center 0 -0.35) (end 0.5 -0.35) (width 0) (fill yes))
      (gr_poly (pts
          (xy 0.5 0.85)
          (xy 0 0.85)
          (xy 0 -0.85)
          (xy 0.5 -0.85)
        ) (width 0) (fill yes))
    ) ${p.GND.str} (tstamp aa0b421a-7030-40e4-a89c-403b61ce0783))
  (pad "5" thru_hole rect (at 1.6 9.8 ${
    p.rot + 180
  }) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) (tstamp f95a62fe-372a-4ed7-bc60-48b69f9f1239))
  (pad "6" thru_hole roundrect (at 1.6 7.26 ${
    p.rot + 180
  }) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) (roundrect_rratio 0.5)
    (chamfer_ratio 0) (chamfer top_left bottom_left) (tstamp 66e4456b-f327-4cac-8bc2-95a1dba3d84c))
  (pad "7" thru_hole roundrect (at 1.6 4.72 ${
    p.rot + 180
  }) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) (roundrect_rratio 0.5)
    (chamfer_ratio 0) (chamfer top_left bottom_left) (tstamp db1bc6ad-27ca-48cd-85e5-ce0970823817))
  (pad "8" thru_hole roundrect (at 1.6 2.18 ${
    p.rot + 180
  }) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) (roundrect_rratio 0.5)
    (chamfer_ratio 0) (chamfer top_left bottom_left) (tstamp 71f03194-0fff-4226-9b3c-f18abc0fcf3c))
)
`;
/*
(footprint "MountingHole:MountingHole_2.2mm_M2_DIN965_Pad" (layer "F.Cu")
    (tedit 56D1B4CB) (tstamp 0fef5383-a446-41c8-8c18-9f022c3b3404)
    (at 106.5 -2.6)
    (descr "Mounting Hole 2.2mm, M2, DIN965")
    (tags "mounting hole 2.2mm m2 din965")
    (attr exclude_from_pos_files exclude_from_bom)
    (fp_text reference "Mount1" (at 0 -2.9) (layer "Cmts.User")
      (effects (font (size 1 1) (thickness 0.15)))
      (tstamp 8fb1f124-dcc3-476d-8811-7912e25ca591)
    )
    (fp_text value "TH1" (at 0 2.9) (layer "F.Fab")
      (effects (font (size 1 1) (thickness 0.15)))
      (tstamp a8bff58e-6f5a-4872-8a38-6aa03e8f2249)
    )
    (fp_circle (center 0 0) (end 1.9 0) (layer "Cmts.User") (width 0.15) (fill none) (tstamp 89373f03-1a93-4f85-bdcc-3678214566c9))
    (fp_circle (center 0 0) (end 2.15 0) (layer "F.CrtYd") (width 0.05) (fill none) (tstamp 173b6643-7a13-4cb0-8713-3af7f3d6ddd7))
    (pad "" thru_hole circle (at 0 0) (size 4 4) (drill 2.4) (layers *.Cu *.Mask) (tstamp 71f4066b-ac54-4429-9d94-7d1eafa4d009))
  )
(footprint "MountingHole:MountingHole_2.2mm_M2_DIN965_Pad" (layer "F.Cu")
    (tedit 56D1B4CB) (tstamp 5b4d89af-28c6-4276-8cdf-aba0a64d9eba)
    (at 84.5 -2.6)
    (descr "Mounting Hole 2.2mm, M2, DIN965")
    (tags "mounting hole 2.2mm m2 din965")
    (attr exclude_from_pos_files exclude_from_bom)
    (fp_text reference "Mount2" (at 0 -2.9) (layer "Cmts.User")
      (effects (font (size 1 1) (thickness 0.15)))
      (tstamp 8fb1f124-dcc3-476d-8811-7912e25ca591)
    )
    (fp_text value "TH2" (at 0 2.9) (layer "F.Fab")
      (effects (font (size 1 1) (thickness 0.15)))
      (tstamp a8bff58e-6f5a-4872-8a38-6aa03e8f2249)
    )
    (fp_circle (center 0 0) (end 1.9 0) (layer "Cmts.User") (width 0.15) (fill none) (tstamp 89373f03-1a93-4f85-bdcc-3678214566c9))
    (fp_circle (center 0 0) (end 2.15 0) (layer "F.CrtYd") (width 0.05) (fill none) (tstamp 173b6643-7a13-4cb0-8713-3af7f3d6ddd7))
    (pad "" thru_hole circle (at 0 0) (size 4 4) (drill 2.4) (layers F&B.Cu *.Mask) (tstamp 71f4066b-ac54-4429-9d94-7d1eafa4d009))
  )
    `;
*/
  },
};
