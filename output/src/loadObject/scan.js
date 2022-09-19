"use strict";
exports.__esModule = true;
exports.load = exports.scan = void 0;
var flatten_1 = require("./flatten");
var Utils_1 = require("../Utils");
var debug = (0, Utils_1.Debug)();
function scan(dir) {
    var requireDir = require('./require');
    // 定制require-dir
    var Classes = requireDir(dir, {
        recurse: true,
        extensions: ['.ts'],
        require: function (r, abs, folder) {
            var Clazz = r;
            var obj = new Clazz["default"]();
            debug("obj0" + abs);
            debug(obj);
            var data = require('../decrator').data();
            if (!data)
                return;
            // Clazz.default.data = data
            require('../decrator').emptydata();
            obj.__data = data;
            var clz_name = obj.constructor.name;
            var newClz = data[clz_name];
            if (newClz)
                newClz.__obj = obj;
            return { clz_name: clz_name, newClz: newClz };
        }
    });
    var nodeList = (0, flatten_1.flatten)(Classes);
    return nodeList;
}
exports.scan = scan;
// var nodeList = scan('../../tests')
function load(file) {
    var Clazz = require("".concat(file));
    var obj = new Clazz["default"]();
    var data = require('../decrator').data();
    if (!data)
        return;
    // Clazz.default.data = data
    require('../decrator').emptydata();
    obj.__data = data;
    var clz_name = obj.constructor.name;
    var newClz = data[clz_name];
    if (newClz)
        newClz.__obj = obj;
    return { clz_name: clz_name, newClz: newClz };
}
exports.load = load;
