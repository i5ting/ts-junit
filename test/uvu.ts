import { test } from "uvu";
import * as path from "node:path";
import * as assert from "uvu/assert";

import { getAllImportsForFile, getNeedCompileFiles } from "../src/ast";

test("Math.sqrt()", () => {
  assert.is(Math.sqrt(4), 2);
  assert.is(Math.sqrt(144), 12);
  assert.is(Math.sqrt(2), Math.SQRT2);
});

test.only("getAllImportsForFile()", () => {
  const testFile = process.cwd() + "/examples/test";

  let testTsFile = testFile;
  let testJsFile = testFile;

  // const a = getDependencyImports(['./tests/test.ts','./tests/a/test2.ts'])
  const extension = path.extname(testFile);
  if (!extension) {
    testTsFile += ".ts";
    testJsFile += ".js";

    testTsFile = testTsFile.replace(process.cwd() + "/", "");

    testJsFile =
      path.resolve(process.cwd(), "./") +
      "/output" +
      testJsFile.replace(process.cwd(), "");
  }

  getAllImportsForFile(testTsFile, { verbose: false });

  const needCompileFiles = getNeedCompileFiles();

  assert.is(needCompileFiles.length, 14);
});

test("JSON", () => {
  const input = {
    foo: "hello",
    bar: "world",
  };

  const output = JSON.stringify(input);

  assert.snapshot(output, `{"foo":"hello","bar":"world"}`);
  assert.equal(JSON.parse(output), input, "matches original");
});

test.run();
