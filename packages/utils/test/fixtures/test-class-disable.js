"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
// tests/demo.js
var assert = require("uvu/assert");
var calculator_1 = require("../calculator");
var index_1 = require("../src/index");
var MyFirstJUnitJupiterTests = /** @class */ (function () {
  function MyFirstJUnitJupiterTests() {
    this.a = 1;
    this.calculator = new calculator_1["default"]();
  }
  // @Test
  MyFirstJUnitJupiterTests.prototype.initAll = function () {
    // assert.is(Math.sqrt(4), 12);
    console.log('BeforeAll initAll');
    this.a = 2;
  };
  MyFirstJUnitJupiterTests.prototype.init = function () {
    console.log('BeforeEach');
  };
  MyFirstJUnitJupiterTests.prototype.tearDown = function () {
    console.log('---AfterEach');
  };
  MyFirstJUnitJupiterTests.prototype.tearDownAll = function () {
    console.log('AfterAll---');
  };
  MyFirstJUnitJupiterTests.prototype.succeedingTest = function () {
    assert.ok(this.a === 2);
    assert.is(Math.sqrt(4), 2);
  };
  MyFirstJUnitJupiterTests.prototype.addition = function () {
    assert.is(Math.sqrt(4), 2);
    assert.is(Math.sqrt(4), 2);
  };
  MyFirstJUnitJupiterTests.prototype.addition5 = function () {
    assert.is(Math.sqrt(4), 2);
    assert.is(Math.sqrt(4), 2);
    assert.is(Math.sqrt(4), 2);
    assert.is(Math.sqrt(4), 2);
  };
  __decorate([
    index_1.BeforeAll
  ], MyFirstJUnitJupiterTests.prototype, "initAll");
  __decorate([
    index_1.BeforeEach
  ], MyFirstJUnitJupiterTests.prototype, "init");
  __decorate([
    index_1.AfterEach
  ], MyFirstJUnitJupiterTests.prototype, "tearDown");
  __decorate([
    index_1.AfterAll
  ], MyFirstJUnitJupiterTests.prototype, "tearDownAll");
  __decorate([
    index_1.Test
  ], MyFirstJUnitJupiterTests.prototype, "succeedingTest");
  __decorate([
    index_1.Test
  ], MyFirstJUnitJupiterTests.prototype, "addition");
  __decorate([
    index_1.Test,
    (0, index_1.DisplayName)("Custom test name containing spaces111"),
    (0, index_1.DisplayName)("Custom test name containing spaces222"),
    (0, index_1.Disabled)("Disabled until bug #42 has been resolved")
  ], MyFirstJUnitJupiterTests.prototype, "addition5");
  MyFirstJUnitJupiterTests = __decorate([
    (0, index_1.DisplayName)("Clz test case"),
    (0, index_1.Disabled)("Disabled all Clazz until bug #99 has been fixed")
  ], MyFirstJUnitJupiterTests);
  return MyFirstJUnitJupiterTests;
}());
exports["default"] = MyFirstJUnitJupiterTests;
