// @ts-nocheck
import Promise2 from "bluebird";
import { Strategy } from "@ts-junit/strategy";
import { loadFromCache } from "@ts-junit/decorator";
import { debug } from "./debug";
import { getFiles } from "./utils";

interface ContextOptions {
  rest: string[];
  base: string;
  buildRoot?: string;
  buildOutput?: string;
}

/**
 * The Context defines the interface of interest to clients.
 *
 * @public
 */
export class Context {
  /**
   * The Context maintains a reference to one of the Strategy
   * objects. The Context does not know the concrete class of a strategy. It
   * should work with all strategies via the Strategy interface.
   *
   * @remarks
   */
  private strategy: Strategy;

  /**
   * Usually, the Context accepts a strategy through the constructor, but also
   * provides a setter to change it at runtime.

   * @remarks
   */
  constructor(strategy: Strategy, options: ContextOptions) {
    this.strategy = strategy;
    this.options = options;
    this.base = options?.base || process.cwd();
    this.buildRoot = options.buildRoot;
    this.buildOutput = options.buildOutput;
    this.rest = options.rest;
  }

  /**
   * Usually, the Context allows replacing a Strategy object at runtime.
   *
   * @remarks
   */
  public setStrategy(strategy: Strategy) {
    this.strategy = strategy;
  }

  public runTests(): any {
    // const rest = this.rest;
    // get all file from rest(file or folder)
    let files = getFiles(this);

    files = files.map(function (file) {
      return file.replace(".ts", "");
    });

    debug(files);
    const iterator = async (element) => this._runTsTestFile(element);
    return Promise2.each(files, iterator);
  }

  /**
   * Usually, run single typescript test for api mode
   *
   * 1. import ts test file (in example/*.js)
   * 2. require ts-junit dist/decorator.js
   * 3. parse data from dist/decorator.js cache
   * 4. final, run tests
   */
  private _runTsTestFile(file: string): any {
    debug(" --- runTest --- ");
    debug(file);
    return loadFromCache(file).then((result) => {
      const nodeList = [result];
      debug(result);
      for (const i in nodeList) {
        const Clazz = nodeList[i];
        debug("Clazz---");
        debug(Clazz);

        const newClz = Clazz.newClz;

        debug(newClz);

        const obj = Clazz.newClz.__obj;
        delete newClz.__obj;

        debug(
          "Context: Run tests using the strategy (not sure how it'll do it)",
        );

        this.strategy.testcase(Clazz.clz_name);

        // let d = console.dir;
        // d(i);
        // d(Clazz.clz_name);
        // d(newClz);
        // d(obj);
        this.strategy.parseData(i, Clazz.clz_name, newClz, obj);

        this.strategy.test.run();
      }
    });
  }
}
