# Ergogen

This keyboard generator aims to provide a common configuration format to describe **ergonomic** 2D layouts, and generate  automatic plates, cases, and (un-routed) PCBs for them.
The project grew out of (and is an integral part of) the [Absolem keyboard](https://zealot.hu/absolem), and shares its [Discord server](https://discord.gg/DbCfZfZ) as well!

## Config structure

### Overview

The whole config is a single YAML file with the following keys:

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

If you prefer JSON over YAML, feel free to use it, conversion is trivial and the generator will detect the input format.

### Points

Points in this context refer to a 2D point `[x,y]` with an rotation/orientation `r` added in.
These can be thought of as the middle points of the keycaps in a resulting keyboard layout, with an additional handling of and angle of the keycap. 

What makes this generator "ergo" is the implicit focus on the column-stagger.
(Of course we could simulate the traditional row-stagger by defining everything with a 90 degree rotation, but that's really not the goal here.)
Since we're focusing on column-stagger, keys are laid out in columns, and a collection of columns is called a "zone".
For example, we can define multiple, independent zones to make it easy to differentiate between the keywell and the thumb fan/cluster.
Zones can be described as follows:

```yaml
zones:
    my_zone_name:
        anchor:
            ref: <point reference>
            rotate: angle (default = 0)
            shift: [x, y] (default = [0, 0])
        columns:
            column_name: <column def>
            ...
        rows:
            row_name: <row-level key def>
            ...
        key: <zone-level key def>
```

`anchors` are used to, well, anchor the zone to something.
It's the `[0, 0]` origin with a 0 degree orientation by default, but it can be changed to any other pre-existing point.(Consequently, the first done can't use a ref, because there isn't any yet.)
This initial position can then be changed with the `rotate` and `shift` options, adding extra rotation and translation, respectively.

Once we know _where_ to start, we can describe the columns of our layout.

```yaml
columns:
    column_name:
      stagger: num (default = 0)
      spread: num (default = 19)
      rotate: angle (default = 0)
      origin: [x, y] (default = center of column's first key)
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
Don't worry, all this is just there so that we can keep repetition to a minimum.
We could safely remove the `rows` and `key` options from zones, and the `key` option from column definitions, without losing any of the functionality.
But we'd have to repeat ourselves a lot more.

Let's start with rows.
`zone.rows` can give an overall picture about how many rows we'll have, and set key-related options on a per-row basis.
But what if we want to override this in a certain column?
For example, we want an outer pinky column with just two keys  instead of the regular three.
That's where `column.rows` can help, specifying a row-override for just that column.
Easy.

Now for the trickier part: keys.
There are four ways to set key-related options (again, to minimize the need for repetition):

1. on the zone-level
2. on the column-level
3. on the row-level
4. on the key-level


:

```yaml
rows:
    - name: row_name
      key: <row-level key def>
```


asym: left | right | both (default = both)
skip: true | false (default = false)


TODO: declaration "inheritance", global / column-level / key-level
TODO: meta stuff, so that the other parts can have access to key-specific inheritance

### Outline

Once the raw points are available, we want to turn them into a solid, continuous outline.
The points are enough to create properly positioned and rotated rectangles (with parametric side lengths), but they won't combine since there won't be any overlap.
So the first part of the outline generation is "binding", where we make the individual holes _bind_ to each other.
We use two, key-level declarations for this:

```yaml
neighbors: [dir_x, dir_y]
bind: num | [num_x, num_y] | [num_t, num_r, num_b, num_l]
```

The former declares the directions we want to bind in, where `dir_x` can be one of `left`, `right`, or `both`; and `dir_y` can be one of `up`, `down`, or `both`.
The latter declares how much we want to bind, i.e., the amount of overlap we want in that direction to make sure that we can reach the neighbor (`num` applies to all directions, `num_x` horizontally, `num_y` vertically, and the t/r/b/l versions to top/right/bottom/left, respectively).

If it's a one-piece design, we still need to "glue" the halves together, or we might want to leave some extra space for the controller on the inner side.
This is where the following section comes into play:

```yaml
glue:
    top:
        left: <line def>
        right: <line def> | num
    bottom:
        left: <line def>
        right: <line def> | num
    waypoints:
        - percent: num
          width: num | [num_left, num_right]
        - ...
```

...where a `<line def>` looks like:

```yaml
ref: <point reference>
rotate: num
origin: [x, y]
shift: [x, y]
relative: true | false (default = false)
```

The section's `top` and `bottom` are both formatted the same, and describe the center line's top and bottom intersections, respectively.
In a one-piece case, this means that we project a line from a left-side reference point (optionally rotated and translated), another from the right, and converge them to where they meet.
Split designs can specify `right` as a single number to mean the x coordinate where the side should be "cut off".
(The `relative` flag means the unit of the translation specified in `shift` is not mm, but the size the point is laid out with; see below.)

This leads to a gluing middle patch that can be used to meld the left and right sides together, given by the counter-clockwise polygon:

- Top intersection
- Left top point
- Left bottom point
- Bottom intersection
- Right bottom point
- Right top point

If this is insufficient (maybe because it would leave holes), the `waypoints` can be used to supplement the glue.
Here, `percent` means the y coordinate along the centerline (going from the top intersection to the bottom intersection), and `width` means the offset on the x axis.

<hr />

Once we're satisfied with the glue, the outline is generated by the union of the bound left/right halves and the glue polygon.
Note that this outline is still parametric, so that we can specify different width/height values for the rectangles.

Now we can configure what we want to "export" as outlines from this phase, given by the combination/subtraction of the following primitives:

- `all` : the combined outline that we've just created. Its parameters include:
    - `size: num | [num_x, num_y]` : the width/height of the rectangles to lay onto the points
    - `corner: num (default = 0)` : corner radius of the rectangles
    - `corner_style: rounded | beveled (default = rounded)` : the style of the rectangle's corners
- `keys` : only one side of the laid out keys, without the glue. Parameters:
    - everything we could specify for `all`
    - `side: left | right` : the side we want
- `glue` : just the glue, but the "ideal" version of it. This means that instead of the `glue` we defined above, we get `all` - `left` - `right`, so the _exact_ middle piece we would have needed to glue everything together. Parameters:
    - everything we could specify for `all` (since those are needed for the calculation)
    - `side: left | right | both (default = both)` : optionally, we could choose only one side of the glue as well

Additionally, we can use primitive shapes:
    
- `rectangle` : an independent rectangle primitive. Parameters:
    - `ref: <point reference>` : what position and rotation to consider as the origin
    - `rotate: angle` : extra rotation
    - `shift: [x, y]` : extra translation
    - `width: num` : the width of the rectangle
    - `height: num` : the height of the rectangle
- `circle` : an independent circle primitive. Parameters:
    - `ref`, `rotate`, and `shift` are the same as above
    - `radius: num` : the radius of the circle
- `polygon` : an independent polygon primitive. Parameters:
    - `ref`, `rotate`, and `shift` are the same as above
    - `points: [[x, y], ...]` : the points of the polygon

Using these, we define exports as follows:


```yaml
exports:
    my_name:
        - op: add | sub | diff (default = add)
          type: <one of the types>
          <type-specific params>
        - ...
```

Operations are performed in order, and the resulting shape is exported as an output.
Additionally, it is going to be available to further export declarations under the name specified (`my_name`, in this case).
If we only want to use it as a building block for further exports, we can start the name with an underscore (e.g., `_my_name`) to prevent it from being actually exported.

### Case

Cases add a pretty basic and minimal 3D aspect to the generation process.
In this phase, we take different outlines (exported from the above section), extrude and translate them along the z axis, add some chamfer to the edges, and combine them into one 3D-printable object.
That's it.
Declarations might look like this:

```yaml
case:
    case_name:
        - outline: <outline ref>
          extrude: num
          raise: num
          chamfer: num
          op: add | sub | diff (default = add)
        - ...
```

### PCB