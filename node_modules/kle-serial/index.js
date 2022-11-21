(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['json5'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('json5'));
    } else {
        // Browser globals (root is window)
        root.kle = factory(root.JSON5);
    }
}(typeof self !== 'undefined' ? self : this, function (JSON5) {
    
    const exports = {}

    var Key = /** @class */ (function () {
        function Key() {
            this.color = "#cccccc";
            this.labels = [];
            this.textColor = [];
            this.textSize = [];
            this.default = {
                textColor: "#000000",
                textSize: 3
            };
            this.x = 0;
            this.y = 0;
            this.width = 1;
            this.height = 1;
            this.x2 = 0;
            this.y2 = 0;
            this.width2 = 1;
            this.height2 = 1;
            this.rotation_x = 0;
            this.rotation_y = 0;
            this.rotation_angle = 0;
            this.decal = false;
            this.ghost = false;
            this.stepped = false;
            this.nub = false;
            this.profile = "";
            this.sm = ""; // switch mount
            this.sb = ""; // switch brand
            this.st = ""; // switch type
        }
        return Key;
    }());
    exports.Key = Key;
    var KeyboardMetadata = /** @class */ (function () {
        function KeyboardMetadata() {
            this.author = "";
            this.backcolor = "#eeeeee";
            this.background = null;
            this.name = "";
            this.notes = "";
            this.radii = "";
            this.switchBrand = "";
            this.switchMount = "";
            this.switchType = "";
        }
        return KeyboardMetadata;
    }());
    exports.KeyboardMetadata = KeyboardMetadata;
    var Keyboard = /** @class */ (function () {
        function Keyboard() {
            this.meta = new KeyboardMetadata();
            this.keys = [];
        }
        return Keyboard;
    }());
    exports.Keyboard = Keyboard;
    var Serial;
    (function (Serial) {
        // Helper to copy an object; doesn't handle loops/circular refs, etc.
        function copy(o) {
            if (typeof o !== "object") {
                return o; // primitive value
            }
            else if (o instanceof Array) {
                var result = [];
                for (var i = 0; i < o.length; i++) {
                    result[i] = copy(o[i]);
                }
                return result;
            }
            else {
                var oresult = Object.create(Object.getPrototypeOf(o));
                oresult.constructor();
                for (var prop in o) {
                    oresult[prop] = copy(o[prop]);
                }
                return oresult;
            }
        }
        // Map from serialized label position to normalized position,
        // depending on the alignment flags.
        // prettier-ignore
        var labelMap = [
            //0  1  2  3  4  5  6  7  8  9 10 11   // align flags
            [0, 6, 2, 8, 9, 11, 3, 5, 1, 4, 7, 10],
            [1, 7, -1, -1, 9, 11, 4, -1, -1, -1, -1, 10],
            [3, -1, 5, -1, 9, 11, -1, -1, 4, -1, -1, 10],
            [4, -1, -1, -1, 9, 11, -1, -1, -1, -1, -1, 10],
            [0, 6, 2, 8, 10, -1, 3, 5, 1, 4, 7, -1],
            [1, 7, -1, -1, 10, -1, 4, -1, -1, -1, -1, -1],
            [3, -1, 5, -1, 10, -1, -1, -1, 4, -1, -1, -1],
            [4, -1, -1, -1, 10, -1, -1, -1, -1, -1, -1, -1],
        ];
        function reorderLabelsIn(labels, align) {
            var ret = [];
            for (var i = 0; i < labels.length; ++i) {
                if (labels[i])
                    ret[labelMap[align][i]] = labels[i];
            }
            return ret;
        }
        function deserializeError(msg, data) {
            throw "Error: " + msg + (data ? ":\n  " + JSON5.stringify(data) : "");
        }
        function deserialize(rows) {
            if (!(rows instanceof Array))
                deserializeError("expected an array of objects");
            // Initialize with defaults
            var current = new Key();
            var kbd = new Keyboard();
            var cluster = { x: 0, y: 0 };
            var align = 4;
            for (var r = 0; r < rows.length; ++r) {
                if (rows[r] instanceof Array) {
                    for (var k = 0; k < rows[r].length; ++k) {
                        var item = rows[r][k];
                        if (typeof item === "string") {
                            var newKey = copy(current);
                            // Calculate some generated values
                            newKey.width2 =
                                newKey.width2 === 0 ? current.width : current.width2;
                            newKey.height2 =
                                newKey.height2 === 0 ? current.height : current.height2;
                            newKey.labels = reorderLabelsIn(item.split("\n"), align);
                            newKey.textSize = reorderLabelsIn(newKey.textSize, align);
                            // Clean up the data
                            for (var i = 0; i < 12; ++i) {
                                if (!newKey.labels[i]) {
                                    delete newKey.textSize[i];
                                    delete newKey.textColor[i];
                                }
                                if (newKey.textSize[i] == newKey.default.textSize)
                                    delete newKey.textSize[i];
                                if (newKey.textColor[i] == newKey.default.textColor)
                                    delete newKey.textColor[i];
                            }
                            // Add the key!
                            kbd.keys.push(newKey);
                            // Set up for the next key
                            current.x += current.width;
                            current.width = current.height = 1;
                            current.x2 = current.y2 = current.width2 = current.height2 = 0;
                            current.nub = current.stepped = current.decal = false;
                        }
                        else {
                            if (k != 0 &&
                                (item.r != null || item.rx != null || item.ry != null)) {
                                deserializeError("rotation can only be specified on the first key in a row", item);
                            }
                            if (item.r != null)
                                current.rotation_angle = item.r;
                            if (item.rx != null) {
                                current.rotation_x = cluster.x = item.rx;
                                current.x = cluster.x;
                                current.y = cluster.y;
                            }
                            if (item.ry != null) {
                                current.rotation_y = cluster.y = item.ry;
                                current.x = cluster.x;
                                current.y = cluster.y;
                            }
                            if (item.rx != null)
                                current.rotation_x = item.rx;
                            if (item.ry != null)
                                current.rotation_y = item.ry;
                            if (item.a != null)
                                align = item.a;
                            if (item.f) {
                                current.default.textSize = item.f;
                                current.textSize = [];
                            }
                            if (item.f2)
                                for (var i = 1; i < 12; ++i)
                                    current.textSize[i] = item.f2;
                            if (item.fa)
                                current.textSize = item.fa;
                            if (item.p)
                                current.profile = item.p;
                            if (item.c)
                                current.color = item.c;
                            if (item.t) {
                                var split = item.t.split("\n");
                                if (split[0] != "")
                                    current.default.textColor = split[0];
                                current.textColor = reorderLabelsIn(split, align);
                            }
                            if (item.x)
                                current.x += item.x;
                            if (item.y)
                                current.y += item.y;
                            if (item.w)
                                current.width = current.width2 = item.w;
                            if (item.h)
                                current.height = current.height2 = item.h;
                            if (item.x2)
                                current.x2 = item.x2;
                            if (item.y2)
                                current.y2 = item.y2;
                            if (item.w2)
                                current.width2 = item.w2;
                            if (item.h2)
                                current.height2 = item.h2;
                            if (item.n)
                                current.nub = item.n;
                            if (item.l)
                                current.stepped = item.l;
                            if (item.d)
                                current.decal = item.d;
                            if (item.g != null)
                                current.ghost = item.g;
                            if (item.sm)
                                current.sm = item.sm;
                            if (item.sb)
                                current.sb = item.sb;
                            if (item.st)
                                current.st = item.st;
                        }
                    }
                    // End of the row
                    current.y++;
                    current.x = current.rotation_x;
                }
                else if (typeof rows[r] === "object") {
                    if (r != 0) {
                        deserializeError("keyboard metadata must the be first element", rows[r]);
                    }
                    for (var prop in kbd.meta) {
                        if (rows[r][prop])
                            kbd.meta[prop] = rows[r][prop];
                    }
                }
                else {
                    deserializeError("unexpected", rows[r]);
                }
            }
            return kbd;
        }
        Serial.deserialize = deserialize;
        function parse(json) {
            return deserialize(JSON5.parse(json));
        }
        Serial.parse = parse;
    })(Serial = exports.Serial || (exports.Serial = {}));

    return exports
}));