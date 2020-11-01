window.ergogen_examples = {
    Simple: {
        Absolem: `
        
points:
  zones:
    matrix:
      anchor:
        rotate: 5
      columns:
        pinky:
        ring:
          rotate: -5
          # hinge at the bottom right corner
          # of the bottom pinky's 14x14 hole
          # for historical reasons...
          origin: [-12, -19]
          stagger: 12
        middle:
          stagger: 5
        index:
          stagger: -6
        inner:
          stagger: -2
      rows:
        bottom:
        home:
        top:
    thumbfan:
      anchor:
        ref: matrix_inner_bottom
        shift: [-7, -19]
      columns:
        near:
        home:
          spread: 21.25
          rotate: -28
          origin: [-11.75, -9]
        far:
          spread: 21.25
          rotate: -28
          origin: [-9.5, -9]
      rows:
        thumb:
  rotate: -20
  mirror:
    ref: matrix_pinky_home
    # The mk1's origin was the bottom left corner of the bottom pinky key.
    # But it later got rotated by the bottom *right* corner as the pinky angle
    # and then rotated again for the inter-half angle so [0, 0] was nowhere on
    # the actual result.
    #
    # Since the new origin is the center of the pinky home, we have to convert
    # the old, round 250 width to this new coordinate system if we want backward
    # compatibility. The following snippet was used to arrive at this distance.
    #
    # old_origin = new Point(7, 7 + 19)
    # old_origin.rotate(5, [14, 0])
    # old_origin.rotate(-20, [0, 0])
    # new_width = 250 - (2 * old_origin.x)
    distance: 223.7529778
      
        
        `,
        Atreus: `
        
points:
  zones:
    matrix:
      columns:
        pinky:
        ring:
          stagger: 3
        middle:
          stagger: 5
        index:
          stagger: -5
        inner:
          stagger: -6
        thumb:
          stagger: 10
          row_overrides:
            home:
      rows:
        bottom:
        home:
        top:
        num:
  rotate: -10
  mirror:
    ref: matrix_thumb_home
    distance: 22
      
        `
    }
}