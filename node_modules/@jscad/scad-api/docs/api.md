## Functions

<dl>
<dt><a href="#clone">clone(obj)</a> ⇒ <code>CSG</code></dt>
<dd><p>clone the given object</p>
</dd>
<dt><a href="#css2rgb">css2rgb(String)</a> ⇒</dt>
<dd><p>Converts an CSS color name to RGB color.</p>
</dd>
<dt><a href="#color">color(color, objects)</a> ⇒ <code>CSG</code></dt>
<dd><p>apply the given color to the input object(s)</p>
</dd>
<dt><a href="#rgb2hsl">rgb2hsl(Number, Number, Number)</a> ⇒</dt>
<dd><p>Converts an RGB color value to HSL. Conversion formula
adapted from <a href="http://en.wikipedia.org/wiki/HSL_color_space">http://en.wikipedia.org/wiki/HSL_color_space</a>.
Assumes r, g, and b are contained in the set [0, 1] and
returns h, s, and l in the set [0, 1].</p>
</dd>
<dt><a href="#hsl2rgb">hsl2rgb(Number, Number, Number)</a> ⇒</dt>
<dd><p>Converts an HSL color value to RGB. Conversion formula
adapted from <a href="http://en.wikipedia.org/wiki/HSL_color_space">http://en.wikipedia.org/wiki/HSL_color_space</a>.
Assumes h, s, and l are contained in the set [0, 1] and
returns r, g, and b in the set [0, 1].</p>
</dd>
<dt><a href="#rgb2hsv">rgb2hsv(Number, Number, Number)</a> ⇒</dt>
<dd><p>Converts an RGB color value to HSV. Conversion formula
adapted from <a href="http://en.wikipedia.org/wiki/HSV_color_space">http://en.wikipedia.org/wiki/HSV_color_space</a>.
Assumes r, g, and b are contained in the set [0, 1] and
returns h, s, and v in the set [0, 1].</p>
</dd>
<dt><a href="#hsv2rgb">hsv2rgb(Number, Number, Number)</a> ⇒</dt>
<dd><p>Converts an HSV color value to RGB. Conversion formula
adapted from <a href="http://en.wikipedia.org/wiki/HSV_color_space">http://en.wikipedia.org/wiki/HSV_color_space</a>.
Assumes h, s, and v are contained in the set [0, 1] and
returns r, g, and b in the set [0, 1].</p>
</dd>
<dt><a href="#html2rgb">html2rgb()</a></dt>
<dd><p>Converts a HTML5 color value (string) to RGB values
See the color input type of HTML5 forms
Conversion formula:</p>
<ul>
<li>split the string; &quot;#RRGGBB&quot; into RGB components</li>
<li>convert the HEX value into RGB values</li>
</ul>
</dd>
<dt><a href="#rgb2html">rgb2html()</a></dt>
<dd><p>Converts RGB color value to HTML5 color value (string)
Conversion forumla:</p>
<ul>
<li>convert R, G, B into HEX strings</li>
<li>return HTML formatted string &quot;#RRGGBB&quot;</li>
</ul>
</dd>
<dt><a href="#union">union(objects)</a> ⇒ <code>CSG</code></dt>
<dd><p>union/ combine the given shapes</p>
</dd>
<dt><a href="#difference">difference(objects)</a> ⇒ <code>CSG</code></dt>
<dd><p>difference/ subtraction of the given shapes ie:
cut out C From B From A ie : a - b - c etc</p>
</dd>
<dt><a href="#intersection">intersection(objects)</a> ⇒ <code>CSG</code></dt>
<dd><p>intersection of the given shapes: ie keep only the common parts between the given shapes</p>
</dd>
<dt><a href="#linear_extrude">linear_extrude([options], baseShape)</a> ⇒ <code>CSG</code></dt>
<dd><p>linear extrusion of the input 2d shape</p>
</dd>
<dt><a href="#rotate_extrude">rotate_extrude([options], baseShape)</a> ⇒ <code>CSG</code></dt>
<dd><p>rotate extrusion / revolve of the given 2d shape</p>
</dd>
<dt><a href="#rectangular_extrude">rectangular_extrude(basePoints, [options])</a> ⇒ <code>CSG</code></dt>
<dd><p>rectangular extrusion of the given array of points</p>
</dd>
<dt><a href="#translate">translate(vector, ...objects)</a> ⇒ <code>CSG</code></dt>
<dd><p>translate an object in 2D/3D space</p>
</dd>
<dt><a href="#scale">scale(scale, ...objects)</a> ⇒ <code>CSG</code></dt>
<dd><p>scale an object in 2D/3D space</p>
</dd>
<dt><a href="#rotate">rotate(rotation, objects)</a> ⇒ <code>CSG</code></dt>
<dd><p>rotate an object in 2D/3D space</p>
</dd>
<dt><a href="#transform">transform(matrix, ...objects)</a> ⇒ <code>CSG</code></dt>
<dd><p>apply the given matrix transform to the given objects</p>
</dd>
<dt><a href="#center">center(axis, ...objects)</a> ⇒ <code>CSG</code></dt>
<dd><p>center an object in 2D/3D space</p>
</dd>
<dt><a href="#mirror">mirror(vector, ...objects)</a> ⇒ <code>CSG</code></dt>
<dd><p>mirror an object in 2D/3D space</p>
</dd>
<dt><a href="#expand">expand(radius, object)</a> ⇒ <code>CSG/CAG</code></dt>
<dd><p>expand an object in 2D/3D space</p>
</dd>
<dt><a href="#contract">contract(radius, object)</a> ⇒ <code>CSG/CAG</code></dt>
<dd><p>contract an object(s) in 2D/3D space</p>
</dd>
<dt><a href="#minkowski">minkowski(objects)</a> ⇒ <code>CSG</code></dt>
<dd><p>create a minkowski sum of the given shapes</p>
</dd>
<dt><a href="#hull">hull(objects)</a> ⇒ <code>CSG</code></dt>
<dd><p>create a convex hull of the given shapes</p>
</dd>
<dt><a href="#chain_hull">chain_hull(objects)</a> ⇒ <code>CSG</code></dt>
<dd><p>create a chain hull of the given shapes
Originally &quot;Whosa whatsis&quot; suggested &quot;Chain Hull&quot; ,
as described at <a href="https://plus.google.com/u/0/105535247347788377245/posts/aZGXKFX1ACN">https://plus.google.com/u/0/105535247347788377245/posts/aZGXKFX1ACN</a>
essentially hull A+B, B+C, C+D and then union those</p>
</dd>
<dt><a href="#square">square([options])</a> ⇒ <code>CAG</code></dt>
<dd><p>Construct a square/rectangle</p>
</dd>
<dt><a href="#circle">circle([options])</a> ⇒ <code>CAG</code></dt>
<dd><p>Construct a circle</p>
</dd>
<dt><a href="#polygon">polygon([options])</a> ⇒ <code>CAG</code></dt>
<dd><p>Construct a polygon either from arrays of paths and points, or just arrays of points
nested paths (multiple paths) and flat paths are supported</p>
</dd>
<dt><a href="#triangle">triangle()</a> ⇒ <code>CAG</code></dt>
<dd><p>Construct a triangle</p>
</dd>
<dt><a href="#cube">cube([options])</a> ⇒ <code>CSG</code></dt>
<dd><p>Construct a cuboid</p>
</dd>
<dt><a href="#sphere">sphere([options])</a> ⇒ <code>CSG</code></dt>
<dd><p>Construct a sphere</p>
</dd>
<dt><a href="#cylinder">cylinder([options])</a> ⇒ <code>CSG</code></dt>
<dd><p>Construct a cylinder</p>
</dd>
<dt><a href="#torus">torus([options])</a> ⇒ <code>CSG</code></dt>
<dd><p>Construct a torus</p>
</dd>
<dt><a href="#polyhedron">polyhedron([options])</a> ⇒ <code>CSG</code></dt>
<dd><p>Construct a polyhedron from the given triangles/ polygons/points</p>
</dd>
<dt><a href="#vector_char">vector_char(x, y, char)</a> ⇒ <code>Object</code></dt>
<dd><p>Construct a with, segments tupple from a character</p>
</dd>
<dt><a href="#vector_text">vector_text(x, y, string)</a> ⇒ <code>Array</code></dt>
<dd><p>Construct an array of with, segments tupple from a string</p>
</dd>
</dl>

<a name="clone"></a>

## clone(obj) ⇒ <code>CSG</code>
clone the given object

**Kind**: global function  
**Returns**: <code>CSG</code> - new CSG object , a copy of the input  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | the object to clone by |

**Example**  
```js
let copy = clone(sphere())
```
<a name="css2rgb"></a>

## css2rgb(String) ⇒
Converts an CSS color name to RGB color.

**Kind**: global function  
**Returns**: Array           The RGB representation, or [0,0,0] default  

| Param | Description |
| --- | --- |
| String | s       The CSS color name |

<a name="color"></a>

## color(color, objects) ⇒ <code>CSG</code>
apply the given color to the input object(s)

**Kind**: global function  
**Returns**: <code>CSG</code> - new CSG object , with the given color  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>Object</code> | either an array or a hex string of color values |
| objects | <code>Object</code> \| <code>Array</code> | either a single or multiple CSG/CAG objects to color |

**Example**  
```js
let redSphere = color([1,0,0,1], sphere())
```
<a name="rgb2hsl"></a>

## rgb2hsl(Number, Number, Number) ⇒
Converts an RGB color value to HSL. Conversion formula
adapted from http://en.wikipedia.org/wiki/HSL_color_space.
Assumes r, g, and b are contained in the set [0, 1] and
returns h, s, and l in the set [0, 1].

**Kind**: global function  
**Returns**: Array           The HSL representation  

| Param | Description |
| --- | --- |
| Number | r       The red color value |
| Number | g       The green color value |
| Number | b       The blue color value |

<a name="hsl2rgb"></a>

## hsl2rgb(Number, Number, Number) ⇒
Converts an HSL color value to RGB. Conversion formula
adapted from http://en.wikipedia.org/wiki/HSL_color_space.
Assumes h, s, and l are contained in the set [0, 1] and
returns r, g, and b in the set [0, 1].

**Kind**: global function  
**Returns**: Array           The RGB representation  

| Param | Description |
| --- | --- |
| Number | h       The hue |
| Number | s       The saturation |
| Number | l       The lightness |

<a name="rgb2hsv"></a>

## rgb2hsv(Number, Number, Number) ⇒
Converts an RGB color value to HSV. Conversion formula
adapted from http://en.wikipedia.org/wiki/HSV_color_space.
Assumes r, g, and b are contained in the set [0, 1] and
returns h, s, and v in the set [0, 1].

**Kind**: global function  
**Returns**: Array           The HSV representation  

| Param | Description |
| --- | --- |
| Number | r       The red color value |
| Number | g       The green color value |
| Number | b       The blue color value |

<a name="hsv2rgb"></a>

## hsv2rgb(Number, Number, Number) ⇒
Converts an HSV color value to RGB. Conversion formula
adapted from http://en.wikipedia.org/wiki/HSV_color_space.
Assumes h, s, and v are contained in the set [0, 1] and
returns r, g, and b in the set [0, 1].

**Kind**: global function  
**Returns**: Array           The RGB representation  

| Param | Description |
| --- | --- |
| Number | h       The hue |
| Number | s       The saturation |
| Number | v       The value |

<a name="html2rgb"></a>

## html2rgb()
Converts a HTML5 color value (string) to RGB values
See the color input type of HTML5 forms
Conversion formula:
- split the string; "#RRGGBB" into RGB components
- convert the HEX value into RGB values

**Kind**: global function  
<a name="rgb2html"></a>

## rgb2html()
Converts RGB color value to HTML5 color value (string)
Conversion forumla:
- convert R, G, B into HEX strings
- return HTML formatted string "#RRGGBB"

**Kind**: global function  
<a name="union"></a>

## union(objects) ⇒ <code>CSG</code>
union/ combine the given shapes

**Kind**: global function  
**Returns**: <code>CSG</code> - new CSG object, the union of all input shapes  

| Param | Type | Description |
| --- | --- | --- |
| objects | <code>Object(s)</code> \| <code>Array</code> | objects to combine : can be given - one by one: union(a,b,c) or - as an array: union([a,b,c]) |

**Example**  
```js
let unionOfSpherAndCube = union(sphere(), cube())
```
<a name="difference"></a>

## difference(objects) ⇒ <code>CSG</code>
difference/ subtraction of the given shapes ie:
cut out C From B From A ie : a - b - c etc

**Kind**: global function  
**Returns**: <code>CSG</code> - new CSG object, the difference of all input shapes  

| Param | Type | Description |
| --- | --- | --- |
| objects | <code>Object(s)</code> \| <code>Array</code> | objects to subtract can be given - one by one: difference(a,b,c) or - as an array: difference([a,b,c]) |

**Example**  
```js
let differenceOfSpherAndCube = difference(sphere(), cube())
```
<a name="intersection"></a>

## intersection(objects) ⇒ <code>CSG</code>
intersection of the given shapes: ie keep only the common parts between the given shapes

**Kind**: global function  
**Returns**: <code>CSG</code> - new CSG object, the intersection of all input shapes  

| Param | Type | Description |
| --- | --- | --- |
| objects | <code>Object(s)</code> \| <code>Array</code> | objects to intersect can be given - one by one: intersection(a,b,c) or - as an array: intersection([a,b,c]) |

**Example**  
```js
let intersectionOfSpherAndCube = intersection(sphere(), cube())
```
<a name="linear_extrude"></a>

## linear_extrude([options], baseShape) ⇒ <code>CSG</code>
linear extrusion of the input 2d shape

**Kind**: global function  
**Returns**: <code>CSG</code> - new extruded shape  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | options for construction |
| [options.height] | <code>Float</code> | <code>1</code> | height of the extruded shape |
| [options.slices] | <code>Integer</code> | <code>10</code> | number of intermediary steps/slices |
| [options.twist] | <code>Integer</code> | <code>0</code> | angle (in degrees to twist the extusion by) |
| [options.center] | <code>Boolean</code> | <code>false</code> | whether to center extrusion or not |
| baseShape | <code>CAG</code> |  | input 2d shape |

**Example**  
```js
let revolved = linear_extrude({height: 10}, square())
```
<a name="rotate_extrude"></a>

## rotate_extrude([options], baseShape) ⇒ <code>CSG</code>
rotate extrusion / revolve of the given 2d shape

**Kind**: global function  
**Returns**: <code>CSG</code> - new extruded shape  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | options for construction |
| [options.fn] | <code>Integer</code> | <code>1</code> | resolution/number of segments of the extrusion |
| [options.startAngle] | <code>Float</code> | <code>1</code> | start angle of the extrusion, in degrees |
| [options.angle] | <code>Float</code> | <code>1</code> | angle of the extrusion, in degrees |
| [options.overflow] | <code>Float</code> | <code>&#x27;cap&#x27;</code> | what to do with points outside of bounds (+ / - x) : defaults to capping those points to 0 (only supported behaviour for now) |
| baseShape | <code>CAG</code> |  | input 2d shape |

**Example**  
```js
let revolved = rotate_extrude({fn: 10}, square())
```
<a name="rectangular_extrude"></a>

## rectangular_extrude(basePoints, [options]) ⇒ <code>CSG</code>
rectangular extrusion of the given array of points

**Kind**: global function  
**Returns**: <code>CSG</code> - new extruded shape  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| basePoints | <code>Array</code> |  | array of points (nested) to extrude from layed out like [ [0,0], [10,0], [5,10], [0,10] ] |
| [options] | <code>Object</code> |  | options for construction |
| [options.h] | <code>Float</code> | <code>1</code> | height of the extruded shape |
| [options.w] | <code>Float</code> | <code>10</code> | width of the extruded shape |
| [options.fn] | <code>Integer</code> | <code>1</code> | resolution/number of segments of the extrusion |
| [options.closed] | <code>Boolean</code> | <code>false</code> | whether to close the input path for the extrusion or not |
| [options.round] | <code>Boolean</code> | <code>true</code> | whether to round the extrusion or not |

**Example**  
```js
let revolved = rectangular_extrude({height: 10}, square())
```
<a name="translate"></a>

## translate(vector, ...objects) ⇒ <code>CSG</code>
translate an object in 2D/3D space

**Kind**: global function  
**Returns**: <code>CSG</code> - new CSG object , translated by the given amount  

| Param | Type | Description |
| --- | --- | --- |
| vector | <code>Object</code> | 3D vector to translate the given object(s) by |
| ...objects | <code>Object(s)</code> \| <code>Array</code> | either a single or multiple CSG/CAG objects to translate |

**Example**  
```js
let movedSphere = translate([10,2,0], sphere())
```
<a name="scale"></a>

## scale(scale, ...objects) ⇒ <code>CSG</code>
scale an object in 2D/3D space

**Kind**: global function  
**Returns**: <code>CSG</code> - new CSG object , scaled by the given amount  

| Param | Type | Description |
| --- | --- | --- |
| scale | <code>Float</code> \| <code>Array</code> | either an array or simple number to scale object(s) by |
| ...objects | <code>Object(s)</code> \| <code>Array</code> | either a single or multiple CSG/CAG objects to scale |

**Example**  
```js
let scaledSphere = scale([0.2,15,1], sphere())
```
<a name="rotate"></a>

## rotate(rotation, objects) ⇒ <code>CSG</code>
rotate an object in 2D/3D space

**Kind**: global function  
**Returns**: <code>CSG</code> - new CSG object , rotated by the given amount  

| Param | Type | Description |
| --- | --- | --- |
| rotation | <code>Float</code> \| <code>Array</code> | either an array or simple number to rotate object(s) by |
| objects | <code>Object(s)</code> \| <code>Array</code> | either a single or multiple CSG/CAG objects to rotate |

**Example**  
```js
let rotatedSphere = rotate([0.2,15,1], sphere())
```
<a name="transform"></a>

## transform(matrix, ...objects) ⇒ <code>CSG</code>
apply the given matrix transform to the given objects

**Kind**: global function  
**Returns**: <code>CSG</code> - new CSG object , transformed  

| Param | Type | Description |
| --- | --- | --- |
| matrix | <code>Array</code> | the 4x4 matrix to apply, as a simple 1d array of 16 elements |
| ...objects | <code>Object(s)</code> \| <code>Array</code> | either a single or multiple CSG/CAG objects to transform |

**Example**  
```js
const angle = 45
let transformedShape = transform([
cos(angle), -sin(angle), 0, 10,
sin(angle),  cos(angle), 0, 20,
0         ,           0, 1, 30,
0,           0, 0,  1
], sphere())
```
<a name="center"></a>

## center(axis, ...objects) ⇒ <code>CSG</code>
center an object in 2D/3D space

**Kind**: global function  
**Returns**: <code>CSG</code> - new CSG object , translated by the given amount  

| Param | Type | Description |
| --- | --- | --- |
| axis | <code>Boolean</code> \| <code>Array</code> | either an array or single boolean to indicate which axis you want to center on |
| ...objects | <code>Object(s)</code> \| <code>Array</code> | either a single or multiple CSG/CAG objects to translate |

**Example**  
```js
let movedSphere = center(false, sphere())
```
<a name="mirror"></a>

## mirror(vector, ...objects) ⇒ <code>CSG</code>
mirror an object in 2D/3D space

**Kind**: global function  
**Returns**: <code>CSG</code> - new CSG object , mirrored  

| Param | Type | Description |
| --- | --- | --- |
| vector | <code>Array</code> | the axes to mirror the object(s) by |
| ...objects | <code>Object(s)</code> \| <code>Array</code> | either a single or multiple CSG/CAG objects to mirror |

**Example**  
```js
let rotatedSphere = mirror([0.2,15,1], sphere())
```
<a name="expand"></a>

## expand(radius, object) ⇒ <code>CSG/CAG</code>
expand an object in 2D/3D space

**Kind**: global function  
**Returns**: <code>CSG/CAG</code> - new CSG/CAG object , expanded  

| Param | Type | Description |
| --- | --- | --- |
| radius | <code>float</code> | the radius to expand by |
| object | <code>Object</code> | a CSG/CAG objects to expand |

**Example**  
```js
let expanededShape = expand([0.2,15,1], sphere())
```
<a name="contract"></a>

## contract(radius, object) ⇒ <code>CSG/CAG</code>
contract an object(s) in 2D/3D space

**Kind**: global function  
**Returns**: <code>CSG/CAG</code> - new CSG/CAG object , contracted  

| Param | Type | Description |
| --- | --- | --- |
| radius | <code>float</code> | the radius to contract by |
| object | <code>Object</code> | a CSG/CAG objects to contract |

**Example**  
```js
let contractedShape = contract([0.2,15,1], sphere())
```
<a name="minkowski"></a>

## minkowski(objects) ⇒ <code>CSG</code>
create a minkowski sum of the given shapes

**Kind**: global function  
**Returns**: <code>CSG</code> - new CSG object , mirrored  

| Param | Type | Description |
| --- | --- | --- |
| objects | <code>Object(s)</code> \| <code>Array</code> | either a single or multiple CSG/CAG objects to create a hull around |

**Example**  
```js
let hulled = hull(rect(), circle())
```
<a name="hull"></a>

## hull(objects) ⇒ <code>CSG</code>
create a convex hull of the given shapes

**Kind**: global function  
**Returns**: <code>CSG</code> - new CSG object , a hull around the given shapes  

| Param | Type | Description |
| --- | --- | --- |
| objects | <code>Object(s)</code> \| <code>Array</code> | either a single or multiple CSG/CAG objects to create a hull around |

**Example**  
```js
let hulled = hull(rect(), circle())
```
<a name="chain_hull"></a>

## chain_hull(objects) ⇒ <code>CSG</code>
create a chain hull of the given shapes
Originally "Whosa whatsis" suggested "Chain Hull" ,
as described at https://plus.google.com/u/0/105535247347788377245/posts/aZGXKFX1ACN
essentially hull A+B, B+C, C+D and then union those

**Kind**: global function  
**Returns**: <code>CSG</code> - new CSG object ,which a chain hull of the inputs  

| Param | Type | Description |
| --- | --- | --- |
| objects | <code>Object(s)</code> \| <code>Array</code> | either a single or multiple CSG/CAG objects to create a chain hull around |

**Example**  
```js
let hulled = chain_hull(rect(), circle())
```
<a name="square"></a>

## square([options]) ⇒ <code>CAG</code>
Construct a square/rectangle

**Kind**: global function  
**Returns**: <code>CAG</code> - new square  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | options for construction |
| [options.size] | <code>Float</code> | <code>1</code> | size of the square, either as array or scalar |
| [options.center] | <code>Boolean</code> | <code>true</code> | wether to center the square/rectangle or not |

**Example**  
```js
let square1 = square({
  size: 10
})
```
<a name="circle"></a>

## circle([options]) ⇒ <code>CAG</code>
Construct a circle

**Kind**: global function  
**Returns**: <code>CAG</code> - new circle  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | options for construction |
| [options.r] | <code>Float</code> | <code>1</code> | radius of the circle |
| [options.fn] | <code>Integer</code> | <code>32</code> | segments of circle (ie quality/ resolution) |
| [options.center] | <code>Boolean</code> | <code>true</code> | wether to center the circle or not |

**Example**  
```js
let circle1 = circle({
  r: 10
})
```
<a name="polygon"></a>

## polygon([options]) ⇒ <code>CAG</code>
Construct a polygon either from arrays of paths and points, or just arrays of points
nested paths (multiple paths) and flat paths are supported

**Kind**: global function  
**Returns**: <code>CAG</code> - new polygon  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | options for construction |
| [options.paths] | <code>Array</code> | paths of the polygon : either flat or nested array |
| [options.points] | <code>Array</code> | points of the polygon : either flat or nested array |

**Example**  
```js
let poly = polygon([0,1,2,3,4])
or 
let poly = polygon({path: [0,1,2,3,4]})
or 
let poly = polygon({path: [0,1,2,3,4], points: [2,1,3]})
```
<a name="triangle"></a>

## triangle() ⇒ <code>CAG</code>
Construct a triangle

**Kind**: global function  
**Returns**: <code>CAG</code> - new triangle  
**Example**  
```js
let triangle = trangle({
  length: 10
})
```
<a name="cube"></a>

## cube([options]) ⇒ <code>CSG</code>
Construct a cuboid

**Kind**: global function  
**Returns**: <code>CSG</code> - new sphere  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | options for construction |
| [options.size] | <code>Float</code> | <code>1</code> | size of the side of the cuboid : can be either: - a scalar : ie a single float, in which case all dimensions will be the same - or an array: to specify different dimensions along x/y/z |
| [options.fn] | <code>Integer</code> | <code>32</code> | segments of the sphere (ie quality/resolution) |
| [options.fno] | <code>Integer</code> | <code>32</code> | segments of extrusion (ie quality) |
| [options.type] | <code>String</code> | <code>&#x27;normal&#x27;</code> | type of sphere : either 'normal' or 'geodesic' |

**Example**  
```js
let cube1 = cube({
  r: 10,
  fn: 20
})
```
<a name="sphere"></a>

## sphere([options]) ⇒ <code>CSG</code>
Construct a sphere

**Kind**: global function  
**Returns**: <code>CSG</code> - new sphere  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | options for construction |
| [options.r] | <code>Float</code> | <code>1</code> | radius of the sphere |
| [options.fn] | <code>Integer</code> | <code>32</code> | segments of the sphere (ie quality/resolution) |
| [options.fno] | <code>Integer</code> | <code>32</code> | segments of extrusion (ie quality) |
| [options.type] | <code>String</code> | <code>&#x27;normal&#x27;</code> | type of sphere : either 'normal' or 'geodesic' |

**Example**  
```js
let sphere1 = sphere({
  r: 10,
  fn: 20
})
```
<a name="cylinder"></a>

## cylinder([options]) ⇒ <code>CSG</code>
Construct a cylinder

**Kind**: global function  
**Returns**: <code>CSG</code> - new cylinder  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | options for construction |
| [options.r] | <code>Float</code> | <code>1</code> | radius of the cylinder |
| [options.r1] | <code>Float</code> | <code>1</code> | radius of the top of the cylinder |
| [options.r2] | <code>Float</code> | <code>1</code> | radius of the bottom of the cylinder |
| [options.d] | <code>Float</code> | <code>1</code> | diameter of the cylinder |
| [options.d1] | <code>Float</code> | <code>1</code> | diameter of the top of the cylinder |
| [options.d2] | <code>Float</code> | <code>1</code> | diameter of the bottom of the cylinder |
| [options.fn] | <code>Integer</code> | <code>32</code> | number of sides of the cylinder (ie quality/resolution) |

**Example**  
```js
let cylinder = cylinder({
  d: 10,
  fn: 20
})
```
<a name="torus"></a>

## torus([options]) ⇒ <code>CSG</code>
Construct a torus

**Kind**: global function  
**Returns**: <code>CSG</code> - new torus  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | options for construction |
| [options.ri] | <code>Float</code> | <code>1</code> | radius of base circle |
| [options.ro] | <code>Float</code> | <code>4</code> | radius offset |
| [options.fni] | <code>Integer</code> | <code>16</code> | segments of base circle (ie quality) |
| [options.fno] | <code>Integer</code> | <code>32</code> | segments of extrusion (ie quality) |
| [options.roti] | <code>Integer</code> | <code>0</code> | rotation angle of base circle |

**Example**  
```js
let torus1 = torus({
  ri: 10
})
```
<a name="polyhedron"></a>

## polyhedron([options]) ⇒ <code>CSG</code>
Construct a polyhedron from the given triangles/ polygons/points

**Kind**: global function  
**Returns**: <code>CSG</code> - new polyhedron  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | options for construction |
| [options.triangles] | <code>Array</code> | triangles to build the polyhedron from |
| [options.polygons] | <code>Array</code> | polygons to build the polyhedron from |
| [options.points] | <code>Array</code> | points to build the polyhedron from |
| [options.colors] | <code>Array</code> | colors to apply to the polyhedron |

**Example**  
```js
let torus1 = polyhedron({
  points: [...]
})
```
<a name="vector_char"></a>

## vector_char(x, y, char) ⇒ <code>Object</code>
Construct a with, segments tupple from a character

**Kind**: global function  
**Returns**: <code>Object</code> - { width: X, segments: [...] }  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Float</code> | x offset |
| y | <code>Float</code> | y offset |
| char | <code>Float</code> | character |

**Example**  
```js
let charData = vector_char(0, 12.2, 'b')
```
<a name="vector_text"></a>

## vector_text(x, y, string) ⇒ <code>Array</code>
Construct an array of with, segments tupple from a string

**Kind**: global function  
**Returns**: <code>Array</code> - [{ width: X, segments: [...] }]  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Float</code> | x offset |
| y | <code>Float</code> | y offset |
| string | <code>Float</code> | string |

**Example**  
```js
let stringData = vector_text(0, 12.2, 'b')
```
