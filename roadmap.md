# Ergogen TODO



## CLI

### Major

- Restructure pcb point/footprint filtering
    - Use the same `what`/`where` infrastructure as outlines
    - Collapse params/nets/anchors into a single hierarchy from the user's POV
    - Add per-footprint mirror support
    - Add some way for footprints to be able to "resist" the mirroring-related special treatment of negative X shift, rotation, etc.
- Merge, generalize, uniform-ize and externalize footprints!
    - onnx-like incremental opset versioning
    - Template for creating them, built-in variables they can use, documentation, external links, etc.
        - Add access to whole set of points + filtering logic, so they can implement their own connection logic as well maybe (see daisy chaining)
        - footprint parameters inside the body should be `p.params.field` instead of `p.param.field` so it actually matches the options that you pass in
    - Also considering how (or, on which layer) they define their silks, universal mirroring behaviour, etc.
    - Rename class to designator in this context (https://en.wikipedia.org/wiki/Reference_designator#Designators)

### Minor

- Include raw kicad footprint integrations
    - pull torik's script to be able to convert raw kicad footprints into positionable ergogen ones
    - have a `dummy` footprint which can just be updated from schematic
- Allow footprints to publish outlines
    - Make these usable in the `outlines` section through a new `what`
- 3D orient for cases
- Even more extreme anchor stuff
    - Checkpoints, intersects, distances, weighted combinations?
- SVG input (for individual outlines, or even combinations parsed by line color, etc.)
    - And once that's done, possibly even STL or other input for cases or pcb renders
- Support text silk output to PCBs (in configurable fonts, through SVG?)
    - Maybe a partial markdown preprocess to support bold and italic?
- Look into gr_curve to possibly add beziers to the kicad conversion
    - Support curves (arcs as well as Béziers) in polygons
- Add snappable line footprint
- Figure out a manual, but still reasonably comfortable routing method directly from the config
- Eeschema support for pcbs
- Generate ZMK shield from config
- Export **to** KLE?
- Include 3D models paths in kicad output for visualization
    - Also, provide 3D models for built-in footprints
- Look into kicad 5 vs. 6 output format
- Update json schema and add syntax highlight to editors
- Support different netclasses
- Allow a potential filter for filleting (only on angles =90°, <45°, left turn vs. right turn when going clockwise, etc.)
- Add `operation: skip` to allow easily "commenting out" whole outline parts
- Better error message for negative rectangle (it may not only be because of corner/bevel)


### Patch

- YAML lib v4 update - breaking changes in how undefined is handled!
- Prevent double mirroring (see discord "mirror_mirror_")
- Check unexpected keys at top level, too
- Better error handling for the fillet option?
- Integration and end2end tests to get coverage to 100%
- Add custom fillet implementation that considers line-line connections only?
- Add nicer filleting error messages when makerjs dies for some reason
- Empty nets should be allowed (to mean unconnected)
- Debug point (orient+shift) differences in circles vs. polygons (see Discord)


## WEBUI

### Major

- Change over to Cache's live preview implementation
- Add missing KLE functionality
- Create browserified version of semver lib
    - Or at least a shim with a console warning
- Visualizing multiple outlines at once, with different colors

### Minor

- Propagate log output from the ergogen module
- Attempt to auto-compile (if inactive for n secs, or whatever)
- Support saving to gists
- Add kicad_pcb visualization as well
- Get dropdown examples from a separate repo
- Expand the config dropdown with opensource stuff: corne, lily, ergodox, atreus...

### Patch

- Streamline (and document) an update pipeline
- Add puppeteer tests



## DOCS

- n00b tutorials
    - With a progression of increasingly complex steps
    - And lots of illustrations!
- Complete reference
    - Some known deficiencies:
        - Units separated to their own block at the front
        - Key-level `width` and `height` are supported during visualization
        - This key-level example should probably be added from discord: https://discord.com/channels/714176584269168732/759825860617437204/773104093546676244
        - Change outline fields to have their full anchor support documented
        - Mention the ability to opt out of gluing!
        - Key-level defaults are based around u's, not 19!
- Contribution guidelines
    - Include test commands (npm test, npm run coverage, --what switch, --dump switch)
- Changelog, Roadmap
- A public catalog of real-life ergogen configs
    - Probably could be the same as the separate examples repo for the dropdown










