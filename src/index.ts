import * as fs from "node:fs";
import * as path from "node:path";
import * as Promise2 from "bluebird";
import Context from "./Context";
import UvuStrategy from "./UvuStrategy";
import { WatchFile } from "./Watch";
import { Debug, getFiles } from "./Utils";
import { dir } from "node:console";

const debug = Debug();

export * from "./Decrator";
export * from "./IStrategy";
export * from "./Watch";
export * from "./Ast";
export * from "./Utils";
export * from "./parse";
export * from "./loadObject/scan";
export * from "./loadObject/require";
export * from "./loadObject/flatten";

export function executeWithDefaultStrategy(dirs: string[]) {
  debug("executeWithDefaultStrategy");

  // set context use default strategy
  const context = new Context(new UvuStrategy());

  // get all file from rest(file or folder)
  const files = getFiles(dirs);

  // compile and watch, then run test
  files.map(function (file) {
    WatchFile(file, context);
  });
}

export function executeFileWithDefaultStrategy(testFiles: string[]) {
  debug("executeFileWithDefaultStrategy");

  // set context use default strategy
  const context = new Context(new UvuStrategy());

  // compile and watch, then run test
  testFiles.map(function (file) {
    WatchFile(file, context);
  });
}

export function execute(rest: any) {
  debug("execute With Strategy");
  console.time("build ts");

  // set context use default strategy
  const context = new Context(new UvuStrategy());

  // get all file from rest(file or folder)
  const files = getFiles(rest);

  // compile and watch, then run test
  files.map(function (file) {
    WatchFile(file, context);
  });
}

/**
 * run([path.resolve(process.cwd(), "./tests/")])
 * run([path.resolve(process.cwd(), "./tests/"),path.resolve(process.cwd(), "./tests/test.ts")])
 */
export function run(rest: any) {
  debug("run With UvuStrategy");

  // set context use default strategy
  const context = new Context(new UvuStrategy());

  // get all file from rest(file or folder)
  const files = getFiles(rest);

  // run tests
  context.runTsTestFiles(files);
}
