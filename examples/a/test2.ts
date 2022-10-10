// tests/demo.js
import * as assert from "uvu/assert";
// test('Math.sqrt()', () => {
//   assert.is(Math.sqrt(4), 2);
//   assert.is(Math.sqrt(144), 12);
//   assert.is(Math.sqrt(2), Math.SQRT2);
// });

// test('JSON', () => {
//   const input = {
//     foo: 'hello',
//     bar: 'world'
//   };

//   const output = JSON.stringify(input);

//   assert.snapshot(output, `{"foo":"hello","bar":"world"}`);
//   assert.equal(JSON.parse(output), input, 'matches original');
// });


import Calculator from '../../calculator';

import { Test, BeforeEach, BeforeAll, AfterAll, AfterEach, DisplayName, Disabled } from '../../src/index'

@DisplayName("Clz2 test case")
// @Disabled("Disabled all Clazz until bug #99 has been fixed")
export default class ATests {
  a: Number = 1;
  b: String;
  calculator = new Calculator();
  // @Test
  // @BeforeAll
  initAll() {
    // assert.is(Math.sqrt(4), 12);
    console.log("BeforeAll initAll");
    this.a = 2;
  }

  // @BeforeEach
  init() {
    console.log("BeforeEach");
  }

  // @AfterEach
  // tearDown() {
  //     console.log('---AfterEach')
  // }

  // @AfterAll
  // tearDownAll() {
  //     console.log('AfterAll---')
  // }

  @Test
  succeedingTest() {
    // console.dir('succeedingTest')
    // console.dir(this)
    // assert.ok(this.a === 2);
    assert.is(Math.sqrt(4), 2);
  }

  // @Test
  @Test
  addition() {
    // assert.ok(Math.sqrt(4)===1);
    assert.is(Math.sqrt(4), 2);
    assert.is(Math.sqrt(4), 2);
  }

  @Test
  @DisplayName("Custom test name containing spaces111")
  @DisplayName("Custom test name containing spaces222")
  @Disabled("Disabled until bug #42 has been resolved")
  addition5() {
    assert.is(Math.sqrt(4), 2);
    assert.is(Math.sqrt(4), 2);
    assert.is(Math.sqrt(4), 2);
  }
}

