"use strict";
exports.__esModule = true;
exports.Disabled = exports.DisplayName = exports.Test = exports.AfterAll = exports.AfterEach = exports.BeforeEach = exports.BeforeAll = exports.data = exports.emptydata = void 0;
var Utils_1 = require("./Utils");
var debug = (0, Utils_1.Debug)("ts-junit");
var cache = {};
function emptydata() {
    debug('emptydata := {}');
    debug(cache);
    cache = {};
    return cache;
}
exports.emptydata = emptydata;
function data() {
    debug('Data Dump:');
    debug(cache);
    return cache;
}
exports.data = data;
function BeforeAll(target, propertyName, descriptor) {
    debug("BeforeAll");
    // console.dir(propertyName)
    // console.dir(descriptor)
    // test(cache[propertyName] || "default", target[propertyName])
    // test.run()
    var className = target.constructor.name;
    if (!cache[className])
        cache[className] = {};
    if (!cache[className]['hook'])
        cache[className]['hook'] = {};
    cache[className]['hook']['before'] = target[propertyName];
    debug("exist hook: ".concat(className, ".hook.before"));
}
exports.BeforeAll = BeforeAll;
function BeforeEach(target, propertyName, descriptor) {
    debug(target[propertyName]);
    // console.dir(propertyName)
    // console.dir(descriptor)
    var className = target.constructor.name;
    if (!cache[className])
        cache[className] = {};
    if (!cache[className]['hook'])
        cache[className]['hook'] = {};
    cache[className]['hook']['before.each'] = target[propertyName];
    debug("exist hook: ".concat(className, ".hook.before.each"));
}
exports.BeforeEach = BeforeEach;
function AfterEach(target, propertyName, descriptor) {
    debug(target[propertyName]);
    // console.dir(propertyName)
    // console.dir(descriptor)
    var className = target.constructor.name;
    if (!cache[className])
        cache[className] = {};
    if (!cache[className]['hook'])
        cache[className]['hook'] = {};
    cache[className]['hook']['after.each'] = target[propertyName];
    debug("exist hook: ".concat(className, ".hook.after.each"));
}
exports.AfterEach = AfterEach;
function AfterAll(target, propertyName, descriptor) {
    debug(target[propertyName]);
    // console.dir(propertyName)
    // console.dir(descriptor)
    var className = target.constructor.name;
    if (!cache[className])
        cache[className] = {};
    if (!cache[className]['hook'])
        cache[className]['hook'] = {};
    cache[className]['hook']['after'] = target[propertyName];
    debug("exist hook: ".concat(className, ".hook.after"));
}
exports.AfterAll = AfterAll;
function Test(target, propertyName, descriptor) {
    debug(target[propertyName]);
    //classname
    var className = target.constructor.name;
    // console.log(target.constructor.name);
    // console.dir(Object.keys(target))
    // console.log(Reflect.ownKeys(target));
    // console.log(className);
    // console.dir(propertyName)
    if (!cache[className])
        cache[className] = {};
    if (!cache[className][propertyName])
        cache[className][propertyName] = {};
    // console.dir(Object.keys(target).join('-'))
    cache[className][propertyName]['desc'] = 'no display name';
    cache[className][propertyName]['fn'] = target[propertyName];
}
exports.Test = Test;
/**
 * Creates a test case DisplayName.
 * Can be used on entity property or on entity.
 * Can create suite name when used on entity.
 */
function DisplayName(message) {
    // console.dir(message)
    return function (clsOrObject, propertyName) {
        var target = propertyName ? clsOrObject.constructor : clsOrObject;
        var className = target.name;
        if (!cache[className])
            cache[className] = {};
        if (propertyName) {
            // when @DisplayName with property
            // test(message, fn)
            // 
            // when
            //      @Test
            //      @DisplayName("Custom test name 1")
            //      @DisplayName("Custom test name 2")
            // message = "Custom test name 2"
            // console.dir(className)
            if (!cache[className][propertyName]) {
                cache[className][propertyName] = {
                    'desc': message
                };
            }
            debug("when @DisplayName with property: ".concat(message));
        }
        else {
            // when @DisplayName with class
            // const testSuite = suite(message);
            debug("when @DisplayName with class: ".concat(message));
            var className_1 = target.name;
            // console.dir(className)
            // cache[className]['desc'] = message
        }
    };
}
exports.DisplayName = DisplayName;
/**
 * Creates a test case DisplayName.
 * Can be used on entity property or on entity.
 * Can create suite name when used on entity.
 */
function Disabled(message) {
    // console.dir(message)
    return function (clsOrObject, propertyName) {
        var target = propertyName ? clsOrObject.constructor : clsOrObject;
        var className = target.name;
        if (!cache[className])
            cache[className] = {};
        if (propertyName) {
            // when @DisplayName with property
            // test(message, fn)
            // 
            // when
            //      @Test
            //      @DisplayName("Custom test name 1")
            //      @DisplayName("Custom test name 2")
            // message = "Custom test name 2"
            // cache[propertyName] = message
            debug("when @Disabled with property: ".concat(message));
            if (!cache[className][propertyName]) {
                cache[className][propertyName] = {};
                debug(cache[className][propertyName]);
            }
            cache[className][propertyName]['skip'] = true;
            cache[className][propertyName]['skipReason'] = message;
        }
        else {
            // when @DisplayName with class
            // const testSuite = suite(message);
            debug("when @DisplayName with class: ".concat(message));
            cache[className]['skipClaas'] = true;
            cache[className]['skipClaasReason'] = message;
        }
    };
}
exports.Disabled = Disabled;
