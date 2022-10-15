// import exp from "node:constants";
import { flattenObj, requireDir } from "./";

import { debug } from ".";

let cache = {};

/** @internal */
export function clearCache() {
  cache = {};
}

/** @internal */
export function getAllTsFiles(dirs: string[]) {
  const allfiles: string[] = [];
  dirs.map(function (dir) {
    // watch(dir, { module: ts.ModuleKind.CommonJS });
    const files = getTsFiles(dir);
    Object.keys(files).map(function (file) {
      const testFile =
        dir + "/" + file.replace(".default", "").split(".").join("/");
      allfiles.push(testFile);
    });
  });
  return allfiles;
}

/** @internal */
export function getTsFiles(dir: string) {
  // 定制require-dir
  const Classes = requireDir(dir, {
    recurse: true,
    extensions: [".ts"],
    require: function () {
      /** NOOP */
    },
  });
  debug(Classes);

  return flattenObj(Classes);
}

/** @internal */
export function loadFromDecorator(file: string) {
  // FIXME: require is nodejs only
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Clazz = require(`${file}`);
  const obj = new Clazz.default();
  const clz_name = obj.constructor.name;
  // const data = getDataFromDecoratorJson(file, obj);
  // if (!data) return;

  // Clazz.default.data = data
  // require('../decorator').emptydata()
  // clearCache();

  // obj.__data = data

  // const newClz = data[clz_name]; //|| {}
  // if (newClz) newClz.__obj = obj;

  return { clz_name };
}

/** @internal */
export function loadFromCache(file: string) {
  return import(file).then(function (Clazz) {
    const obj = new Clazz.default();
    const clz_name = obj.constructor.name;
    // const _data = data();
    // if (!_data) return;

    // // Clazz.default.data = data
    // // emptydata();
    // // obj.__data = _data;

    // const newClz = _data[clz_name]; //|| {}
    // if (newClz) newClz.__obj = obj;

    return Promise.resolve({ clz_name });
  });
}
