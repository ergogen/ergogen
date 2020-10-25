window.ergogen_examples = {
    Simple: {
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