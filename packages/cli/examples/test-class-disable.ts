// @ts-nocheck
import * as assert from "uvu/assert";
import Calculator from "../calculator";

import {
  Test,
  BeforeEach,
  BeforeAll,
  AfterAll,
  AfterEach,
  DisplayName,
  Disabled,
} from "@ts-junit/core";

@DisplayName("Clz test case")
@Disabled("Disabled all Clazz until bug #99 has been fixed")
export default class ClassDisableTests {
  a = 1;
  b: string;
  calculator = new Calculator();
  // @Test
  @BeforeAll
  initAll() {
    // assert.is(Math.sqrt(4), 12);
    console.log("BeforeAll initAll");
    this.a = 2;
  }

  @BeforeEach
  init() {
    console.log("BeforeEach");
  }

  @AfterEach
  tearDown() {
    console.log("---AfterEach");
  }

  @AfterAll
  tearDownAll() {
    console.log("AfterAll---");
  }

  @Test
  @Disabled("Disabled succeedingTest")
  succeedingTest() {
    assert.ok(this.a === 2);
    assert.is(Math.sqrt(4), 2);
  }

  @Test
  addition() {
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
    assert.is(Math.sqrt(4), 2);
  }
}
