// @ts-nocheck
import * as fs from "node:fs";
import * as path from "node:path";
import debugModule from "debug";

import { getAllImportsForFile, getNeedCompileFiles } from "./ast";

export * from "./ast";
export * from "./scan";
export * from "./require";
export * from "./flatten";

export const debug = Debug("ts-junit");

/**
 *
 * @internal
 * @see https://github.com/i5ting/quickdebug/
 */
export function Debug(name?: string) {
  const key = name ? name : get_closest_package_json().name;

  return DebugWith(key);
}

/**
 *
 * @internal
 * @see https://github.com/i5ting/colondebug/
 */
export function DebugWith(key: string) {
  const operation = key.split(":").pop();
  let debug = debugModule(key);

  if (Object.keys(console).includes(operation)) {
    debug = console[operation];
  }

  return debug;
}

/** @internal */
export function get_closest_package_json() {
  const debug = DebugWith("ts-junit:utils");

  let config;
  let isNext = true;

  module.paths.forEach(function (i) {
    const file = i.replace("node_modules", "package.json");

    if (isNext && fs.existsSync(file) === true) {
      try {
        // break with flag
        isNext = false;

        // log
        debug("exist file = " + file);

        // get package.json content
        config = require(file);
      } catch (e) {
        console.error("get_closest_package_json" + e);
      }
    } else {
      debug("not exist file = " + file);
    }
  });

  return config;
}

/** @internal */
export function getCompileFiles(testFiles: string[]) {
  const allfiles = [];
  for (let testFile of testFiles) {
    // make sure cli args 'file.ts'
    testFile = testFile.replace(".ts", "");

    let testTsFile = testFile;
    let testJsFile = testFile;

    // const a = getDependencyImports(['./tests/test.ts','./tests/a/test2.ts'])
    const extension = path.extname(testFile);
    if (!extension) {
      testTsFile += ".ts";
      testJsFile += ".js";

      testTsFile = testTsFile.replace(process.cwd() + "/", "");

      testJsFile =
        path.resolve(__dirname, "../") +
        "/output" +
        testJsFile.replace(process.cwd(), "");
    }

    getAllImportsForFile(testTsFile);

    const needCompileFiles = getNeedCompileFiles();

    allfiles.push(...needCompileFiles);
    // let debug = console.dir
    debug("needCompileFiles");
    debug(needCompileFiles);
  }

  // console.dir(allfiles);
  return unique(allfiles.reverse());
}

/** @internal */
export function unique(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

/** @internal */
export function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

/** @internal */
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
