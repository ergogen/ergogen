## Overview

The whole ergogen config is a single YAML file.
If you prefer JSON over YAML, feel free to use it, conversion is trivial and the generator will detect the input format.
The important thing is that the data should contain the following keys:

```yaml
points: <points config...>
outlines: <outline config...>
cases: <case config...>
pcbs: <pcb config...>
```

The `points` section describes the core of the layout: the positions of the keys.
The `outlines` section then uses these points to generate plate, case, and PCB outlines.
The `cases` section details how the case outlines are to be 3D-ized to form a 3D-printable object.
Finally, the `pcbs` section is used to configure KiCAD PCB templates.

In the following, we'll have an in-depth discussion about each of these.
Of course, if the declarative nature of the config causes unnecessary repetition (despite the built-in YAML references, and the ergogen-based inheritance detailed below), there's nothing stopping you from writing code that generates the config.
It brings the game to yet another abstraction level higher, so that you can use branching, loops, and parametric functions to compose a "drier" keyboard definition.





































## Points

A point in this context refers to a 2D point `[x,y]` with a rotation/orientation `r` added in.
These can be thought of as the middle points of the keycaps in a resulting keyboard layout, with an additional handling of the angle of the keycap. 

What makes this generator "ergo" is the implicit focus on the column-stagger.
Of course we could simulate the traditional row-stagger by defining everything with a 90 degree rotation, but that's really not the goal here.
Since we're focusing on column-stagger, keys are laid out in columns, and a collection of columns is called a "zone".
For example, we can define multiple, independent zones to make it easy to differentiate between the keywell and the thumb fan/cluster.
Zones can be described as follows:

```yaml
points:
    zones:
        my_zone_name:
            anchor:
                ref: <point reference>
                orient: num # default = 0
                shift: [x, y] # default = [0, 0]
                rotate: num # default = 0
                affects: string containing any of x, y, or r # default = xyr
            columns:
                column_name: <column def>
                ...
            rows:
                row_name: <row-level key def>
                ...
            key: <zone-level key def>
        ...
```

`anchors` are used to, well, anchor the zone to something.
It's the `[0, 0]` origin with a 0 degree orientation by default, but it can be changed to any other pre-existing point. (Consequently, the first zone can't use a ref, because there isn't any yet.)
The `ref` field can also be an array of references, in which case their average is used -- mostly useful for anchoring to the center, by averaging a key and its mirror; see later.
This initial position can then be changed with the `orient`, `shift`, and `rotate` options.
`shift` adds extra translation, while the difference between `orient` and `rotate` is whether they add their rotation before or after the translation.

Also note that anywhere an anchor can be specified, a list of anchors is also valid.
It would be meaningless, though, if each subsequent anchor would override the previous one, so the `affects` clause helps to affect only certain dimensions of the anchor.
It can be declared using a string containing any of `x`, `y`, or `r`, which stand for the x and y coordinates and the rotation of the anchor, respectively.

Once we know _where_ to start, we can describe the `columns` of our layout.

```yaml
columns:
    column_name:
      stagger: num # default = 0
      spread: num # default = 19
      rotate: num # default = 0
      origin: [x, y] # relative to center of column's first key, default = [0, 0]
      rows:
        row_name: <key-specific key def>
        ...
      key: <column-level key def>
    ...
```

`stagger` means an extra vertical shift to the starting point of the whole column compared to the previous one (initially 0, cumulative afterwards).
The layout of the column then proceeds according to the appropriate key declarations (more on this in a minute).

Once the column has been laid out, `spread` (the horizontal space between this column and the next) is applied, and an optional (cumulative) rotation is added around the `origin` if `rotate` is specified.
We repeat this until the end of the column definitions, then move on to the next zone.

<hr />

Regarding lower level layout, rows appear both in zones and columns, and keys can be defined in five (!) different places. So what gives?
Don't worry, all this is there just so that we can keep repetition to a minimum.
We could safely remove the `rows` and `key` options from zones, and the `key` option from column definitions, without losing any of the functionality.
But we'd have to repeat ourselves a lot more.

Let's start with rows.
`zone.rows` can give an overall picture about how many rows we'll have, and set key-related options on a per-row basis.
But what if we want to extend this initial picture with some column-specific details? (More on "extension" in a bit.)
For example, we want an outer pinky column where padding is tighter than it is for the others.
That's where `column.rows` can help, specifying a row "extension" for just that column.

And what if we want to **override** the zone-level declarations in a certain column?
For example, we don't just want to modify a row's attributes for a given column, but actually override the amount of rows there are.
Like an outer pinky column with just two keys instead of the regular three.
That's where `column.row_overrides` can help, specifying a row-level override that disregards the zone-level defaults.
Easy.

Now for the trickier part: keys.
There are five ways to set key-related options (again, to minimize the need for repetition):

1. at the global-level (affecting all zones)
2. at the zone-level
3. at the column-level
4. at the row-level
5. at the key-level

These "extend" each other in this order so by the time we reach a specific key, every level had an opportunity to modify something.
Note that unlike the overriding for rows, key-related extension is additive.
For example, let's suppose that a key-related attribute is already defined at the column-level.
When we later encounter a key-level extension for this key that specifies a few things but not this exact key, its value will stay the same instead of disappearing.

When there is a "collision", simple values (like booleans, numbers, or strings) replace the old ones, while composites (arrays or objects) apply this same extension recursively, element-wise.
So when `key = 1` is extended by `key = 2`, the result is `key = 2`.
But if `key = {a: 1}` is extended by `key = {b: 2}`, the result is `key = {a: 1, b: 2}`.

Lastly, while there are a few key-specific attributes that have special meaning in the context of points (listed below), any key with any data can be specified here.
This can be useful for storing arbitrary meta-info about the keys, or just configuring later stages with key-level parameters.
So, for example, when the outline phase specifies `bind` as a key-level parameter (see below), it means that it can be specified just like any other key-level attribute.

Now for the "official" key-level attributes:

```yaml
name: name_override # default = a concatenation of zone, column, and row
shift: [x, y] # default = [0, 0]
rotate: num # default = 0
padding: num # default = 19
skip: boolean # default = false
asym: left | right | both # default = both
mirror: <arbitrary key-level data>
```

`name` is the unique identifier of this specific key.
It defaults to a `<row>_<column>` format, but can be overridden if necessary.
`shift` and `rotate` declare an extra, key-level translation or rotation, respectively.
Then we leave `padding` amount of vertical space before moving on to the next key in the column.
`skip` signals that the point is just a "helper" and should not be included in the output.
This can happen when a _real_ point is more easily calculable through a "stepping stone", but then we don't actually want the stepping stone to be a key itself.
Finally, `asym` and `mirror` relate to mirroring, which we'll cover in a second.

<hr />

Since `zones` was only a single key within the `points` section, it's reasonable to expect something more.
Indeed:

```yaml
points:
    zones: <what we talked about so far...>
    key: <global key def>
    rotate: num # default = 0
    mirror:
        axis: num # default = 0
        ref: <point reference>
        distance: num # default = 0
```

Here, `rotate` can apply a global angle to all the points, which can simulate the inter-half angle of one-piece boards.
Then comes the mirroring step, where the generator automatically copies and mirrors each point.
If there's an `axis` set within the `mirror` key, points will be mirrored according to that.
If not, the axis will be calculated so that there will be exactly `distance` mms between the `ref`erenced point and its duplicate.

Now if our design is symmetric, we're done.
Otherwise, we need to use the `asym` key-level attribute to indicate which side the key should appear on.
If it's set as `left`, mirroring will simply skip this key.
If it's `right`, mirroring will "move" the point instead of copying it.
The default `both` assumes symmetry.

Using the _key-level_ `mirror` key (not to be confused with the global `mirror` setting we just discussed above), we can set additional data for the mirrored version of the key.
It will use the same extension mechanism as it did for the 5 levels before.

And this concludes point definitions.
This should be generic enough to describe any ergo layout, yet easy enough so that you'll appreciate not having to work in raw CAD.

<br>


































## Outlines

Once the raw points are available, we want to turn them into solid, continuous outlines.
The points are enough to create properly positioned and rotated rectangles (with parametric side lengths), but they won't combine since there won't be any overlap.
So the first part of the outline generation is "binding", where we make the individual holes _bind_ to each other.
We use a key-level declarations for this:

```yaml
bind: num | [num_x, num_y] | [num_t, num_r, num_b, num_l] # default = 0
```

Again, key-level declaration means that both of these should be specified in the `points` section, benefiting from the same extension process every key-level setting does.
This field declares how much we want to bind in each direction, i.e., the amount of overlap we want to make sure that we can reach the neighbor (`num` applies to all directions, `num_x` horizontally, `num_y` vertically, and the t/r/b/l versions to top/right/bottom/left, respectively).
Note that it might make sense to have negative `bind` values, in case we not only don't want to bind in the given direction, but also don't want to "cover up" a potential corner rounding or bevel (see below).

If it's a one-piece design, we also need to "glue" the halves together (or we might want to leave some extra space for the controller on the inner side for splits).
This is where the following section comes into play:

```yaml
glue:
    glue_name:
        top:
            left: <anchor>
            right: <anchor> | num
        bottom:
            left: <anchor>
            right: <anchor> | num
        waypoints:
            - percent: num
            width: num | [num_left, num_right]
            - ...
        extra:
            - <primitive shape>
            - ...
    ...
```

...where an `<anchor>` is (mostly) the same as it was for points:

```yaml
ref: <point reference>
shift: [x, y] # default = [0, 0]
rotate: num # default = 0
relative: boolean # default = true
```

The `top` and `bottom` fields in each glue's section are both formatted the same, and describe the center line's top and bottom intersections, respectively.
In a one-piece case, this means that we project a line from a left-side reference point (optionally rotated and translated), another from the right, and converge them to where they meet.
Split designs can specify `right` as a single number to mean the x coordinate where the side should be "cut off".
The `relative` flag means that the `shift` is interpreted in layout size units instead of mms (see below).

This leads to a gluing middle patch that can be used to meld the left and right sides together, given by the counter-clockwise polygon:

- Top intersection
- Left top point
- Left bottom point
- Bottom intersection
- Right bottom point
- Right top point

If this is insufficient (maybe because it would leave holes), the `waypoints` can be used to supplement the glue.
Here, `percent` means the y coordinate along the centerline (going from the top intersection to the bottom intersection), and `width` means the offset on the x axis.

If this is somehow _still_ insufficient (or there were problems with the binding phase), we can specify additional primitive shapes under the `extra` key (similarly to how we would use them in the exports; see below).
These are then added to what we have so far to finish out the glue. TODO!

<hr />

Once we're satisfied with the glue, the outline is generated by the union of the bound left/right halves and the glue polygon.
Note that this outline is still parametric, so that we can specify different width/height values for the rectangles.

Now we can configure what we want to "export" as outlines from this phase, given by the combination/subtraction of the following primitives:

- `keys` : the combined outline that we've just created. Its parameters include:
    - `side: left | right | middle | both | glue` : the part we want to use
        - `left` and `right` are just the appropriate side of the laid out keys, without the glue.
        - `middle` means an "ideal" version of the glue (meaning that instead of the `outline.glue` we defined above, we get `both` - `left` - `right`, so the _exact_ middle piece we would have needed to glue everything together
        - `both` means both sides, held together by the glue
        - `glue` is just the raw glue shape we defined above under `outline.glue`
    - `tag: <array of tags>` : optional tags to filter which points to consider in this step, where tags can be specified as key-level attributes.
    - `glue: <glue_name>` : the name of the glue to use, if applicable
    - `size: num | [num_x, num_y]` : the width/height of the rectangles to lay onto the points. Note that the `relative` flag for the glue declaration above meant this size as the basis of the shift. So during a `keys` layout with a size of 18, for example, a relative shift of `[.5, .5]` actually means `[9, 9]` in mms.
    - `corner: num # default = 0)` : corner radius of the rectangles
    - `bevel: num # default = 0)` : corner bevel of the rectangles, can be combined with rounding
    - `bound: boolean # default = true` : whether to use the binding declared previously
- `rectangle` : an independent rectangle primitive. Parameters:
    - `ref: <point reference>` : what position and rotation to consider as the origin
    - `rotate: num` : extra rotation
    - `shift: [x, y]` : extra translation
    - `size`, `corner` and `bevel`, just like for `keys`
- `circle` : an independent circle primitive. Parameters:
    - `ref`, `rotate`, and `shift` are the same as above
    - `radius: num` : the radius of the circle
- `polygon` : an independent polygon primitive. Parameters:
    - `points: [<point_def>, ...]` : the points of the polygon. Each `<point_def>` can have its own `ref` and `shift`, all of which are still the same as above. If `ref` is unspecified, the previous point's will be assumed. For the first, it's `[0, 0]` by default.
- `outline` : a previously defined outline, see below.
    - `name: outline_name` : the name of the referenced outline

Using these, we define exports as follows:

```yaml
exports:
    my_name:
        - operation: add | subtract | intersect | stack # default = add
          type: <one of the types> # default = outline
          <type-specific params>
        - ...
```

Individual parts can also be specified as an object instead of an array (which could be useful when YAML or built-in inheritance is used), like so:

```yaml
exports:
    my_name:
        first_phase:
            operation: add | subtract | intersect | stack # default = add
            type: <one of the types> # default = outline
            <type-specific params>
        second:
            ...
```

Operations are performed in order, and the resulting shape is exported as an output.
Additionally, it is going to be available for further export declarations to use (through the `ref` type) under the name specified (`my_name`, in this case).
If we only want to use it as a building block for further exports, we can start the name with an underscore (e.g., `_my_name`) to prevent it from being actually exported.

A shorthand version of a part can be given when the elements of the above arrays/objects are simple strings instead of further objects.
The syntax is a symbol from `[+, -, ~, ^]`, followed by a name, and is equivalent to adding/subtracting/intersecting/stacking an outline of that name, respectively.
More specifically, `~something` is equivalent to:

```yaml
type: outline
name: something
operation: intersect
```

<br>

































## Cases

Cases add a pretty basic and minimal 3D aspect to the generation process.
In this phase, we take different outlines (exported from the above section, even the "private" ones), extrude and position them in space, and combine them into one 3D-printable object.
That's it.
Declarations might look like this:

```yaml
cases:
    case_name:
        - type: outline # default option
          name: <outline ref>
          extrude: num # default = 1
          shift: [x, y, z] # default = [0, 0, 0]
          rotate: [ax, ay, az] # default = [0, 0, 0]
          operation: add | subtract | intersect # default = add
        - type: case
          name: <case_ref>
          # extrude makes no sense here...
          shift: # same as above
          rotate: # same as above
          operation: # same as above
        - ...
    ...
```

When the `type` is `outline`, `name` specifies which outline to import onto the xy plane, while `extrude` specifies how much it should be extruded along the z axis.
When the `type` is `case`, `name` specifies which case to use.
After having established our base 3D object, it is (relatively!) `rotate`d, `shift`ed, and combined with what we have so far according to `operation`.
If we only want to use an object as a building block for further objects, we can employ the same "start with an underscore" trick we learned at the outlines section to make it "private".

Individual case parts can again be listed as an object instead of an array, if that's more comfortable for inheritance/reuse (just like for outlines).
And speaking of outline similarities, the `[+, -, ~]` plus name shorthand is available again.
First it will try to look up cases, and then outlines by the name given.
Stacking is omitted as it makes no sense here.

<br>



































## PCBs

Everything should be ready for a handwire, but if you'd like the design to be more accessible and easily replicable, you probably want a PCB as well.
To help you get started, the necessary footprints and an edge cut can be automatically positioned so that all you need to do manually is the routing.

Footprints can be specified at the key-level (under the `points` section, like we discussed above), or here with manually given anchors.
The differences between the two footprint types are:

- an omitted `ref` in the anchor means the current key for key-level declarations, while here it defaults to `[0, 0]`
- a parameter starting with an exclamation point is an indirect reference to an eponymous key-level attribute -- so, for example, `from = !column_net` would mean that the key's `column_net` attribute is read there.

Additionally, the edge cut of the PCB (or other decorative outlines for the silkscreen maybe) can be specified using a previously defined outline name under the `outlines` key.

```yaml
pcbs:
    pcb_name:
        outlines:
            pcb_outline_name:
                outline: <outline reference>
                layer: <kicad layer to export to> # default = Edge.Cuts
            ...
        footprints:
            - type: <footprint type>
              anchor: <anchor declaration>
              nets: <type-specific net params>
              params: <type-specific (non-net) footprint params>
            - ...
    ...
```

Defining both the `outlines` and the `footprints` can be done either as arrays or objects, whichever is more convenient.
Currently, the following footprint types are supported:

- **`mx`**, **`alps`**, **`choc`**: mechanical switch footprints. Common nets:
    - `from`, `to`: nets to connect

- **`diode`**: a combined THT+SMD diode footprint. Nets:
    - `from`, `to`: nets to connect

- **`promicro`**: a controller to drive the keyboard. Available pins are `RAW`, `VCC`, `GND`, `RST`, and 18 GPIOs `P01` through `P18`. No Nets.

- **`slider`**: an SMD slider switch (part no. here), ideal for on/off operation. Nets:
    - `from`, `to`: nets to connect

- **`button`**: an SMD button (part no. here), ideal for momentary toggles (like a reset switch). Nets:
    - `from`, `to`: nets to connect

- **`rgb`**: an RGB led (part no. here), for per-key illumination, underglow, or feedback. Nets:
    - `din`, `dout`: input and output nets of the data line
    - VCC and GND nets are assumed to be called `VCC` and `GND`...

- **`jstph`**: a two-pin JST-PH battery header footprint. Nets:
    - `pos`, `neg`: nets to connect to the positive and negative terminals, respectively.

- **`pin`**: a single pin.
    - Nets:
        - `net`: the net it should connect to
    - Parameters:
        - `diameter`: the larger diameter of the hole, including the copper ring
        - `drill`: the smaller diameter of the actual hole

- **`hole`**: a simple circular hole. Parameters:
    - `diameter`: the diameter of the (non-plated!) hole

<br>












## Phew, that's it.

*Theoretically*, you should know everything to start making your own dream keyboard.
*Realistically*, tho, this might have been a bit dense, to say the least.
But hey, this is the full reference, what did you expect?

If you'd like to get your feet wet with easier examples, and get gradually more hard-core, let me suggest the other tutorials in the docs folder (as they become available).
Alternatively, if you'd like to talk to a certified ergogen representative, come join us [on Discord](https://discord.gg/nbKcAZB)!
It's also a great place to get in touch if you are already somewhat familiar with this whole shebang, and would like to contribute examples, tests, features, whatever.
See you there!