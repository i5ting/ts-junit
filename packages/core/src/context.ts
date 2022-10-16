// @ts-nocheck

import * as path from "node:path";
import * as fs from "node:fs";

import Promise2 from "bluebird";

import { debug, unique } from "@ts-junit/utils";

import { Strategy } from "@ts-junit/strategy";

import { loadFromCache } from "@ts-junit/decorator";

// function registerRequireExtension(
//   target: NodeJS.RequireExtensions,
//   callback: (ext: string, module: NodeJS.Module, context: string) => void,
// ) {
//   const extensions = Object.keys(target) as (keyof typeof target)[];

//   Object.assign(
//     require.extensions,
//     extensions.reduce((result, ext) => {
//       return {
//         ...result,
//         [ext]: (module: NodeJS.Module, context: string) => {
//           callback(ext as string, module, context);
//           return target[ext]?.(module, context);
//         },
//       };
//     }, {} as NodeJS.RequireExtensions),
//   );
// }

// function unregisterRequireExtension(target: NodeJS.RequireExtensions) {
//   Object.assign(require.extensions, target);
// }

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
  constructor(strategy: Strategy, options: any) {
    this.strategy = strategy;
    this.options = options;
    this.base = options?.base || process.cwd();
    this.buildBase = options.buildBase;
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

  // public async runTsTestFiles(files: string[]): Promise<any> {
  //   files = files.map(function (file) {
  //     return file.replace(".ts", "");
  //   });

  //   const iterator = async (element) => this._runTsTestFile(element);

  //   const deps: string[] = [];
  //   const originExtension = { ...require.extensions };

  //   // 收集测试用例引用的依赖
  //   registerRequireExtension(originExtension, (ext, module) => {
  //     deps.push(module.filename);
  //   });

  //   const result = await Promise2.each(files, iterator);

  //   unregisterRequireExtension(originExtension);

  //   // 删除依赖
  //   // todo: exclude some path
  //   deps.forEach((filename) => Reflect.deleteProperty(require.cache, filename));

  //   return result;
  // }

  public runCliTests(): any {
    // const that = this;
    // console.dir("runCliTests");
    // console.dir(this.base);
    // console.dir(this.buildBase);
    // console.dir(this.rest);
    let files = this.rest;
    // console.dir(files);
    files = files.map(function (file) {
      return path.resolve(this.buildBase, file.replace(".ts", "") + ".js");
    });

    // console.dir(files);
    const iterator = async (element) => this._runTsTestFile(element);
    return Promise2.each(files, iterator);
  }

  public runTests(rest: string[]): any {
    // get all file from rest(file or folder)
    const files = this.getFiles(rest);

    files = files.map(function (file) {
      return file.replace(".ts", "");
    });

    // console.dir(files);
    const iterator = async (element) => this._runTsTestFile(element);
    return Promise2.each(files, iterator);
  }

  /**
   * Usually, run single typescript test for api mode
   *
   * 1. import ts test file (in exmaple/*.js)
   * 2. require ts-junit dist/decorator.js
   * 3. parse data from dist/decorator.js cache
   * 4. final, run tests
   */
  private _runTsTestFile(file: string): any {
    debug(" --- runTest --- ");
    // console.dir(file);
    return loadFromCache(file).then((result) => {
      const nodeList = [result];
      // console.dir(result);
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

  /** @internal */
  public getFiles() {
    const rest = this.rest;
    // const that = this;
    // console.dir("getFiles");
    // console.dir(this.base);
    // console.dir(rest);
    const allfiles = [];
    rest.map(function (i: string) {
      const item = path.resolve(this.base, i);

      // console.dir("getFiles = " + i);
      // console.dir("getFiles = " + item);

      const stat = fs.lstatSync(item);

      const fileOrDirType = stat.isDirectory()
        ? "dir"
        : stat.isFile()
        ? "file"
        : "other";

      switch (fileOrDirType) {
        case "dir":
          console.warn("find dir " + item);
          getAllTsFiles([item]).map(function (i) {
            allfiles.push(i);
          });

          break;
        case "file":
          console.warn("find file " + item.replace(".ts", ""));

          // runTestFile([item.replace(".ts", "")]);
          allfiles.push(item.replace(".ts", ""));
          break;
        default:
          console.warn("unknow type");
          break;
      }
    });

    return unique(allfiles);
  }
}
