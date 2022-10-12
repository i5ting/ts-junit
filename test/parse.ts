import { test } from "uvu";
import * as path from "node:path";
import * as assert from "uvu/assert";

import { Parse, getDataMapping, getEableRunDataMapping } from "../src";

test("Parse(commonjsFile)", () => {
  const file = (true as unknown)
    ? "./fixtures/test-class-disable.js"
    : "./fixtures/test.js";
  const source = path.resolve(__dirname, file);
  const json = Parse(source);
  // console.dir(json)
  // fs.writeFileSync(path.resolve(__dirname, './fixtures/decorator.json'), JSON.stringify(json, null, 4));

  // const source1 = path.resolve(__dirname, './fixtures/test-class-disable.js')
  // const json1 = Parse(source1)
  // console.dir(json1)
  // fs.writeFileSync(path.resolve(__dirname, './fixtures/decorator-class-disable.json'), JSON.stringify(json1, null, 4));
  assert.is(json.length, 8);

  // 0:{
  //   type: 2,
  //   args: 3,
  //   a: [ [Array] ],
  //   b: [ 'MyFirstJUnitJupiterTests', 'prototype' ],
  //   c: 'initAll'
  // },

  assert.is(json[0]["type"], 2);
  assert.is(json[0]["args"], 3);
  assert.is(json[0]["b"][0], "MyFirstJUnitJupiterTests");
  assert.is(json[0]["c"], "initAll");
});

test("getData()", () => {
  const source = path.resolve(__dirname, "./fixtures/test.js");
  const arr = getDataMapping(source);

  // console.log(arr)

  assert.is(arr.length, 8);
  assert.is(Math.sqrt(144), 12);
  assert.is(Math.sqrt(2), Math.SQRT2);
});

test("getData() with class disabled", () => {
  const source = path.resolve(__dirname, "./fixtures/test-class-disable.js");
  const arr = getDataMapping(source);

  // console.log(arr)

  assert.is(arr.length, 8);
});

test("getEableRunDataMapping() with class disabled", () => {
  const source = path.resolve(__dirname, "./fixtures/test-class-disable.js");
  const arr = getEableRunDataMapping(source);

  // console.log(arr)

  assert.is(arr.length, 0);
});

test("getEableRunDataMapping() ", () => {
  const source1 = path.resolve(__dirname, "./fixtures/test.js");
  const arr1 = getEableRunDataMapping(source1);

  // console.log(arr1)

  assert.is(arr1.length, 7);
});

test.run();
