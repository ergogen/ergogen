# Ergogen

This keyboard generator aims to provide a common configuration format to describe **ergonomic** 2D layouts, and generate automatic plates, cases, and (un-routed) PCBs for them.
The project grew out of (and is an integral part of) the [Absolem keyboard](https://zealot.hu/absolem), and shares its [Discord server](https://discord.gg/DbCfZfZ) as well!


























## Overview

The whole config is a single YAML file.
If you prefer JSON over YAML, feel free to use it, conversion is trivial and the generator will detect the input format.
The important thing is that the data should contain the following keys:

```yaml
points: <points config...>
outline: <outline config...>
case: <case config...>
pcb: <pcb config...>
```

The `points` section describes the core of the layout: the positions of the keys.
The `outline` section then uses these points to generate plate, case, and PCB outlines.
The `case` section details how the case outlines are to be 3D-ized to form a 3D-printable object.
Finally, the `pcb` section is used to configure a KiCAD PCB template.

In the following, we'll have an in-depth discussion about each of these, with an additional running example of how the [Absolem](#TODO-link-to-config-yaml)'s config was created.





































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
                shift: [x, y] # default = [0, 0]
                rotate: num # default = 0
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
It's the `[0, 0]` origin with a 0 degree orientation by default, but it can be changed to any other pre-existing point.(Consequently, the first zone can't use a ref, because there isn't any yet.)
This initial position can then be changed with the `rotate` and `shift` options, adding extra rotation and translation, respectively.

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

Regarding lower level layout, rows appear both in zones and columns, and keys can be defined in four (!) different places. So what gives?
Don't worry, all this is there just so that we can keep repetition to a minimum.
We could safely remove the `rows` and `key` options from zones, and the `key` option from column definitions, without losing any of the functionality.
But we'd have to repeat ourselves a lot more.

Let's start with rows.
`zone.rows` can give an overall picture about how many rows we'll have, and set key-related options on a per-row basis.
But what if we want to override this in a certain column?
For example, we want an outer pinky column with just two keys instead of the regular three.
That's where `column.rows` can help, specifying a row-override for just that column.
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
name: name_override # default = a concatenation of column and row
shift: [x, y] # default = [0, 0]
rotate: num # default = 0
padding: num # default = 19
skip: boolean # default = false
asym: left | right | both # default = both
```

`name` is the unique identifier of this specific key.
It defaults to a `<row>_<column>` format, but can be overridden if necessary.
`shift` and `rotate` declare an extra, key-level translation or rotation, respectively.
Then we leave `padding` amount of vertical space before moving on to the next key in the column.
`skip` signals that the point is just a "helper" and should not be included in the output.
This can happen when a _real_ point is more easily calculable through a "stepping stone", but then we don't actually want the stepping stone to be a key itself.
Finally, `asym` relates to mirroring, which we'll cover in a second.

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

And this concludes point definitions.
This should be generic enough to describe any ergo layout, yet easy enough so that you'll appreciate not having to work in raw CAD.



































## A concrete points example

TODO: Absolem points here, with pics

<br />





































## Outline

Once the raw points are available, we want to turn them into solid, continuous outlines.
The points are enough to create properly positioned and rotated rectangles (with parametric side lengths), but they won't combine since there won't be any overlap.
So the first part of the outline generation is "binding", where we make the individual holes _bind_ to each other.
We use a key-level declarations for this:

```yaml
bind: num | [num_x, num_y] | [num_t, num_r, num_b, num_l] # default = 0
```

Again, key-level declaration means that both of these should be specified in the `points` section, benefiting from the same extension process every key-level setting does.
This field declares how much we want to bind in each direction, i.e., the amount of overlap we want to make sure that we can reach the neighbor (`num` applies to all directions, `num_x` horizontally, `num_y` vertically, and the t/r/b/l versions to top/right/bottom/left, respectively).

If it's a one-piece design, we also need to "glue" the halves together (or we might want to leave some extra space for the controller on the inner side for splits).
This is where the following section comes into play:

```yaml
glue:
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
```

...where an `<anchor>` is (mostly) the same as it was for points:

```yaml
ref: <point reference>
shift: [x, y] # default = [0, 0]
rotate: num # default = 0
relative: boolean # default = true
```

The section's `top` and `bottom` are both formatted the same, and describe the center line's top and bottom intersections, respectively.
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
These are then added to what we have so far to finish out the glue.

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
- `ref` : a previously defined outline, see below.
    - `name: outline_name` : the name of the referenced outline

Using these, we define exports as follows:

```yaml
exports:
    my_name:
        - operation: add | subtract | intersect | stack # default = add
          type: <one of the types>
          <type-specific params>
        - ...
```

Operations are performed in order, and the resulting shape is exported as an output.
Additionally, it is going to be available for further export declarations to use (through the `ref` type) under the name specified (`my_name`, in this case).
If we only want to use it as a building block for further exports, we can start the name with an underscore (e.g., `_my_name`) to prevent it from being actually exported.






























## A concrete outline example

<br />































## Case

Cases add a pretty basic and minimal 3D aspect to the generation process.
In this phase, we take different outlines (exported from the above section, even the "private" ones), extrude and position them in space, and combine them into one 3D-printable object.
That's it.
Declarations might look like this:

```yaml
case:
    case_name:
        - outline: <outline ref>
          extrude: num # default = 1
          translate: [x, y, z] # default = [0, 0, 0]
          rotate: [ax, ay, az] # default = [0, 0, 0]
          operation: add | subtract | intersect # default = add
        - ...
    ...
```

`outline` specifies which outline to import onto the xy plane, while `extrude` specifies how much it should be extruded along the z axis.
After that, the object is `translate`d, `rotate`d, and combined with what we have so far according to `operation`.
If we only want to use an object as a building block for further objects, we can employ the same "start with an underscore" trick we learned at the outlines section to make it "private".




































## A concrete case example

<br />


































## PCB

Everything should be ready for a handwire, but if you'd like the design to be more accessible and easily replicable, you probably want a PCB as well.
To help you get started, the necessary footprints and an edge cut can be automatically positioned so that all you need to do manually is the routing.

Footprints can be specified at the key-level (under the `points` section, like we discussed above), or here with manually given anchors.
The only difference between the two footprint types is that an omitted `ref` in the anchor means the current key for key-level declarations, while here it defaults to `[0, 0]`.
Additionally, the edge cut of the PCB can be specified using a previously defined outline name under the `edge` key.

```yaml
pcb:
    edge: <outline reference>
    footprints:
        - type: <footprint type>
          anchor: <anchor declaration>
          params: <type-specific footprint params>
        - ...
```

Currently, the following footprint types are supported:

- **`mx`**, **`alps`**, **`choc`**: mechanical switch footprints. Common parameters:
    - `from`, `to`: nets to connect

- **`diode`**: a combined THT+SMD diode footprint. Parameters:
    - `from`, `to`: nets to connect

- **`promicro`**: a controller to drive the keyboard. Available pins are `RAW`, `VCC`, `GND`, `RST`, and 18 GPIOs `P01` through `P18`. No parameters.

- **`slider`**: an SMD slider switch (part no. here), ideal for on/off operation. Parameters:
    - `from`, `to`: nets to connect

- **`button`**: an SMD button (part no. here), ideal for momentary toggles (like a reset switch). Parameters:
    - `from`, `to`: nets to connect

- **`rgb`**: an RGB led (part no. here), for per-key illumination, underglow, or feedback. Parameters:
    - `din`, `dout`: input and output nets of the data line
    - VCC and GND nets are assumed to be called `VCC` and `GND`...

- **`jstph`**: a two-pin JST-PH battery header footprint. Parameters:
    - `pos`, `neg`: nets to connect to the positive and negative terminals, respectively.















## A concrete PCB example

