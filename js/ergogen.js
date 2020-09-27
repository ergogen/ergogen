/*!
 * ergogen v1.0.0
 * https://zealot.hu/ergogen
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('makerjs')) :
	typeof define === 'function' && define.amd ? define(['makerjs'], factory) :
	(global = global || self, global.ergogen = factory(global.makerjs));
}(this, (function (makerjs) { 'use strict';

	makerjs = makerjs && Object.prototype.hasOwnProperty.call(makerjs, 'default') ? makerjs['default'] : makerjs;

	function createCommonjsModule(fn, basedir, module) {
		return module = {
		  path: basedir,
		  exports: {},
		  require: function (path, base) {
	      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
	    }
		}, fn(module, module.exports), module.exports;
	}

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
	}

	var utils = createCommonjsModule(function (module, exports) {
	exports.deepcopy = (value) => JSON.parse(JSON.stringify(value));

	const eq = exports.eq = (a=[], b=[]) => {
	    return a[0] === b[0] && a[1] === b[1]
	};

	const line = exports.line = (a, b) => {
	    return new makerjs.paths.Line(a, b)
	};

	exports.circle = (p, r) => {
	    return {paths: {circle: new makerjs.paths.Circle(p, r)}}
	};

	exports.rect = (w, h, o=[0, 0]) => {
	    const res = {
	        top:    line([0, h], [w, h]),
	        right:  line([w, h], [w, 0]),
	        bottom: line([w, 0], [0, 0]),
	        left:   line([0, 0], [0, h])
	    };
	    return makerjs.model.move({paths: res}, o)
	};

	exports.poly = (arr) => {
	    let counter = 0;
	    let prev = arr[arr.length - 1];
	    const res = {
	        paths: {}
	    };
	    for (const p of arr) {
	        if (eq(prev, p)) continue
	        res.paths['p' + (++counter)] = line(prev, p);
	        prev = p;
	    }
	    return res
	};

	const farPoint = [1234.1234, 2143.56789];

	exports.union = (a, b) => {
	    return makerjs.model.combine(a, b, false, true, false, true, {
	        farPoint
	    })
	};

	exports.subtract = (a, b) => {
	    return makerjs.model.combine(a, b, false, true, true, false, {
	        farPoint
	    })
	};

	exports.intersect = (a, b) => {
	    return makerjs.model.combine(a, b, true, false, true, false, {
	        farPoint
	    })
	};

	exports.stack = (a, b) => {
	    return {
	        models: {
	            a, b
	        }
	    }
	};
	});

	var point = class Point {
	    constructor(x=0, y=0, r=0, meta={}) {
	        if (Array.isArray(x)) {
	            this.x = x[0];
	            this.y = x[1];
	            this.r = 0;
	            this.meta = {};
	        } else {
	            this.x = x;
	            this.y = y;
	            this.r = r;
	            this.meta = meta;
	        }
	    }

	    get p() {
	        return [this.x, this.y]
	    }

	    set p(val) {
	        [this.x, this.y] = val;
	    }

	    shift(s, relative=true) {
	        if (relative) {
	            s = makerjs.point.rotate(s, this.r);
	        }
	        this.x += s[0];
	        this.y += s[1];
	        return this
	    }

	    rotate(angle, origin=[0, 0]) {
	        this.p = makerjs.point.rotate(this.p, angle, origin);
	        this.r += angle;
	        return this
	    }

	    mirror(x) {
	        this.x = 2 * x - this.x;
	        this.r = -this.r;
	        return this
	    }

	    clone() {
	        return new Point(
	            this.x,
	            this.y,
	            this.r,
	            utils.deepcopy(this.meta)
	        )
	    }

	    position(model) {
	        return makerjs.model.moveRelative(makerjs.model.rotate(model, this.r), this.p)
	    }

	    rect(size=14) {
	        let rect = utils.rect(size, size, [-size/2, -size/2], this.meta.mirrored);
	        return this.position(rect)
	    }
	};

	var assert_1 = createCommonjsModule(function (module, exports) {
	const assert = exports.assert = (exp, msg) => {
	    if (!exp) {
	        throw new Error(msg)
	    }
	};

	const type = exports.type = (val) => {
	    if (Array.isArray(val)) return 'array'
	    if (val === null) return 'null'
	    return typeof val
	};

	const sane = exports.sane = (val, name, _type) => {
	    assert(type(val) == _type, `Field "${name}" should be of type ${_type}!`);
	    return val
	};

	const detect_unexpected = exports.detect_unexpected = (obj, name, expected) => {
	    const sane_obj = sane(obj, name, 'object');
	    for (const key of Object.keys(sane_obj)) {
	        assert(expected.includes(key), `Unexpected key "${key}" within field "${name}"!`);
	    }
	};

	const _in = exports.in = (raw, name, arr) => {
	    assert(arr.includes(raw), `Field "${name}" should be one of [${arr.join(', ')}]!`);
	    return raw
	};

	const arr = exports.arr = (raw, name, length, _type, _default) => {
	    assert(type(raw) == 'array', `Field "${name}" should be an array!`);
	    assert(length == 0 || raw.length == length, `Field "${name}" should be an array of length ${length}!`);
	    raw = raw.map(val => val || _default);
	    raw.map(val => assert(type(val) == _type, `Field "${name}" should contain ${_type}s!`));
	    return raw
	};

	const numarr = exports.numarr = (raw, name, length) => arr(raw, name, length, 'number', 0);
	const strarr = exports.strarr = (raw, name) => arr(raw, name, 0, 'string', '');

	const xy = exports.xy = (raw, name) => numarr(raw, name, 2);

	const wh = exports.wh = (raw, name) => {
	    if (!Array.isArray(raw)) raw = [raw, raw];
	    return xy(raw, name)
	};

	exports.trbl = (raw, name) => {
	    if (!Array.isArray(raw)) raw = [raw, raw, raw, raw];
	    if (raw.length == 2) raw = [raw[1], raw[0], raw[1], raw[0]];
	    return numarr(raw, name, 4)
	};

	const anchor = exports.anchor = (raw, name, points={}, check_unexpected=true, default_point=new point()) => {
	    if (type(raw) == 'array') {
	        // recursive call with incremental default_point mods, according to `affect`s
	        let current = default_point.clone();
	        for (const step of raw) {
	            current = anchor(step, name, points, check_unexpected, current);
	        }
	        return current
	    }
	    if (check_unexpected) detect_unexpected(raw, name, ['ref', 'orient', 'shift', 'rotate', 'affect']);
	    let point$1 = default_point.clone();
	    if (raw.ref !== undefined) {
	        if (type(raw.ref) == 'array') {
	            // averaging multiple anchors
	            let x = 0, y = 0, r = 0;
	            const len = raw.ref.length;
	            for (const ref of raw.ref) {
	                assert(points[ref], `Unknown point reference "${ref}" in anchor "${name}"!`);
	                const resolved = points[ref];
	                x += resolved.x;
	                y += resolved.y;
	                r += resolved.r;
	            }
	            point$1 = new point(x / len, y / len, r / len);
	        } else {
	            assert(points[raw.ref], `Unknown point reference "${raw.ref}" in anchor "${name}"!`);
	            point$1 = points[raw.ref].clone();
	        }
	    }
	    if (raw.orient !== undefined) {
	        point$1.r += sane(raw.orient || 0, `${name}.orient`, 'number');
	    }
	    if (raw.shift !== undefined) {
	        let xyval = wh(raw.shift || [0, 0], `${name}.shift`);
	        if (point$1.meta.mirrored) {
	            xyval[0] = -xyval[0];
	        }
	        point$1.shift(xyval, true);
	    }
	    if (raw.rotate !== undefined) {
	        point$1.r += sane(raw.rotate || 0, `${name}.rotate`, 'number');
	    }
	    if (raw.affect !== undefined) {
	        const candidate = point$1;
	        point$1 = default_point.clone();
	        const valid_affects = ['x', 'y', 'r'];
	        let affect = raw.affect || valid_affects;
	        if (type(affect) == 'string') affect = affect.split('');
	        affect = strarr(affect, `${name}.affect`);
	        let i = 0;
	        for (const a of affect) {
	            _in(a, `${name}.affect[${++i}]`, valid_affects);
	            point$1[a] = candidate[a];
	        }
	    }
	    return point$1
	};

	const extend_pair = exports.extend_pair = (to, from) => {
	    const to_type = type(to);
	    const from_type = type(from);
	    if (from === undefined || from === null) return to
	    if (from === '!!unset') return undefined
	    if (to_type != from_type) return from
	    if (from_type == 'object') {
	        const res = utils.deepcopy(to);
	        for (const key of Object.keys(from)) {
	            res[key] = extend_pair(to[key], from[key]);
	            if (res[key] === undefined) delete res[key];
	        }
	        return res
	    } else if (from_type == 'array') {
	        const res = utils.deepcopy(to);
	        for (const [i, val] of from.entries()) {
	            res[i] = extend_pair(res[i], val);
	        }
	        return res
	    } else return from
	};

	const extend = exports.extend = (...args) => {
	    let res = args[0];
	    for (const arg of args) {
	        if (res == arg) continue
	        res = extend_pair(res, arg);
	    }
	    return res
	};

	const inherit = exports.inherit = (name_prefix, name, set) => {
	    let result = utils.deepcopy(set[name]);
	    if (result.extends !== undefined) {
	        let candidates = [name];
	        const list = [];
	        while (candidates.length) {
	            const item = candidates.shift();
	            const other = utils.deepcopy(set[item]);
	            assert(other, `"${item}" (reached from "${name_prefix}.${name}.extends") does not name a valid target!`);
	            let parents = other.extends || [];
	            if (type(parents) !== 'array') parents = [parents];
	            candidates = candidates.concat(parents);
	            delete other.extends;
	            list.unshift(other);
	        }
	        result = extend.apply(this, list);
	    }
	    return result
	};
	});

	var points = createCommonjsModule(function (module, exports) {
	const push_rotation = exports._push_rotation = (list, angle, origin) => {
	    let candidate = origin;
	    for (const r of list) {
	        candidate = makerjs.point.rotate(candidate, r.angle, r.origin);
	    }
	    list.push({
	        angle: angle,
	        origin: candidate
	    });
	};

	const render_zone = exports._render_zone = (zone_name, zone, anchor, global_key) => {

	    // zone-wide sanitization

	    assert_1.detect_unexpected(zone, `points.zones.${zone_name}`, ['columns', 'rows', 'key']);
	    // the anchor comes from "above", because it needs other zones too (for references)
	    const cols = assert_1.sane(zone.columns || {}, `points.zones.${zone_name}.columns`, 'object');
	    const zone_wide_rows = assert_1.sane(zone.rows || {}, `points.zones.${zone_name}.rows`, 'object');
	    for (const [key, val] of Object.entries(zone_wide_rows)) {
	        zone_wide_rows[key] = assert_1.sane(val || {}, `points.zones.${zone_name}.rows.${key}`, 'object');
	    }
	    const zone_wide_key = assert_1.sane(zone.key || {}, `points.zones.${zone_name}.key`, 'object');

	    // algorithm prep

	    const points = {};
	    const rotations = [];
	    // transferring the anchor rotation to "real" rotations
	    rotations.push({
	        angle: anchor.r,
	        origin: anchor.p
	    });

	    // column layout

	    let first_col = true;
	    for (let [col_name, col] of Object.entries(cols)) {

	        // column-level sanitization

	        col = col || {};

	        assert_1.detect_unexpected(
	            col,
	            `points.zones.${zone_name}.columns.${col_name}`,
	            ['stagger', 'spread', 'rotate', 'origin', 'rows', 'row_overrides', 'key']
	        );
	        col.stagger = assert_1.sane(
	            col.stagger || 0,
	            `points.zones.${zone_name}.columns.${col_name}.stagger`,
	            'number'
	        );
	        col.spread = assert_1.sane(
	            col.spread || (first_col ? 0 : 19),
	            `points.zones.${zone_name}.columns.${col_name}.spread`,
	            'number'
	        );
	        col.rotate = assert_1.sane(
	            col.rotate || 0,
	            `points.zones.${zone_name}.columns.${col_name}.rotate`,
	            'number'
	        );
	        col.origin = assert_1.xy(
	            col.origin || [0, 0],
	            `points.zones.${zone_name}.columns.${col_name}.origin`,
	        );
	        let override = false;
	        col.rows = assert_1.sane(
	            col.rows || {},
	            `points.zones.${zone_name}.columns.${col_name}.rows`,
	            'object'
	        );
	        if (col.row_overrides) {
	            override = true;
	            col.rows = assert_1.sane(
	                col.row_overrides,
	                `points.zones.${zone_name}.columns.${col_name}.row_overrides`,
	                'object'
	            );
	        }
	        for (const [key, val] of Object.entries(col.rows)) {
	            col.rows[key] = assert_1.sane(
	                val || {},
	                `points.zones.${zone_name}.columns.${col_name}.rows.${key}`,
	                'object'
	            );
	        }
	        col.key = assert_1.sane(
	            col.key || {},
	            `points.zones.${zone_name}.columns.${col_name}.key`,
	            'object'
	        );

	        // propagating object key to name field

	        col.name = col_name;

	        // combining row data from zone-wide defs and col-specific defs
	        // (while also handling potential overrides)

	        const actual_rows = override ? Object.keys(col.rows)
	            : Object.keys(assert_1.extend(zone_wide_rows, col.rows));
	        if (!actual_rows.length) {
	            actual_rows.push('default');
	        }

	        // setting up column-level anchor

	        anchor.x += col.spread;
	        anchor.y += col.stagger;
	        const col_anchor = anchor.clone();
	        // clear potential rotations, as they will get re-applied anyway
	        // and we don't want to apply them twice...
	        col_anchor.r = 0;

	        // applying col-level rotation (cumulatively, for the next columns as well)

	        if (col.rotate) {
	            push_rotation(
	                rotations,
	                col.rotate,
	                col_anchor.clone().shift(col.origin, false).p
	            );
	        }

	        // getting key config through the 5-level extension

	        const keys = [];
	        const default_key = {
	            shift: [0, 0],
	            rotate: 0,
	            padding: 19,
	            width: 1,
	            height: 1,
	            skip: false,
	            asym: 'both'
	        };
	        for (const row of actual_rows) {
	            const key = assert_1.extend(
	                default_key,
	                global_key,
	                zone_wide_key,
	                col.key,
	                zone_wide_rows[row] || {},
	                col.rows[row] || {}
	            );

	            key.name = key.name || `${zone_name}_${col_name}_${row}`;
	            key.colrow = `${col_name}_${row}`;
	            key.shift = assert_1.xy(key.shift, `${key.name}.shift`);
	            key.rotate = assert_1.sane(key.rotate, `${key.name}.rotate`, 'number');
	            key.width = assert_1.sane(key.width, `${key.name}.width`, 'number');
	            key.height = assert_1.sane(key.height, `${key.name}.height`, 'number');
	            key.padding = assert_1.sane(key.padding, `${key.name}.padding`, 'number');
	            key.skip = assert_1.sane(key.skip, `${key.name}.skip`, 'boolean');
	            key.asym = assert_1.in(key.asym, `${key.name}.asym`, ['left', 'right', 'both']);
	            key.col = col;
	            key.row = row;
	            keys.push(key);
	        }

	        // actually laying out keys

	        for (const key of keys) {
	            let point = col_anchor.clone();
	            for (const r of rotations) {
	                point.rotate(r.angle, r.origin);
	            }
	            point.shift(key.shift);
	            point.r += key.rotate;
	            point.meta = key;
	            points[key.name] = point;
	            col_anchor.y += key.padding;
	        }

	        first_col = false;
	    }

	    return points
	};

	const parse_axis = exports._parse_axis = (config, name, points) => {
	    if (!['number', 'undefined'].includes(assert_1.type(config))) {
	        const mirror_obj = assert_1.sane(config || {}, name, 'object');
	        const distance = assert_1.sane(mirror_obj.distance || 0, `${name}.distance`, 'number');
	        delete mirror_obj.distance;
	        let axis = assert_1.anchor(mirror_obj, name, points).x;
	        axis += distance / 2;
	        return axis
	    } else return config
	};

	const perform_mirror = exports._perform_mirror = (point, axis) => {
	    if (axis !== undefined) {
	        point.meta.mirrored = false;
	        if (point.meta.asym == 'left') return ['', null]
	        const mp = point.clone().mirror(axis);
	        const mirrored_name = `mirror_${point.meta.name}`;
	        mp.meta = assert_1.extend(mp.meta, mp.meta.mirror || {});
	        mp.meta.name = mirrored_name;
	        mp.meta.colrow = `mirror_${mp.meta.colrow}`;
	        mp.meta.mirrored = true;
	        if (point.meta.asym == 'right') {
	            point.meta.skip = true;
	        }
	        return [mirrored_name, mp]
	    }
	    return ['', null]
	};

	exports.parse = (config = {}) => {

	    // config sanitization
	    assert_1.detect_unexpected(config, 'points', ['zones', 'key', 'rotate', 'mirror']);
	    const zones = assert_1.sane(config.zones || {}, 'points.zones', 'object');
	    const global_key = assert_1.sane(config.key || {}, 'points.key', 'object');
	    const global_rotate = assert_1.sane(config.rotate || 0, 'points.rotate', 'number');
	    const global_mirror = config.mirror;
	    let points = {};
	    let mirrored_points = {};
	    let all_points = {};

	    // rendering zones
	    for (let [zone_name, zone] of Object.entries(zones)) {

	        // handle zone-level `extends` clauses
	        zone = assert_1.inherit('points.zones', zone_name, zones);

	        // extracting keys that are handled here, not at the zone render level
	        const anchor = assert_1.anchor(zone.anchor || {}, `points.zones.${zone_name}.anchor`, all_points);
	        const rotate = assert_1.sane(zone.rotate || 0, `points.zones.${zone_name}.rotate`, 'number');
	        const mirror = zone.mirror;
	        delete zone.anchor;
	        delete zone.rotate;
	        delete zone.mirror;

	        // creating new points
	        const new_points = render_zone(zone_name, zone, anchor, global_key);

	        // adjusting new points
	        for (const [new_name, new_point] of Object.entries(new_points)) {
	            
	            // issuing a warning for duplicate keys
	            if (Object.keys(points).includes(new_name)) {
	                throw new Error(`Key "${new_name}" defined more than once!`)
	            }

	            // per-zone rotation
	            if (rotate) {
	                new_point.rotate(rotate);
	            }
	        }

	        // adding new points so that they can be referenced from now on
	        points = Object.assign(points, new_points);
	        all_points = Object.assign(all_points, points);

	        // per-zone mirroring for the new keys
	        const axis = parse_axis(mirror, `points.zones.${zone_name}.mirror`, all_points);
	        if (axis) {
	            for (const new_point of Object.values(new_points)) {
	                const [mname, mp] = perform_mirror(new_point, axis);
	                if (mp) {
	                    mirrored_points[mname] = mp;
	                    all_points[mname] = mp;
	                }
	            }
	        }
	    }

	    // merging regular and early-mirrored points
	    points = Object.assign(points, mirrored_points);

	    // applying global rotation
	    for (const point of Object.values(points)) {
	        if (global_rotate) {
	            point.rotate(global_rotate);
	        }
	    }

	    // global mirroring for points that haven't been mirrored yet
	    const global_axis = parse_axis(global_mirror, `points.mirror`, points);
	    const global_mirrored_points = {};
	    for (const point of Object.values(points)) {
	        if (global_axis && point.mirrored === undefined) {
	            const [mname, mp] = perform_mirror(point, global_axis);
	            if (mp) {
	                global_mirrored_points[mname] = mp;
	            }
	        }
	    }

	    // merging the global-mirrored points as well
	    points = Object.assign(points, global_mirrored_points);

	    // removing temporary points
	    const filtered = {};
	    for (const [k, p] of Object.entries(points)) {
	        if (p.meta.skip) continue
	        filtered[k] = p;
	    }

	    // done
	    return filtered
	};

	exports.visualize = (points) => {
	    const models = {};
	    for (const [pname, p] of Object.entries(points)) {
	        const w = (p.meta.width * 19) - 1;
	        const h = (p.meta.height * 19) - 1;
	        const rect = utils.rect(w, h, [-w/2, -h/2]);
	        models[pname] = p.position(rect);
	    }
	    return {models: models}
	};
	});

	var outlines = createCommonjsModule(function (module, exports) {
	const rectangle = (w, h, corner, bevel, name='') => {
	    const error = (dim, val) => `Rectangle for "${name}" isn't ${dim} enough for its corner and bevel (${val} - 2 * ${corner} - 2 * ${bevel} <= 0)!`;
	    const mod = 2 * (corner + bevel);
	    const cw = w - mod;
	    assert_1.assert(cw >= 0, error('wide', w));
	    const ch = h - mod;
	    assert_1.assert(ch >= 0, error('tall', h));

	    let res = new makerjs.models.Rectangle(cw, ch);
	    if (bevel > 0) res = makerjs.model.outline(res, bevel, 2);
	    if (corner > 0) res = makerjs.model.outline(res, corner, 0);
	    return makerjs.model.moveRelative(res, [corner + bevel, corner + bevel])
	};

	const relative_anchor = (decl, name, points={}, check_unexpected=true, default_point=new point()) => {
	    decl.shift = assert_1.wh(decl.shift || [0, 0], name + '.shift');
	    const relative = assert_1.sane(decl.relative === undefined ? true : decl.relative, `${name}.relative`, 'boolean');
	    delete decl.relative;
	    if (relative) {
	        return size => {
	            const copy = utils.deepcopy(decl);
	            copy.shift = [copy.shift[0] * size[0], copy.shift[1] * size[1]];
	            return assert_1.anchor(copy, name, points, check_unexpected, default_point)
	        }
	    }
	    return () => assert_1.anchor(decl, name, points, check_unexpected, default_point)
	};

	const layout = exports._layout = (config = {}, points = {}) => {

	    // Glue config sanitization

	    const parsed_glue = utils.deepcopy(assert_1.sane(config, 'outlines.glue', 'object'));
	    for (let [gkey, gval] of Object.entries(parsed_glue)) {
	        gval = assert_1.inherit('outlines.glue', gkey, config);
	        assert_1.detect_unexpected(gval, `outlines.glue.${gkey}`, ['top', 'bottom', 'waypoints', 'extra']);
	    
	        for (const y of ['top', 'bottom']) {
	            assert_1.detect_unexpected(gval[y], `outlines.glue.${gkey}.${y}`, ['left', 'right']);
	            gval[y].left = relative_anchor(gval[y].left, `outlines.glue.${gkey}.${y}.left`, points);
	            if (assert_1.type(gval[y].right) != 'number') {
	                gval[y].right = relative_anchor(gval[y].right, `outlines.glue.${gkey}.${y}.right`, points);
	            }
	        }
	    
	        gval.waypoints = assert_1.sane(gval.waypoints || [], `outlines.glue.${gkey}.waypoints`, 'array');
	        let wi = 0;
	        gval.waypoints = gval.waypoints.map(w => {
	            const name = `outlines.glue.${gkey}.waypoints[${++wi}]`;
	            assert_1.detect_unexpected(w, name, ['percent', 'width']);
	            w.percent = assert_1.sane(w.percent, name + '.percent', 'number');
	            w.width = assert_1.wh(w.width, name + '.width');
	            return w
	        });

	        parsed_glue[gkey] = gval;
	    }


	    // TODO: handle glue.extra (or revoke it from the docs)

	    return (params, export_name, expected) => {

	        // Layout params sanitization

	        assert_1.detect_unexpected(params, `${export_name}`, expected.concat(['side', 'tags', 'glue', 'size', 'corner', 'bevel', 'bound']));
	        const side = assert_1.in(params.side, `${export_name}.side`, ['left', 'right', 'middle', 'both', 'glue']);
	        const tags = assert_1.sane(params.tags || [], `${export_name}.tags`, 'array');
	        const size = assert_1.wh(params.size, `${export_name}.size`);
	        const corner = assert_1.sane(params.corner || 0, `${export_name}.corner`, 'number');
	        const bevel = assert_1.sane(params.bevel || 0, `${export_name}.bevel`, 'number');
	        const bound = assert_1.sane(params.bound === undefined ? true : params.bound, `${export_name}.bound`, 'boolean');

	        // Actual layout

	        let left = {models: {}};
	        let right = {models: {}};
	        if (['left', 'right', 'middle', 'both'].includes(side)) {
	            for (const [pname, p] of Object.entries(points)) {

	                // filter by tags, if necessary
	                if (tags.length) {
	                    const source = p.meta.tags || {};
	                    const point_tags = Object.keys(source).filter(t => !!source[t]);
	                    const relevant = point_tags.some(pt => tags.includes(pt));
	                    if (!relevant) continue
	                }

	                let from_x = -size[0] / 2, to_x = size[0] / 2;
	                let from_y = -size[1] / 2, to_y = size[1] / 2;

	                // the original position
	                let rect = rectangle(to_x - from_x, to_y - from_y, corner, bevel, `${export_name}.size`);
	                rect = makerjs.model.moveRelative(rect, [from_x, from_y]);

	                // extra binding "material", if necessary
	                if (bound) {
	                    let bind = assert_1.trbl(p.meta.bind || 0, `${pname}.bind`);
	                    // if it's a mirrored key, we swap the left and right bind values
	                    if (p.meta.mirrored) {
	                        bind = [bind[0], bind[3], bind[2], bind[1]];
	                    }
	    
	                    const bt = to_y + Math.max(bind[0], 0);
	                    const br = to_x + Math.max(bind[1], 0);
	                    const bd = from_y - Math.max(bind[2], 0);
	                    const bl = from_x - Math.max(bind[3], 0);
	    
	                    if (bind[0] || bind[1]) rect = utils.union(rect, utils.rect(br, bt));
	                    if (bind[1] || bind[2]) rect = utils.union(rect, utils.rect(br, -bd, [0, bd]));
	                    if (bind[2] || bind[3]) rect = utils.union(rect, utils.rect(-bl, -bd, [bl, bd]));
	                    if (bind[3] || bind[0]) rect = utils.union(rect, utils.rect(-bl, bt, [bl, 0]));
	                }
	                
	                // positioning and unioning the resulting shape
	                rect = p.position(rect);
	                if (p.meta.mirrored) {
	                    right = utils.union(right, rect);
	                } else {
	                    left = utils.union(left, rect);
	                }
	            }
	        }
	        if (side == 'left') return left
	        if (side == 'right') return right

	        let glue = {models: {}};
	        if (bound && ['middle', 'both', 'glue'].includes(side)) {

	            const default_glue_name = Object.keys(parsed_glue)[0];
	            const glue_def = parsed_glue[assert_1.sane(params.glue || default_glue_name, `${export_name}.glue`, 'string')];
	            assert_1.assert(glue_def, `Field "${export_name}.glue" does not name a valid glue!`);

	            const get_line = (anchor) => {
	                if (assert_1.type(anchor) == 'number') {
	                    return utils.line([anchor, -1000], [anchor, 1000])
	                }

	                // if it wasn't a number, then it's a function returning an achor
	                // have to feed it `size` first in case it's relative
	                const from = anchor(size).clone();
	                const to = from.clone().shift([from.meta.mirrored ? -1 : 1, 0]);

	                return utils.line(from.p, to.p)
	            };

	            const tll = get_line(glue_def.top.left);
	            const trl = get_line(glue_def.top.right);
	            const tip = makerjs.path.converge(tll, trl);
	            const tlp = utils.eq(tll.origin, tip) ? tll.end : tll.origin;
	            const trp = utils.eq(trl.origin, tip) ? trl.end : trl.origin;
	    
	            const bll = get_line(glue_def.bottom.left);
	            const brl = get_line(glue_def.bottom.right);
	            const bip = makerjs.path.converge(bll, brl);
	            const blp = utils.eq(bll.origin, bip) ? bll.end : bll.origin;
	            const brp = utils.eq(brl.origin, bip) ? brl.end : brl.origin;
	    
	            const left_waypoints = [];
	            const right_waypoints = [];

	            for (const w of glue_def.waypoints) {
	                const percent = w.percent / 100;
	                const center_x = tip[0] + percent * (bip[0] - tip[0]);
	                const center_y = tip[1] + percent * (bip[1] - tip[1]);
	                const left_x = center_x - w.width[0];
	                const right_x = center_x + w.width[1];
	                left_waypoints.push([left_x, center_y]);
	                right_waypoints.unshift([right_x, center_y]);
	            }
	            
	            let waypoints;
	            const is_split = assert_1.type(glue_def.top.right) == 'number';
	            if (is_split) {
	                waypoints = [tip, tlp]
	                .concat(left_waypoints)
	                .concat([blp, bip]);
	            } else {
	                waypoints = [trp, tip, tlp]
	                .concat(left_waypoints)
	                .concat([blp, bip, brp])
	                .concat(right_waypoints);
	            }

	            glue = utils.poly(waypoints);
	        }
	        if (side == 'glue') return glue

	        if (side == 'middle') {
	            let middle = utils.subtract(glue, left);
	            middle = utils.subtract(middle, right);
	            return middle
	        }

	        let both = utils.union(utils.deepcopy(left), glue);
	        both = utils.union(both, utils.deepcopy(right));
	        return both
	    }
	};

	exports.parse = (config = {}, points = {}) => {
	    assert_1.detect_unexpected(config, 'outline', ['glue', 'exports']);
	    const layout_fn = layout(config.glue, points);

	    const outlines = {};

	    const ex = assert_1.sane(config.exports || {}, 'outlines.exports', 'object');
	    for (let [key, parts] of Object.entries(ex)) {
	        parts = assert_1.inherit('outlines.exports', key, ex);
	        let result = {models: {}};
	        for (const [part_name, part] of Object.entries(parts)) {
	            const name = `outlines.exports.${key}.${part_name}`;
	            const expected = ['type', 'operation'];
	            part.type = assert_1.in(part.type, `${name}.type`, ['keys', 'rectangle', 'circle', 'polygon', 'outline']);
	            part.operation = assert_1.in(part.operation || 'add', `${name}.operation`, ['add', 'subtract', 'intersect', 'stack']);

	            let op = utils.union;
	            if (part.operation == 'subtract') op = utils.subtract;
	            else if (part.operation == 'intersect') op = utils.intersect;
	            else if (part.operation == 'stack') op = utils.stack;

	            let arg;
	            let anchor;
	            switch (part.type) {
	                case 'keys':
	                    arg = layout_fn(part, name, expected);
	                    break
	                case 'rectangle':
	                    assert_1.detect_unexpected(part, name, expected.concat(['ref', 'shift', 'rotate', 'size', 'corner', 'bevel', 'mirror']));
	                    anchor = assert_1.anchor(part, name, points, false);
	                    const size = assert_1.wh(part.size, `${name}.size`);
	                    const corner = assert_1.sane(part.corner || 0, `${name}.corner`, 'number');
	                    const bevel = assert_1.sane(part.bevel || 0, `${name}.bevel`, 'number');
	                    const rect_mirror = assert_1.sane(part.mirror || false, `${name}.mirror`, 'boolean');
	                    const rect = rectangle(size[0], size[1], corner, bevel, name);
	                    arg = anchor.position(utils.deepcopy(rect));
	                    if (rect_mirror) {
	                        const mirror_part = utils.deepcopy(part);
	                        assert_1.assert(mirror_part.ref, `Field "${name}.ref" must be speficied if mirroring is required!`);
	                        mirror_part.ref = `mirror_${mirror_part.ref}`;
	                        anchor = assert_1.anchor(mirror_part, name, points, false);
	                        const mirror_rect = makerjs.model.moveRelative(utils.deepcopy(rect), [-size[0], 0]);
	                        arg = utils.union(arg, anchor.position(mirror_rect));
	                    }
	                    break
	                case 'circle':
	                    assert_1.detect_unexpected(part, name, expected.concat(['ref', 'shift', 'rotate', 'radius', 'mirror']));
	                    anchor = assert_1.anchor(part, name, points, false);
	                    const radius = assert_1.sane(part.radius, `${name}.radius`, 'number');
	                    const circle_mirror = assert_1.sane(part.mirror || false, `${name}.mirror`, 'boolean');
	                    arg = utils.circle(anchor.p, radius);
	                    if (circle_mirror) {
	                        const mirror_part = utils.deepcopy(part);
	                        assert_1.assert(mirror_part.ref, `Field "${name}.ref" must be speficied if mirroring is required!`);
	                        mirror_part.ref = `mirror_${mirror_part.ref}`;
	                        anchor = assert_1.anchor(mirror_part, name, points, false);
	                        arg = utils.union(arg, utils.circle(anchor.p, radius));
	                    }
	                    break
	                case 'polygon':
	                    assert_1.detect_unexpected(part, name, expected.concat(['points']));
	                    const poly_points = assert_1.sane(part.points, `${name}.points`, 'array');
	                    const parsed_points = [];
	                    let last_anchor = new point();
	                    let poly_index = 0;
	                    for (const poly_point of poly_points) {
	                        const poly_name = `${name}.points[${++poly_index}]`;
	                        const anchor = assert_1.anchor(poly_point, poly_name, points, true, last_anchor);
	                        parsed_points.push(anchor.p);
	                    }
	                    arg = utils.poly(parsed_points);
	                    break
	                case 'outline':
	                    assert_1.assert(outlines[part.name], `Field "${name}.name" does not name an existing outline!`);
	                    arg = utils.deepcopy(outlines[part.name]);
	                    break
	                default:
	                    throw new Error(`Field "${name}.type" (${part.type}) does not name a valid outline part type!`)
	            }

	            result = op(result, arg);
	        }

	        makerjs.model.originate(result);
	        makerjs.model.simplify(result);
	        outlines[key] = result;
	    }

	    return outlines
	};
	});

	var parse = (config, outlines) => {

	    const cases = assert_1.sane(config, 'cases', 'object');
	    const results = {};

	    for (const [case_name, case_config] of Object.entries(cases)) {

	        // config sanitization
	        const parts = assert_1.sane(case_config, `cases.${case_name}`, 'array');

	        const scripts = [];
	        const main = [];

	        let part_index = 0;
	        for (const part of parts) {
	            const part_name = `cases.${case_name}[${++part_index}]`;
	            assert_1.detect_unexpected(part, part_name, ['outline', 'extrude', 'shift', 'rotate', 'operation']);
	            const outline = outlines[part.outline];
	            assert_1.assert(outline, `Field ${part_name}.outline does not name a valid outline!`);
	            const extrude = assert_1.sane(part.extrude || 1, `${part_name}.extrude`, 'number');
	            const shift = assert_1.numarr(part.shift || [0, 0, 0], `${part_name}.shift`, 3);
	            const rotate = assert_1.numarr(part.rotate || [0, 0, 0], `${part_name}.rotate`, 3);
	            const operation = assert_1.in(part.operation || 'add', `${part_name}.operation`, ['add', 'subtract', 'intersect', 'stack']);

	            let op = utils.union;
	            if (operation == 'subtract') op = utils.subtract;
	            else if (operation == 'intersect') op = utils.intersect;
	            else if (operation == 'stack') op = utils.stack;

	            const part_fn = `${part.outline}_fn`;
	            const part_var = `${part.outline}_var`;

	            scripts.push(makerjs.exporter.toJscadScript(outline, {
	                functionName: part_fn,
	                extrude: extrude
	            }));

	            let op_statement = `let ${case_name} = ${part_var};`;
	            if (part_index > 1) {
	                op_statement = `${case_name} = ${case_name}.${operation}(${part_var});`;
	            }

	            main.push(`

                // creating part ${part_index} of case ${case_name}
                let ${part_var} = ${part_fn}();
                ${part_var} = ${part_var}.rotateX(${rotate[0]});
                ${part_var} = ${part_var}.rotateY(${rotate[1]});
                ${part_var} = ${part_var}.rotateZ(${rotate[2]});
                ${part_var} = ${part_var}.translate(${shift});
                ${op_statement}
                
            `);
	        }

	        results[case_name] = `

            // individual makerjs exports
            ${scripts.join('\n\n')}

            // combination of parts
            function main() {
                ${main.join('')}
                return ${case_name};
            }

        `;
	    }

	    return results
	};

	var cases = {
		parse: parse
	};

	var mx = {
	  nets: ['from', 'to'],
	  params: {
	    class: 'S'
	  },
	  body: p => `

    (module MX (layer F.Cu) (tedit 5DD4F656)

      ${p.at /* parametric position */}

      ${'' /* footprint reference */}
      (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
      (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))

      ${''/* corner marks */}
      (fp_line (start -7 -6) (end -7 -7) (layer Dwgs.User) (width 0.15))
      (fp_line (start -7 7) (end -6 7) (layer Dwgs.User) (width 0.15))
      (fp_line (start -6 -7) (end -7 -7) (layer Dwgs.User) (width 0.15))
      (fp_line (start -7 7) (end -7 6) (layer Dwgs.User) (width 0.15))
      (fp_line (start 7 6) (end 7 7) (layer Dwgs.User) (width 0.15))
      (fp_line (start 7 -7) (end 6 -7) (layer Dwgs.User) (width 0.15))
      (fp_line (start 6 7) (end 7 7) (layer Dwgs.User) (width 0.15))
      (fp_line (start 7 -7) (end 7 -6) (layer Dwgs.User) (width 0.15))
      
      ${''/* pins */}
      (pad 1 thru_hole circle (at 2.54 -5.08) (size 2.286 2.286) (drill 1.4986) (layers *.Cu *.Mask) ${p.net.from})
      (pad 2 thru_hole circle (at -3.81 -2.54) (size 2.286 2.286) (drill 1.4986) (layers *.Cu *.Mask) ${p.net.to})

      ${''/* middle shaft */}
      (pad "" np_thru_hole circle (at 0 0) (size 3.9878 3.9878) (drill 3.9878) (layers *.Cu *.Mask))

      ${''/* stabilizers */}
      (pad "" np_thru_hole circle (at 5.08 0) (size 1.7018 1.7018) (drill 1.7018) (layers *.Cu *.Mask))
      (pad "" np_thru_hole circle (at -5.08 0) (size 1.7018 1.7018) (drill 1.7018) (layers *.Cu *.Mask))
    )

  `
	};

	var alps = {
	    nets: ['from', 'to'],
	    params: {
	        class: 'S'
	    },
	    body: p => `

    (module ALPS (layer F.Cu) (tedit 5CF31DEF)

        ${p.at /* parametric position */}
        
        ${'' /* footprint reference */}
        (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
        (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))
        
        ${''/* corner marks */}
        (fp_line (start -7 -6) (end -7 -7) (layer Dwgs.User) (width 0.15))
        (fp_line (start -7 7) (end -6 7) (layer Dwgs.User) (width 0.15))
        (fp_line (start -6 -7) (end -7 -7) (layer Dwgs.User) (width 0.15))
        (fp_line (start -7 7) (end -7 6) (layer Dwgs.User) (width 0.15))
        (fp_line (start 7 6) (end 7 7) (layer Dwgs.User) (width 0.15))
        (fp_line (start 7 -7) (end 6 -7) (layer Dwgs.User) (width 0.15))
        (fp_line (start 6 7) (end 7 7) (layer Dwgs.User) (width 0.15))
        (fp_line (start 7 -7) (end 7 -6) (layer Dwgs.User) (width 0.15))

        ${''/* pins */}
        (pad 1 thru_hole circle (at 2.5 -4.5) (size 2.25 2.25) (drill 1.47) (layers *.Cu *.Mask) ${p.net.from})
        (pad 2 thru_hole circle (at -2.5 -4) (size 2.25 2.25) (drill 1.47) (layers *.Cu *.Mask) ${p.net.to})
    )

    `
	};

	var choc = {
	    nets: ['from', 'to'],
	    params: {
	        class: 'S'
	    },
	    body: p => `

    (module PG1350 (layer F.Cu) (tedit 5DD50112)

        ${p.at /* parametric position */}

        ${'' /* footprint reference */}
        (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
        (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))

        ${''/* corner marks */}
        (fp_line (start -7 -6) (end -7 -7) (layer Dwgs.User) (width 0.15))
        (fp_line (start -7 7) (end -6 7) (layer Dwgs.User) (width 0.15))
        (fp_line (start -6 -7) (end -7 -7) (layer Dwgs.User) (width 0.15))
        (fp_line (start -7 7) (end -7 6) (layer Dwgs.User) (width 0.15))
        (fp_line (start 7 6) (end 7 7) (layer Dwgs.User) (width 0.15))
        (fp_line (start 7 -7) (end 6 -7) (layer Dwgs.User) (width 0.15))
        (fp_line (start 6 7) (end 7 7) (layer Dwgs.User) (width 0.15))
        (fp_line (start 7 -7) (end 7 -6) (layer Dwgs.User) (width 0.15))

        ${''/* pins */}
        (pad 1 thru_hole circle (at 5 -3.8) (size 2.032 2.032) (drill 1.27) (layers *.Cu *.Mask) ${p.net.from})
        (pad 2 thru_hole circle (at 0 -5.9) (size 2.032 2.032) (drill 1.27) (layers *.Cu *.Mask) ${p.net.to})
        
        ${''/* middle shaft */}
        (pad "" np_thru_hole circle (at 0 0) (size 3.429 3.429) (drill 3.429) (layers *.Cu *.Mask))
        
        ${''/* stabilizers */}
        (pad "" np_thru_hole circle (at 5.5 0) (size 1.7018 1.7018) (drill 1.7018) (layers *.Cu *.Mask))
        (pad "" np_thru_hole circle (at -5.5 0) (size 1.7018 1.7018) (drill 1.7018) (layers *.Cu *.Mask))
    )

    `
	};

	var diode = {
	    nets: ['from', 'to'],
	    params: {
	        class: 'D'
	    },
	    body: p => `
  
    (module ComboDiode (layer F.Cu) (tedit 5B24D78E)


        ${p.at /* parametric position */}

        ${'' /* footprint reference */}
        (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
        (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))
        
        ${''/* diode symbols */}
        (fp_line (start 0.25 0) (end 0.75 0) (layer F.SilkS) (width 0.1))
        (fp_line (start 0.25 0.4) (end -0.35 0) (layer F.SilkS) (width 0.1))
        (fp_line (start 0.25 -0.4) (end 0.25 0.4) (layer F.SilkS) (width 0.1))
        (fp_line (start -0.35 0) (end 0.25 -0.4) (layer F.SilkS) (width 0.1))
        (fp_line (start -0.35 0) (end -0.35 0.55) (layer F.SilkS) (width 0.1))
        (fp_line (start -0.35 0) (end -0.35 -0.55) (layer F.SilkS) (width 0.1))
        (fp_line (start -0.75 0) (end -0.35 0) (layer F.SilkS) (width 0.1))
        (fp_line (start 0.25 0) (end 0.75 0) (layer B.SilkS) (width 0.1))
        (fp_line (start 0.25 0.4) (end -0.35 0) (layer B.SilkS) (width 0.1))
        (fp_line (start 0.25 -0.4) (end 0.25 0.4) (layer B.SilkS) (width 0.1))
        (fp_line (start -0.35 0) (end 0.25 -0.4) (layer B.SilkS) (width 0.1))
        (fp_line (start -0.35 0) (end -0.35 0.55) (layer B.SilkS) (width 0.1))
        (fp_line (start -0.35 0) (end -0.35 -0.55) (layer B.SilkS) (width 0.1))
        (fp_line (start -0.75 0) (end -0.35 0) (layer B.SilkS) (width 0.1))
    
        ${''/* SMD pads on both sides */}
        (pad 1 smd rect (at -1.65 0 ${p.rot}) (size 0.9 1.2) (layers F.Cu F.Paste F.Mask) ${p.net.to})
        (pad 2 smd rect (at 1.65 0 ${p.rot}) (size 0.9 1.2) (layers B.Cu B.Paste B.Mask) ${p.net.from})
        (pad 1 smd rect (at -1.65 0 ${p.rot}) (size 0.9 1.2) (layers B.Cu B.Paste B.Mask) ${p.net.to})
        (pad 2 smd rect (at 1.65 0 ${p.rot}) (size 0.9 1.2) (layers F.Cu F.Paste F.Mask) ${p.net.from})
        
        ${''/* THT terminals */}
        (pad 1 thru_hole circle (at 3.81 0 ${p.rot}) (size 1.905 1.905) (drill 0.9906) (layers *.Cu *.Mask) ${p.net.from})
        (pad 2 thru_hole rect (at -3.81 0 ${p.rot}) (size 1.778 1.778) (drill 0.9906) (layers *.Cu *.Mask) ${p.net.to})
    )
  
    `
	};

	var promicro = {
	  static_nets: [
	    'RAW', 'GND', 'RST', 'VCC',
	    'P21', 'P20', 'P19', 'P18',
	    'P15', 'P14', 'P16', 'P10',
	    'P1', 'P0', 'P2', 'P3', 'P4',
	    'P5', 'P6', 'P7', 'P8', 'P9'
	  ],
	  params: {
	    class: 'C' // for Controller
	  },
	  body: p => `
  
    (module ProMicro (layer F.Cu) (tedit 5B307E4C)
    
      ${p.at /* parametric position */}

      ${'' /* footprint reference */}
      (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
      (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))
    
      ${''/* illustration of the (possible) USB port overhang */}
      (fp_line (start -19.304 -3.81) (end -14.224 -3.81) (layer Dwgs.User) (width 0.15))
      (fp_line (start -19.304 3.81) (end -19.304 -3.81) (layer Dwgs.User) (width 0.15))
      (fp_line (start -14.224 3.81) (end -19.304 3.81) (layer Dwgs.User) (width 0.15))
      (fp_line (start -14.224 -3.81) (end -14.224 3.81) (layer Dwgs.User) (width 0.15))
    
      ${''/* component outline */}
      (fp_line (start -17.78 8.89) (end 15.24 8.89) (layer F.SilkS) (width 0.15))
      (fp_line (start 15.24 8.89) (end 15.24 -8.89) (layer F.SilkS) (width 0.15))
      (fp_line (start 15.24 -8.89) (end -17.78 -8.89) (layer F.SilkS) (width 0.15))
      (fp_line (start -17.78 -8.89) (end -17.78 8.89) (layer F.SilkS) (width 0.15))
      
      ${''/* extra border around "RAW", in case the rectangular shape is not distinctive enough */}
      (fp_line (start -15.24 6.35) (end -12.7 6.35) (layer F.SilkS) (width 0.15))
      (fp_line (start -15.24 6.35) (end -15.24 8.89) (layer F.SilkS) (width 0.15))
      (fp_line (start -12.7 6.35) (end -12.7 8.89) (layer F.SilkS) (width 0.15))
    
      ${''/* pin names */}
      (fp_text user RAW (at -13.97 4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user GND (at -11.43 4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user RST (at -8.89 4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user VCC (at -6.35 4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P21 (at -3.81 4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P20 (at -1.27 4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P19 (at 1.27 4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P18 (at 3.81 4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P15 (at 6.35 4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P14 (at 8.89 4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P16 (at 11.43 4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P10 (at 13.97 4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
    
      (fp_text user P01 (at -13.97 -4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P00 (at -11.43 -4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user GND (at -8.89 -4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user GND (at -6.35 -4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P02 (at -3.81 -4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P03 (at -1.27 -4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P04 (at 1.27 -4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P05 (at 3.81 -4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P06 (at 6.35 -4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P07 (at 8.89 -4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P08 (at 11.43 -4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
      (fp_text user P09 (at 13.97 -4.8 ${p.rot + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
    
      ${''/* and now the actual pins */}
      (pad 1 thru_hole rect (at -13.97 7.62 ${p.rot}) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.RAW})
      (pad 2 thru_hole circle (at -11.43 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.GND})
      (pad 3 thru_hole circle (at -8.89 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.RST})
      (pad 4 thru_hole circle (at -6.35 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.VCC})
      (pad 5 thru_hole circle (at -3.81 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P21})
      (pad 6 thru_hole circle (at -1.27 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P20})
      (pad 7 thru_hole circle (at 1.27 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P19})
      (pad 8 thru_hole circle (at 3.81 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P18})
      (pad 9 thru_hole circle (at 6.35 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P15})
      (pad 10 thru_hole circle (at 8.89 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P14})
      (pad 11 thru_hole circle (at 11.43 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P16})
      (pad 12 thru_hole circle (at 13.97 7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P10})
      
      (pad 13 thru_hole circle (at -13.97 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P1})
      (pad 14 thru_hole circle (at -11.43 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P0})
      (pad 15 thru_hole circle (at -8.89 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.GND})
      (pad 16 thru_hole circle (at -6.35 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.GND})
      (pad 17 thru_hole circle (at -3.81 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P2})
      (pad 18 thru_hole circle (at -1.27 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P3})
      (pad 19 thru_hole circle (at 1.27 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P4})
      (pad 20 thru_hole circle (at 3.81 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P5})
      (pad 21 thru_hole circle (at 6.35 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P6})
      (pad 22 thru_hole circle (at 8.89 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P7})
      (pad 23 thru_hole circle (at 11.43 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P8})
      (pad 24 thru_hole circle (at 13.97 -7.62 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.net.P9})
    )
  `
	};

	var slider = {
	    nets: ['from', 'to'],
	    params: {
	        class: 'T', // for Toggle (?)
	        side: 'F'
	    },
	    body: p => {

	        const left = p.param.side == 'F' ? '-' : '';
	        const right = p.param.side == 'F' ? '' : '-';

	        return `
        
        (module E73:SPDT_C128955 (layer F.Cu) (tstamp 5BF2CC3C)

            ${p.at /* parametric position */}

            ${'' /* footprint reference */}
            (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
            (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))
            
            ${'' /* outline */}
            (fp_line (start 1.95 -1.35) (end -1.95 -1.35) (layer ${p.param.side}.SilkS) (width 0.15))
            (fp_line (start 0 -1.35) (end -3.3 -1.35) (layer ${p.param.side}.SilkS) (width 0.15))
            (fp_line (start -3.3 -1.35) (end -3.3 1.5) (layer ${p.param.side}.SilkS) (width 0.15))
            (fp_line (start -3.3 1.5) (end 3.3 1.5) (layer ${p.param.side}.SilkS) (width 0.15))
            (fp_line (start 3.3 1.5) (end 3.3 -1.35) (layer ${p.param.side}.SilkS) (width 0.15))
            (fp_line (start 0 -1.35) (end 3.3 -1.35) (layer ${p.param.side}.SilkS) (width 0.15))
            
            ${'' /* extra indicator for the slider */}
            (fp_line (start -1.95 -3.85) (end 1.95 -3.85) (layer Dwgs.User) (width 0.15))
            (fp_line (start 1.95 -3.85) (end 1.95 -1.35) (layer Dwgs.User) (width 0.15))
            (fp_line (start -1.95 -1.35) (end -1.95 -3.85) (layer Dwgs.User) (width 0.15))
            
            ${'' /* bottom cutouts */}
            (pad "" np_thru_hole circle (at 1.5 0) (size 1 1) (drill 0.9) (layers *.Cu *.Mask))
            (pad "" np_thru_hole circle (at -1.5 0) (size 1 1) (drill 0.9) (layers *.Cu *.Mask))

            ${'' /* pins */}
            (pad 1 smd rect (at ${right}2.25 2.075 ${p.rot}) (size 0.9 1.25) (layers ${p.param.side}.Cu ${p.param.side}.Paste ${p.param.side}.Mask) ${p.net.from})
            (pad 2 smd rect (at ${left}0.75 2.075 ${p.rot}) (size 0.9 1.25) (layers ${p.param.side}.Cu ${p.param.side}.Paste ${p.param.side}.Mask) ${p.net.to})
            (pad 3 smd rect (at ${left}2.25 2.075 ${p.rot}) (size 0.9 1.25) (layers ${p.param.side}.Cu ${p.param.side}.Paste ${p.param.side}.Mask))
            
            ${'' /* side mounts */}
            (pad "" smd rect (at 3.7 -1.1 ${p.rot}) (size 0.9 0.9) (layers ${p.param.side}.Cu ${p.param.side}.Paste ${p.param.side}.Mask))
            (pad "" smd rect (at 3.7 1.1 ${p.rot}) (size 0.9 0.9) (layers ${p.param.side}.Cu ${p.param.side}.Paste ${p.param.side}.Mask))
            (pad "" smd rect (at -3.7 1.1 ${p.rot}) (size 0.9 0.9) (layers ${p.param.side}.Cu ${p.param.side}.Paste ${p.param.side}.Mask))
            (pad "" smd rect (at -3.7 -1.1 ${p.rot}) (size 0.9 0.9) (layers ${p.param.side}.Cu ${p.param.side}.Paste ${p.param.side}.Mask))
        )
        
        `
	    }
	};

	var reset = {
	    nets: ['from', 'to'],
	    params: {
	        class: 'B', // for Button
	        side: 'F'
	    },
	    body: p => `
    
    (module E73:SW_TACT_ALPS_SKQGABE010 (layer F.Cu) (tstamp 5BF2CC94)

        (descr "Low-profile SMD Tactile Switch, https://www.e-switch.com/system/asset/product_line/data_sheet/165/TL3342.pdf")
        (tags "SPST Tactile Switch")

        ${p.at /* parametric position */}
        ${'' /* footprint reference */}
        (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
        (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))
        
        ${'' /* outline */}
        (fp_line (start 2.75 1.25) (end 1.25 2.75) (layer ${p.param.side}.SilkS) (width 0.15))
        (fp_line (start 2.75 -1.25) (end 1.25 -2.75) (layer ${p.param.side}.SilkS) (width 0.15))
        (fp_line (start 2.75 -1.25) (end 2.75 1.25) (layer ${p.param.side}.SilkS) (width 0.15))
        (fp_line (start -1.25 2.75) (end 1.25 2.75) (layer ${p.param.side}.SilkS) (width 0.15))
        (fp_line (start -1.25 -2.75) (end 1.25 -2.75) (layer ${p.param.side}.SilkS) (width 0.15))
        (fp_line (start -2.75 1.25) (end -1.25 2.75) (layer ${p.param.side}.SilkS) (width 0.15))
        (fp_line (start -2.75 -1.25) (end -1.25 -2.75) (layer ${p.param.side}.SilkS) (width 0.15))
        (fp_line (start -2.75 -1.25) (end -2.75 1.25) (layer ${p.param.side}.SilkS) (width 0.15))
        
        ${'' /* pins */}
        (pad 1 smd rect (at -3.1 -1.85 ${p.rot}) (size 1.8 1.1) (layers ${p.param.side}.Cu ${p.param.side}.Paste ${p.param.side}.Mask) ${p.net.from})
        (pad 1 smd rect (at 3.1 -1.85 ${p.rot}) (size 1.8 1.1) (layers ${p.param.side}.Cu ${p.param.side}.Paste ${p.param.side}.Mask) ${p.net.from})
        (pad 2 smd rect (at -3.1 1.85 ${p.rot}) (size 1.8 1.1) (layers ${p.param.side}.Cu ${p.param.side}.Paste ${p.param.side}.Mask) ${p.net.to})
        (pad 2 smd rect (at 3.1 1.85 ${p.rot}) (size 1.8 1.1) (layers ${p.param.side}.Cu ${p.param.side}.Paste ${p.param.side}.Mask) ${p.net.to})
    )
    
    `
	};

	var rgb = {
	    static_nets: ['VCC', 'GND'],
	    nets: ['din', 'dout'],
	    params: {
	        class: 'L', // for Led
	        side: 'F'
	    },
	    body: p => `
    
        (module WS2812B (layer F.Cu) (tedit 53BEE615)

            ${p.at /* parametric position */}

            ${'' /* footprint reference */}
            (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
            (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))

            (fp_line (start -1.75 -1.75) (end -1.75 1.75) (layer ${p.param.side}.SilkS) (width 0.15))
            (fp_line (start -1.75 1.75) (end 1.75 1.75) (layer ${p.param.side}.SilkS) (width 0.15))
            (fp_line (start 1.75 1.75) (end 1.75 -1.75) (layer ${p.param.side}.SilkS) (width 0.15))
            (fp_line (start 1.75 -1.75) (end -1.75 -1.75) (layer ${p.param.side}.SilkS) (width 0.15))

            (fp_line (start -2.5 -2.5) (end -2.5 2.5) (layer ${p.param.side}.SilkS) (width 0.15))
            (fp_line (start -2.5 2.5) (end 2.5 2.5) (layer ${p.param.side}.SilkS) (width 0.15))
            (fp_line (start 2.5 2.5) (end 2.5 -2.5) (layer ${p.param.side}.SilkS) (width 0.15))
            (fp_line (start 2.5 -2.5) (end -2.5 -2.5) (layer ${p.param.side}.SilkS) (width 0.15))

            (fp_poly (pts (xy 4 2.2) (xy 4 0.375) (xy 5 1.2875)) (layer ${p.param.side}.SilkS) (width 0.1))

            (pad 1 smd rect (at -2.2 -0.875 ${p.rot}) (size 2.6 1) (layers ${p.param.side}.Cu ${p.param.side}.Paste ${p.param.side}.Mask) ${p.net.VCC})
            (pad 2 smd rect (at -2.2 0.875 ${p.rot}) (size 2.6 1) (layers ${p.param.side}.Cu ${p.param.side}.Paste ${p.param.side}.Mask) ${p.net.dout})
            (pad 3 smd rect (at 2.2 0.875 ${p.rot}) (size 2.6 1) (layers ${p.param.side}.Cu ${p.param.side}.Paste ${p.param.side}.Mask) ${p.net.GND})
            (pad 4 smd rect (at 2.2 -0.875 ${p.rot}) (size 2.6 1) (layers ${p.param.side}.Cu ${p.param.side}.Paste ${p.param.side}.Mask) ${p.net.din})

            (pad 11 smd rect (at -2.5 -1.6 ${p.rot}) (size 2 1.2) (layers ${p.param.side}.Cu ${p.param.side}.Paste ${p.param.side}.Mask) ${p.net.VCC})
            (pad 22 smd rect (at -2.5 1.6 ${p.rot}) (size 2 1.2) (layers ${p.param.side}.Cu ${p.param.side}.Paste ${p.param.side}.Mask) ${p.net.dout})
            (pad 33 smd rect (at 2.5 1.6 ${p.rot}) (size 2 1.2) (layers ${p.param.side}.Cu ${p.param.side}.Paste ${p.param.side}.Mask) ${p.net.GND})
            (pad 44 smd rect (at 2.5 -1.6 ${p.rot}) (size 2 1.2) (layers ${p.param.side}.Cu ${p.param.side}.Paste ${p.param.side}.Mask) ${p.net.din})
            
        )
    
    `
	};

	var jstph = {
	    nets: ['pos', 'neg'],
	    params: {
	        class: 'J',
	        side: 'F'
	    },
	    body: p => `
    
    (module JST_PH_S2B-PH-K_02x2.00mm_Angled (layer F.Cu) (tedit 58D3FE32)

        (descr "JST PH series connector, S2B-PH-K, side entry type, through hole, Datasheet: http://www.jst-mfg.com/product/pdf/eng/ePH.pdf")
        (tags "connector jst ph")

        ${p.at /* parametric position */}

        ${'' /* footprint reference */}
        (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
        (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))

        (fp_line (start -2.25 0.25) (end -2.25 -1.35) (layer ${p.param.side}.SilkS) (width 0.15))
        (fp_line (start -2.25 -1.35) (end -2.95 -1.35) (layer ${p.param.side}.SilkS) (width 0.15))
        (fp_line (start -2.95 -1.35) (end -2.95 6.25) (layer ${p.param.side}.SilkS) (width 0.15))
        (fp_line (start -2.95 6.25) (end 2.95 6.25) (layer ${p.param.side}.SilkS) (width 0.15))
        (fp_line (start 2.95 6.25) (end 2.95 -1.35) (layer ${p.param.side}.SilkS) (width 0.15))
        (fp_line (start 2.95 -1.35) (end 2.25 -1.35) (layer ${p.param.side}.SilkS) (width 0.15))
        (fp_line (start 2.25 -1.35) (end 2.25 0.25) (layer ${p.param.side}.SilkS) (width 0.15))
        (fp_line (start 2.25 0.25) (end -2.25 0.25) (layer ${p.param.side}.SilkS) (width 0.15))

        (fp_line (start -1 1.5) (end -1 2.0) (layer ${p.param.side}.SilkS) (width 0.15))
        (fp_line (start -1.25 1.75) (end -0.75 1.75) (layer ${p.param.side}.SilkS) (width 0.15))

        (pad 1 thru_hole rect (at -1 0 ${p.rot}) (size 1.2 1.7) (drill 0.75) (layers *.Cu *.Mask) ${p.net.pos})
        (pad 2 thru_hole oval (at 1 0 ${p.rot}) (size 1.2 1.7) (drill 0.75) (layers *.Cu *.Mask) ${p.net.neg})
            
    )
    
    `
	};

	var pad = {
	    nets: ['net'],
	    params: {
	        class: 'P',
	        width: 1,
	        height: 1,
	        front: true,
	        back: true,
	        text: '',
	        align: 'left',
	        mirrored: '!mirrored'
	    },
	    body: p => {

	        const layout = (toggle, side) => {
	            if (!toggle) return ''
	            let x = 0, y = 0;
	            const mirror = side == 'B' ? '(justify mirror)' : '';
	            const plus = (p.param.text.length + 1) * 0.5;
	            let align = p.param.align;
	            if (p.param.mirrored === true) {
	                if (align == 'left') align = 'right';
	                else if (align == 'right') align = 'left';
	            }
	            if (align == 'left') x -= p.param.width / 2 + plus;
	            if (align == 'right') x += p.param.width / 2 + plus;
	            if (align == 'up') y += p.param.height / 2 + plus;
	            if (align == 'down') y -= p.param.height / 2 + plus;
	            const text = `(fp_text user ${p.param.text} (at ${x} ${y} ${p.rot}) (layer ${side}.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15)) ${mirror}))`;
	            return `(pad 1 smd rect (at 0 0 ${p.rot}) (size ${p.param.width} ${p.param.height}) (layers ${side}.Cu ${side}.Paste ${side}.Mask) ${p.net.net})\n${text}`
	        };

	        return `
    
        (module SMDPad (layer F.Cu) (tedit 5B24D78E)

            ${p.at /* parametric position */}

            ${'' /* footprint reference */}
            (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
            (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))
            
            ${''/* SMD pads */}
            ${layout(p.param.front, 'F')}
            ${layout(p.param.back, 'B')}
            
        )
    
        `
	    }
	};

	var footprints = {
	    mx: mx,
	    alps: alps,
	    choc: choc,
	    diode: diode,
	    promicro: promicro,
	    slider: slider,
	    reset: reset,
	    rgb: rgb,
	    jstph: jstph,
	    pad: pad
	};

	var pcbs = createCommonjsModule(function (module, exports) {
	const kicad_prefix = `
(kicad_pcb (version 20171130) (host pcbnew 5.1.6)

  (page A3)
  (title_block
    (title KEYBOARD_NAME_HERE)
    (rev VERSION_HERE)
    (company YOUR_NAME_HERE)
  )

  (general
    (thickness 1.6)
  )

  (layers
    (0 F.Cu signal)
    (31 B.Cu signal)
    (32 B.Adhes user)
    (33 F.Adhes user)
    (34 B.Paste user)
    (35 F.Paste user)
    (36 B.SilkS user)
    (37 F.SilkS user)
    (38 B.Mask user)
    (39 F.Mask user)
    (40 Dwgs.User user)
    (41 Cmts.User user)
    (42 Eco1.User user)
    (43 Eco2.User user)
    (44 Edge.Cuts user)
    (45 Margin user)
    (46 B.CrtYd user)
    (47 F.CrtYd user)
    (48 B.Fab user)
    (49 F.Fab user)
  )

  (setup
    (last_trace_width 0.25)
    (trace_clearance 0.2)
    (zone_clearance 0.508)
    (zone_45_only no)
    (trace_min 0.2)
    (via_size 0.8)
    (via_drill 0.4)
    (via_min_size 0.4)
    (via_min_drill 0.3)
    (uvia_size 0.3)
    (uvia_drill 0.1)
    (uvias_allowed no)
    (uvia_min_size 0.2)
    (uvia_min_drill 0.1)
    (edge_width 0.05)
    (segment_width 0.2)
    (pcb_text_width 0.3)
    (pcb_text_size 1.5 1.5)
    (mod_edge_width 0.12)
    (mod_text_size 1 1)
    (mod_text_width 0.15)
    (pad_size 1.524 1.524)
    (pad_drill 0.762)
    (pad_to_mask_clearance 0.05)
    (aux_axis_origin 0 0)
    (visible_elements FFFFFF7F)
    (pcbplotparams
      (layerselection 0x010fc_ffffffff)
      (usegerberextensions false)
      (usegerberattributes true)
      (usegerberadvancedattributes true)
      (creategerberjobfile true)
      (excludeedgelayer true)
      (linewidth 0.100000)
      (plotframeref false)
      (viasonmask false)
      (mode 1)
      (useauxorigin false)
      (hpglpennumber 1)
      (hpglpenspeed 20)
      (hpglpendiameter 15.000000)
      (psnegative false)
      (psa4output false)
      (plotreference true)
      (plotvalue true)
      (plotinvisibletext false)
      (padsonsilk false)
      (subtractmaskfromsilk false)
      (outputformat 1)
      (mirror false)
      (drillshape 1)
      (scaleselection 1)
      (outputdirectory ""))
  )
`;

	const kicad_suffix = `
)
`;

	const kicad_netclass = `
  (net_class Default "This is the default net class."
    (clearance 0.2)
    (trace_width 0.25)
    (via_dia 0.8)
    (via_drill 0.4)
    (uvia_dia 0.3)
    (uvia_drill 0.1)
    __ADD_NET
  )
`;

	const makerjs2kicad = exports._makerjs2kicad = (model, layer='Edge.Cuts') => {
	    const grs = [];
	    const xy = val => `${val[0]} ${-val[1]}`;
	    makerjs.model.walk(model, {
	        onPath: wp => {
	            const p = wp.pathContext;
	            switch (p.type) {
	                case 'line':
	                    grs.push(`(gr_line (start ${xy(p.origin)}) (end ${xy(p.end)}) (angle 90) (layer ${layer}) (width 0.15))`);
	                    break
	                case 'arc':
	                    const arc_center = p.origin;
	                    const angle_start = p.startAngle > p.endAngle ? p.startAngle - 360 : p.startAngle;
	                    const angle_diff = Math.abs(p.endAngle - angle_start);
	                    const arc_end = makerjs.point.rotate(makerjs.point.add(arc_center, [p.radius, 0]), angle_start, arc_center);
	                    grs.push(`(gr_arc (start ${xy(arc_center)}) (end ${xy(arc_end)}) (angle ${-angle_diff}) (layer ${layer}) (width 0.15))`);
	                    break
	                case 'circle':
	                    const circle_center = p.origin;
	                    const circle_end = makerjs.point.add(circle_center, [p.radius, 0]);
	                    grs.push(`(gr_circle (center ${xy(circle_center)}) (end ${xy(circle_end)}) (layer ${layer}) (width 0.15))`);
	                    break
	                default:
	                    throw new Error(`Can't convert path type "${p.type}" to kicad!`)
	            }
	        }
	    });
	    return grs.join('\n')
	};


	const footprint = exports._footprint = (config, name, points, point, net_indexer, component_indexer) => {

	    if (config === false) return ''
	    
	    // config sanitization
	    assert_1.detect_unexpected(config, name, ['type', 'anchor', 'nets', 'params']);
	    const type = assert_1.in(config.type, `${name}.type`, Object.keys(footprints));
	    let anchor = assert_1.anchor(config.anchor || {}, `${name}.anchor`, points, true, point);
	    const nets = assert_1.sane(config.nets || {}, `${name}.nets`, 'object');
	    const params = assert_1.sane(config.params || {}, `${name}.params`, 'object');

	    // basic setup
	    const fp = footprints[type];
	    const parsed_params = {};

	    // footprint positioning
	    parsed_params.at = `(at ${anchor.x} ${-anchor.y} ${anchor.r})`;
	    parsed_params.rot = anchor.r;

	    // connecting static nets
	    parsed_params.net = {};
	    for (const net of (fp.static_nets || [])) {
	        const index = net_indexer(net);
	        parsed_params.net[net] = `(net ${index} "${net}")`;
	    }

	    // connecting parametric nets
	    for (const net_ref of (fp.nets || [])) {
	        let net = nets[net_ref];
	        assert_1.sane(net, `${name}.nets.${net_ref}`, 'string');
	        if (net.startsWith('!') && point) {
	            const indirect = net.substring(1);
	            net = point.meta[indirect];
	            assert_1.sane(net, `${name}.nets.${net_ref} --> ${point.meta.name}.${indirect}`, 'string');
	        }
	        const index = net_indexer(net);
	        parsed_params.net[net_ref] = `(net ${index} "${net}")`;
	    }

	    // connecting other, non-net parameters
	    parsed_params.param = {};
	    for (const param of (Object.keys(fp.params || {}))) {
	        let value = params[param] === undefined ? fp.params[param] : params[param];
	        if (value === undefined) throw new Error(`Field "${name}.params.${param}" is missing!`)
	        if (assert_1.type(value) == 'string' && value.startsWith('!') && point) {
	            const indirect = value.substring(1);
	            value = point.meta[indirect];
	            if (value === undefined) throw new Error(`Field "${name}.params.${param} --> ${point.meta.name}.${indirect}" is missing!`)
	        }
	        parsed_params.param[param] = value;
	    }

	    // reference
	    parsed_params.ref = component_indexer(parsed_params.param.class || '_');
	    parsed_params.ref_hide = 'hide'; // TODO: make this parametric?

	    return fp.body(parsed_params)
	};

	exports.parse = (config, points, outlines) => {

	    const pcbs = assert_1.sane(config || {}, 'pcbs', 'object');
	    const results = {};

	    for (const [pcb_name, pcb_config] of Object.entries(pcbs)) {

	        // config sanitization
	        assert_1.detect_unexpected(pcb_config, `pcbs.${pcb_name}`, ['outlines', 'footprints']);

	        // outline conversion
	        const config_outlines = assert_1.sane(pcb_config.outlines || {}, `pcbs.${pcb_name}.outlines`, 'object');
	        const kicad_outlines = {};
	        for (const [outline_name, outline] of Object.entries(config_outlines)) {
	            const ref = assert_1.in(outline.outline, `pcbs.${pcb_name}.outlines.${outline_name}.outline`, Object.keys(outlines));
	            const layer = assert_1.sane(outline.layer || 'Edge.Cuts', `pcbs.${pcb_name}.outlines.${outline_name}.outline`, 'string');
	            kicad_outlines[outline_name] = makerjs2kicad(outlines[ref], layer);
	        }

	        // making a global net index registry
	        const nets = {"": 0};
	        const net_indexer = net => {
	            if (nets[net] !== undefined) return nets[net]
	            const index = Object.keys(nets).length;
	            return nets[net] = index
	        };
	        // and a component indexer
	        const component_registry = {};
	        const component_indexer = _class => {
	            if (!component_registry[_class]) {
	                component_registry[_class] = 0;
	            }
	            component_registry[_class]++;
	            return `${_class}${component_registry[_class]}`
	        };

	        const footprints = [];

	        // key-level footprints
	        for (const [p_name, point] of Object.entries(points)) {
	            for (const [f_name, f] of Object.entries(point.meta.footprints || {})) {
	                footprints.push(footprint(f, `${p_name}.footprints.${f_name}`, points, point, net_indexer, component_indexer));
	            }
	        }

	        // global one-off footprints
	        const global_footprints = assert_1.sane(pcb_config.footprints || {}, `pcbs.${pcb_name}.footprints`, 'object');
	        for (const [gf_name, gf] of Object.entries(global_footprints)) {
	            footprints.push(footprint(gf, `pcbs.${pcb_name}.footprints.${gf_name}`, points, undefined, net_indexer, component_indexer));
	        }

	        // finalizing nets
	        const nets_arr = [];
	        const add_nets_arr = [];
	        for (const [net, index] of Object.entries(nets)) {
	            nets_arr.push(`(net ${index} "${net}")`);
	            add_nets_arr.push(`(add_net "${net}")`);
	        }

	        const netclass = kicad_netclass.replace('__ADD_NET', add_nets_arr.join('\n'));
	        const nets_text = nets_arr.join('\n');
	        const footprint_text = footprints.join('\n');
	        const outline_text = Object.values(kicad_outlines).join('\n');
	        results[pcb_name] = `
            ${kicad_prefix}
            ${nets_text}
            ${netclass}
            ${footprint_text}
            ${outline_text}
            ${kicad_suffix}
        `;
	    }

	    return results
	};
	});

	var ergogen = {
	    points: points,
	    outlines: outlines,
	    cases: cases,
	    pcbs: pcbs,
	    version: '1.0.0'
	};

	return ergogen;

})));
