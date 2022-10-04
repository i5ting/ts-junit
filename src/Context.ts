import * as fs from 'node:fs'
import * as Promise2 from "bluebird";
import { loadFromDecorator, loadFromCache } from "./loadObject/scan";
import { Debug } from "./Utils";

const debug = Debug("ts-junit");

import IStrategy from "./IStrategy";
import { assert } from "node:console";

/**
 * The Context defines the interface of interest to clients.
 */
export default class Context {
  /**
   * @type {IStrategy} The Context maintains a reference to one of the Strategy
   * objects. The Context does not know the concrete class of a strategy. It
   * should work with all strategies via the Strategy interface.
   */
  private strategy: IStrategy;

  /**
   * Usually, the Context accepts a strategy through the constructor, but also
   * provides a setter to change it at runtime.
   */
  constructor(strategy: IStrategy) {
    this.strategy = strategy;
  }

  /**
   * Usually, the Context allows replacing a Strategy object at runtime.
   */
  public setStrategy(strategy: IStrategy) {
    this.strategy = strategy;
  }

  /**
   * run one test file
   *
   * parse ts to get decorator meta data
   * invoke js to run test
   */
  public runTest(tsFile: string, jsFile: string): void {
    debug("runTest: " + jsFile);

    assert(fs.existsSync(jsFile));

    debug(" --- runTest --- ");
    let nodeList = [loadFromDecorator(jsFile)];

    debug("--------------- MAIN ------------------");
    debug("nodeList");
    debug(nodeList);

    for (let i in nodeList) {
      const Clazz = nodeList[i];
      debug("Clazz---");
      debug(Clazz);

      let newClz = Clazz.newClz;

      debug(newClz);

      var obj = Clazz.newClz.__obj;
      delete newClz.__obj;

      debug("Context: Run tests using the strategy (not sure how it'll do it)");

      this.strategy.testcase(Clazz.clz_name);

      //   let d = console.dir;
      //   d(i);
      //   d(Clazz.clz_name);
      //   d(newClz);
      //   d(obj);

      this.strategy.parseData(i, Clazz.clz_name, newClz, obj);

      this.strategy.test.run();
    }
  }

  public runTsTestFiles(files: string[]): any {
    files = files.map(function (file) {
      return file.replace(".ts", "");
    });
    var that = this;
    const iterator = async (element) => that._runTsTestFile(element);
    return Promise2.each(files, iterator);
  }

  private _runTsTestFile(file: string): any {
    debug(" --- runTests --- ");
    // console.dir("load ts file=" + file);
    let that = this;

    debug(" --- runTest --- ");
    return loadFromCache(file).then(function (result) {
      let nodeList = [result];
      // console.dir(result);
      for (let i in nodeList) {
        const Clazz = nodeList[i];
        debug("Clazz---");
        debug(Clazz);

        let newClz = Clazz.newClz;

        debug(newClz);

        var obj = Clazz.newClz.__obj;
        delete newClz.__obj;

        debug(
          "Context: Run tests using the strategy (not sure how it'll do it)"
        );
        // console.dir(that);

        that.strategy.testcase(Clazz.clz_name);

        // let d = console.dir;
        // d(i);
        // d(Clazz.clz_name);
        // d(newClz);
        // d(obj);
        that.strategy.parseData(i, Clazz.clz_name, newClz, obj);

        that.strategy.test.run();
      }
    });
  }
}
