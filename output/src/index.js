"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
exports.execute = exports.executeFileWithDefaultStrategy = exports.executeWithDefaultStrategy = void 0;
var Context_1 = require("./Context");
var UvuStrategy_1 = require("./UvuStrategy");
var Utils_1 = require("./Utils");
var debug = (0, Utils_1.Debug)();
__exportStar(require("./decrator"), exports);
__exportStar(require("./IStrategy"), exports);
__exportStar(require("./Watch"), exports);
__exportStar(require("./ast"), exports);
function executeWithDefaultStrategy(dir) {
    debug('executeWithDefaultStrategy');
    var context = new Context_1["default"](new UvuStrategy_1["default"]());
    context.runTests(dir);
}
exports.executeWithDefaultStrategy = executeWithDefaultStrategy;
function executeFileWithDefaultStrategy(file) {
    debug('executeFileWithDefaultStrategy');
    var context = new Context_1["default"](new UvuStrategy_1["default"]());
    context.runTest(file);
}
exports.executeFileWithDefaultStrategy = executeFileWithDefaultStrategy;
function execute(dir, strategy) {
    debug('execute With Strategy');
    var context = new Context_1["default"](strategy);
    context.runTests(dir);
}
exports.execute = execute;
