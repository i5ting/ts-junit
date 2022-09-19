"use strict";
exports.__esModule = true;
exports.flatten = void 0;
var Utils_1 = require("../Utils");
var debug = (0, Utils_1.Debug)();
function flatten(node, path, nodeList) {
    if (path === void 0) { path = ''; }
    if (nodeList === void 0) { nodeList = []; }
    if (node != null) {
        debug('node i');
        // let children = node.children
        for (var i in node) {
            debug(i);
            debug(node[i]);
            if (node[i]['newClz']) {
                debug('找到了具体的object了 ' + path);
                node[i]['path'] = path + '/' + i;
                nodeList.push(node[i]);
            }
            else {
                debug('没找到，继续深度优先' + i);
                flatten(node[i], path + '/' + i, nodeList);
            }
        }
    }
    return nodeList;
}
exports.flatten = flatten;
