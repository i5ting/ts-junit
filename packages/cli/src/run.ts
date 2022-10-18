import * as path from "path";
import { Strategy, UvuStrategy } from "@ts-junit/core";
import { debug } from "./debug";
import { CliContext } from "./context";

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

  // prepare options for context
  const base = process.cwd();
  const buildRoot = path.resolve(__dirname, "..");
  const buildBase = path.resolve(__dirname, "../output");

  // set context use strategy and options
  const context = new CliContext(strategy, {
    rest: rest,
    base: base,
    buildRoot: buildRoot,
    buildBase: buildBase,
  });

  // compile and watch, then run test
  context.watch();

  // time statistics
  console.timeEnd("build ts");
}
