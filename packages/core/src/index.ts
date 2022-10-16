import { Context } from "./context";
import { Strategy, UvuStrategy } from "@ts-junit/strategy";
import { debug, getFiles } from "@ts-junit/utils";

export * from "./context";
export * from "./watch";
export * from "./parse";

export * from "@ts-junit/decorator";
export * from "@ts-junit/strategy";
export * from "@ts-junit/utils";

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

  // run tests
  context.runTsTestFiles(files);

  // time statistics
  console.timeEnd("run ts");
}
