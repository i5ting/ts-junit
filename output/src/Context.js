"use strict";
exports.__esModule = true;
var scan_1 = require("./loadObject/scan");
var Utils_1 = require("./Utils");
var Watch_1 = require("./Watch");
var debug = (0, Utils_1.Debug)("ts-junit");
/**
 * The Context defines the interface of interest to clients.
 */
var Context = /** @class */ (function () {
    /**
     * Usually, the Context accepts a strategy through the constructor, but also
     * provides a setter to change it at runtime.
     */
    function Context(strategy) {
        this.strategy = strategy;
    }
    /**
     * Usually, the Context allows replacing a Strategy object at runtime.
     */
    Context.prototype.setStrategy = function (strategy) {
        this.strategy = strategy;
    };
    Context.prototype.runTests = function (dir) {
        debug(" --- runTests --- ");
        (0, Watch_1.Watch)(dir);
        // let nodeList = scan(dir)
        // debug("--------------- MAIN ------------------")
        // debug(nodeList)
        // for (let i in nodeList) {
        //     const Clazz = nodeList[i]
        //     debug("Clazz---")
        //     debug(Clazz)
        //     let newClz = Clazz.newClz
        //     debug(newClz)
        //     var obj = Clazz.newClz.__obj
        //     delete newClz.__obj
        //     debug('Context: Run tests using the strategy (not sure how it\'ll do it)');
        //     this.strategy.testcase(Clazz.clz_name)
        //     this.strategy.parseData(i, Clazz.clz_name, newClz, obj);
        //     this.strategy.test.run()
        // }
    };
    Context.prototype.runTest = function (file) {
        debug(" --- runTest --- ");
        var nodeList = [(0, scan_1.load)(file)];
        debug("--------------- MAIN ------------------");
        debug(nodeList);
        for (var i in nodeList) {
            var Clazz = nodeList[i];
            debug("Clazz---");
            debug(Clazz);
            var newClz = Clazz.newClz;
            debug(newClz);
            var obj = Clazz.newClz.__obj;
            delete newClz.__obj;
            debug('Context: Run tests using the strategy (not sure how it\'ll do it)');
            this.strategy.testcase(Clazz.clz_name);
            this.strategy.parseData(i, Clazz.clz_name, newClz, obj);
            this.strategy.test.run();
        }
    };
    return Context;
}());
exports["default"] = Context;
