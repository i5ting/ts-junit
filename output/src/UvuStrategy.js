"use strict";
exports.__esModule = true;
var uvu_1 = require("uvu");
var Utils_1 = require("./Utils");
var debug = (0, Utils_1.Debug)();
/**
 * Concrete Strategies implement the Uvu test framework while following the base Strategy
 * interface. The interface makes them interchangeable in the Context.
 */
var UvuStrategy = /** @class */ (function () {
    function UvuStrategy() {
    }
    UvuStrategy.prototype.testcase = function (name) {
        debug("testcase(name: string): any {}");
        this.test = (0, uvu_1.suite)(name);
    };
    UvuStrategy.prototype.parseData = function (i, clz_name, Clazz, obj) {
        if (Clazz['skipClaas']) {
            console.warn("skip Class ".concat(clz_name, " reason: ").concat(Clazz.skipClaasReason));
        }
        else {
            for (var j in Clazz) {
                if (j === 'hook') {
                    for (var z in Clazz['hook']) {
                        debug(z + " hook=" + Clazz['hook'][z]);
                        if (z.split('.').length == 2) {
                            var a = z.split('.');
                            debug('a1= ' + a);
                            this.test[a[0]][a[1]](Clazz['hook'][z].bind(obj));
                        }
                        else {
                            debug(z + ' a2= ' + Clazz['hook'][z]);
                            this.test[z](Clazz['hook'][z].bind(obj));
                        }
                    }
                }
                else {
                    if (!Clazz[j]['skip']) {
                        debug("define testcase ".concat(j));
                        debug(' test.handler = ' + obj[j]);
                        this.test(j, obj[j].bind(obj));
                    }
                    else {
                        debug("skipReason ".concat(j));
                        console.warn("skip ".concat(Clazz[i], "#").concat(j, "() reason: ").concat(Clazz[j]['skipReason']));
                    }
                }
            }
        }
    };
    return UvuStrategy;
}());
exports["default"] = UvuStrategy;
