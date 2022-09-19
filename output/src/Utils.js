"use strict";
exports.__esModule = true;
exports.get_closest_package_json = exports.DebugWith = exports.Debug = void 0;
var fs = require('fs');
// see https://github.com/i5ting/quickdebug/
function Debug(name) {
    var key = name ? name : get_closest_package_json().name;
    return DebugWith(key);
}
exports.Debug = Debug;
// see https://github.com/i5ting/colondebug/
function DebugWith(key) {
    var operation = key.split(':').pop();
    var debug = require('debug')(key);
    if (Object.keys(console).includes(operation)) {
        debug = console[operation];
    }
    return debug;
}
exports.DebugWith = DebugWith;
function get_closest_package_json() {
    var debug = DebugWith("ts-junit:utils");
    var config;
    var isNext = true;
    module.paths.forEach(function (i) {
        var file = i.replace('node_modules', 'package.json');
        if (isNext && fs.existsSync(file) === true) {
            try {
                // break with flag
                isNext = false;
                // log
                debug('exist file = ' + file);
                // get package.json content
                config = require(file);
            }
            catch (e) {
                console.error('get_closest_package_json' + e);
            }
        }
        else {
            debug('not exist file = ' + file);
        }
    });
    return config;
}
exports.get_closest_package_json = get_closest_package_json;
// var debuglog = Debug()
// debuglog(Object.keys(console))
