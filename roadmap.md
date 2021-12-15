# Ergogen TODO



## CLI

### Major

- Move column-level attributes like spread to key-level to unify the structure
- Generalize what shapes to be repeated when outlining `keys`
- Place rectangles by their centers
- Full per-point anchors
- Collapse any raw shift or rotation under the anchor infrastructure
- Merge, generalize, and uniform-ize footprints
    - Template for creating them, built-in variables they can use, documentation, external links, etc.
    - Also considering how (or, on which layer) they define their silks, universal mirroring behaviour, etc.

### Minor

- Allow shift/rotate for outlines (via `anchor_def`, probably)
- More generic anchors or distances?
    - Intersect support for anchor affects clauses, which (combined with the math formulas and possible trigonometric functions) should allow for every use case we've discussed so far
- Allow both object (as well as arrays) in multiple anchor refs
- SVG input (for individual outlines, or even combinations parsed by line color, etc.)
    - And once that's done, possibly even STL or other input for cases or pcb renders
- Support text silk output to PCBs (in configurable fonts, through SVG?)
    - Maybe a partial markdown preprocess to support bold and italic?
- Look into gr_curve to possibly add beziers to the kicad conversion
    - Support curves (arcs as well as Béziers) in polygons
- Support specifying keys/labels for the pcb section (not just blindly assuming all)
- Add snappable line footprint
- Layer-aware export from Maker.JS, so we can debug in the webui more easily
- Add filleting syntax with `@`?
- Eeschema support for pcbs
- Outline expand and shrink access from makerjs
- Resurrect and/or add wider tagging support
    - Also add subtractive tagging filters (exclude)
    - Also expand this to footprints (so, which footprints get applied to which pcb)
        - Or, at least, allow skipping per-key footprints
- Generate ZMK shield from config
- Export **to** KLE?
- Per-footprint mirror support
- A flag for footprints to be able to "resist" the mirroring-related special treatment of negative X shift, rotation, etc.
- Include 3D models for kicad output for visualization
- Look into kicad 5 vs. 6 output format
- Update json schema and add syntax highlight to editors


### Patch

- Better error handling for the fillet option?
- Implement `glue.extra`
- Integration and end2end tests to get coverage to 100%
- Fix the intersection of parallel lines when gluing
- Add custom fillet implementation that considers line-line connections only



## WEBUI

### Major

- Change over to Cache's live preview implementation
- Add missing KLE functionality
- Create browserified version of semver lib

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
        - Change outline fields to have their full anchor support documented
        - Mention the ability to opt out of gluing!
        - Key-level defaults are based around u's, not 19!
    - change over to built, per-chapter docs, like how Cache has them
- Contribution guidelines
    - including test commands (npm test, npm run coverage, --what switch, --dump switch)
- Changelog, Roadmap
- A public catalog of real-life ergogen configs










