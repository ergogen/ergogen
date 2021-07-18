# Ergogen TODO



## CLI

### Major

- For rectangles and other non-`keys` outline types, upgrade `ref` to full anchor support (including multi-anchors!)
- Base key-level defaults (and many other things) around u's
    - Possibly breaking, as from here on out, changing `u` affects more than it did before

### Minor

- Global column-level attributes like spread
- More generic anchors or distances?
    - Intersect support for anchor affects clauses, which (combined with the math formulas and possible trigonometric functions) should allow for every use case we've discussed so far
- Add a way to propagate creator/board/version info from the pcb section to the kicad template
- Add a way to globally enable/disable references (`ref_hide`)
- SVG input (for individual outlines, or even combinations parsed by line color, etc.)
- Look into gr_curve to possibly add beziers to the kicad conversion
- Support opting out of gluing altogether
- Support specifying keys/labels for the pcb section (not just blindly assuming all)
- Should add `p`, `pcx`, and `pcy` as units for padding calculations
- Add snappable line footprint


### Patch

- Implement `glue.extra`
- Integration and end2end tests to get coverage to 100%
- Fix the intersection of parallel lines when gluing




## WEBUI

### Major

### Minor

- Propagate log output from the ergogen module
- Attempt to auto-compile (if inactive for n secs, or whatever)
- Support saving to gists
- Add kicad_pcb visualization as well
- Expand the config dropdown with opensource stuff: corne, lily, ergodox, atreus...

### Patch

- Streamlining (and documenting) an update pipeline
- Puppeteer tests






## DOCS

- n00b tutorials
    - With a progression of increasingly complex steps
    - And lots of illustrations!
- Complete reference
    - some known deficiencies:
        - Units separated to their own block at the front
        - Key-level `width` and `height` are supported during visualization
        - This key-level example should probably be added from discord: https://discord.com/channels/714176584269168732/759825860617437204/773104093546676244
- Contribution guidelines
    - including test commands (npm test, npm run coverage, --what switch, --dump switch)
- Changelog, Roadmap
- A public catalog of real-life ergogen configs










