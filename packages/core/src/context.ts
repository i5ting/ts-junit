import Promise2 from "bluebird";
import { loadFromCache } from "./loadObject/scan";
import { Debug } from "./utils";

const debug = Debug("ts-junit");

import { IStrategy } from "../../uvu-strategy/src/iStrategy";

function registerRequireExtension(
  target: NodeJS.RequireExtensions,
  callback: (ext: string, module: NodeJS.Module, context: string) => void,
) {
  const extensions = Object.keys(target) as (keyof typeof target)[];

  Object.assign(
    require.extensions,
    extensions.reduce((result, ext) => {
      return {
        ...result,
        [ext]: (module: NodeJS.Module, context: string) => {
          callback(ext as string, module, context);
          return target[ext]?.(module, context);
        },
      };
    }, {} as NodeJS.RequireExtensions),
  );
}

function unregisterRequireExtension(target: NodeJS.RequireExtensions) {
  Object.assign(require.extensions, target);
}

/**
 * The Context defines the interface of interest to clients.
 *
 * @public
 */
export default class Context {
  /**
   * The Context maintains a reference to one of the Strategy
   * objects. The Context does not know the concrete class of a strategy. It
   * should work with all strategies via the Strategy interface.
   *
   * @remarks
   */
  private strategy: IStrategy;

  /**
   * Usually, the Context accepts a strategy through the constructor, but also
   * provides a setter to change it at runtime.

   * @remarks
   */
  constructor(strategy: IStrategy) {
    this.strategy = strategy;
  }

  /**
   * Usually, the Context allows replacing a Strategy object at runtime.
   *
   * @remarks
   */
  public setStrategy(strategy: IStrategy) {
    this.strategy = strategy;
  }

  public async runTsTestFiles(files: string[]): Promise<any> {
    files = files.map(function (file) {
      return file.replace(".ts", "");
    });

    const iterator = async (element) => this._runTsTestFile(element);

    const deps: string[] = [];
    const originExtension = { ...require.extensions };

    // 收集测试用例引用的依赖
    registerRequireExtension(originExtension, (ext, module) => {
      deps.push(module.filename);
    });

    const result = await Promise2.each(files, iterator);

    unregisterRequireExtension(originExtension);

    // 删除依赖
    // todo: exclude some path
    deps.forEach((filename) => Reflect.deleteProperty(require.cache, filename));

    return result;
  }

  private _runTsTestFile(file: string): any {
    debug(" --- runTest --- ");
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
}
