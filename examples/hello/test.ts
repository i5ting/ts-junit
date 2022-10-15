// tests/demo.js
import * as assert from "uvu/assert";

import { Test, DisplayName } from "@ts-junit/core";

@DisplayName("Clz test case")
// @Disabled("Disabled all Clazz until bug #99 has been fixed")
export default class MyFirstJUnitJupiterTests {
  @Test
  addition() {
    assert.is(Math.sqrt(4), 2);
    assert.is(Math.sqrt(4), 2);
  }
}
