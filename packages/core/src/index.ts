import Context from "./context";
import UvuStrategy from "../../uvu-strategy/src";
import { WatchFiles } from "./watch";
import { IStrategy } from "../../uvu-strategy/src/iStrategy";

const debug = Debug();

export * from "../../uvu-strategy/src/iStrategy";
export * from "./watch";
export * from "./parse";

/**
 * for cli invoke (need compile ts to js)
 *
 * run([path.resolve(process.cwd(), "./tests/")])
 * run([path.resolve(process.cwd(), "./tests/"),path.resolve(process.cwd(), "./tests/test.ts")])
 *
 * @public
 */
export function runCli(rest: any, strategy: IStrategy = new UvuStrategy()) {
  debug("runCli With UvuStrategy");
  console.time("build ts");

  // set context use default strategy
  const context = new Context(strategy);

  // get all file from rest(file or folder)
  const files = getFiles(rest);

  // compile and watch, then run test
  WatchFiles(files, context);

  // time statistics
  console.timeEnd("build ts");
}

/**
 * for api invoke (use ts-node)
 *
 * run([path.resolve(process.cwd(), "./tests/")])
 * run([path.resolve(process.cwd(), "./tests/"),path.resolve(process.cwd(), "./tests/test.ts")])
 *
 * @public
 */
export function run(rest: any, strategy: IStrategy = new UvuStrategy()) {
  debug("run With UvuStrategy");
  console.time("run ts");

  // set context use default strategy
  const context = new Context(strategy);

  // get all file from rest(file or folder)
  const files = getFiles(rest);

  // run tests
  context.runTsTestFiles(files);

  // time statistics
  console.timeEnd("run ts");
}
