// import exp from "node:constants";
import { flattenObj, requireDir } from "./";

import { debug } from ".";

// let cache = {};

/** @internal */
// export function clearCache() {
//   cache = {};
// }

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
