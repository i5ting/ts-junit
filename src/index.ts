import * as fs from "node:fs";
import * as path from "node:path";
import * as Promise2 from "bluebird";
import Context from "./Context";
import UvuStrategy from "./UvuStrategy";
import { WatchFiles } from "./Watch";
import { Debug, getFiles } from "./Utils";

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

/**
 * for cli invoke (need compile ts to js)
 *
 * run([path.resolve(process.cwd(), "./tests/")])
 * run([path.resolve(process.cwd(), "./tests/"),path.resolve(process.cwd(), "./tests/test.ts")])
 */
export function runCli(rest: any) {
  debug("runCli With UvuStrategy");
  console.time("build ts");

  // set context use default strategy
  const context = new Context(new UvuStrategy());

  // get all file from rest(file or folder)
  const files = getFiles(rest);

  // compile and watch, then run test
  WatchFiles(files, context);
}

/**
 * for api invoke (use ts-node)
 * 
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
