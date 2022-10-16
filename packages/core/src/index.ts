import * as path from "path";

import { Context } from "./context";
import { Strategy, UvuStrategy } from "@ts-junit/strategy";
import { debug } from "@ts-junit/utils";

export * from "./context";

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

  // get file base
  const base = path.resolve(__dirname, ".");

  // set context use default strategy
  const context = new Context(strategy, { rest: rest, base: base });

  // run tests
  context.runTests(rest);

  // time statistics
  console.timeEnd("run ts");
}
