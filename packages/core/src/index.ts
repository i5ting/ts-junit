import Context from "./context";
import { Strategy, UvuStrategy } from "@ts-junit/strategy";
import { debug, getFiles } from "@ts-junit/utils";
import { WatchFiles } from "./watch";

export * from "./watch";
export * from "./parse";

export * from "@ts-junit/decorator";

/**
 * for cli invoke (need compile ts to js)
 *
 * run([path.resolve(process.cwd(), "./tests/")])
 * run([path.resolve(process.cwd(), "./tests/"),path.resolve(process.cwd(), "./tests/test.ts")])
 *
 * @public
 */
export function runCli(rest: any, strategy: Strategy = new UvuStrategy()) {
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
export function run(rest: any, strategy: Strategy = new UvuStrategy()) {
  debug("run With UvuStrategy");
  console.time("run ts");

  // set context use default strategy
  const context = new Context(strategy);

  // get all file from rest(file or folder)
  const files = getFiles(rest);

  console.dir(files);

  // run tests
  context.runTsTestFiles(files);

  // time statistics
  console.timeEnd("run ts");
}
