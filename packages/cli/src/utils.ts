import * as path from "path";

import { requireDir, flattenObj } from "@ts-junit/core";
import { debug } from "./debug";

export function getJsFilesInDist() {
  debug("getJsFilesInDist");
  const dir = __dirname.search(/ts-junit/)
    ? path.resolve(__dirname, "../dist")
    : path.resolve(__dirname, "../");
  debug(`getJsFilesInDist dir = ` + dir);
  // 定制require-dir
  const Classes = requireDir(dir, {
    recurse: true,
    extensions: [".js"],
    require: function () {
      /** NOOP */
    },
  });
  debug(Classes);

  return flattenObj(Classes);
}

export function processCompileFiles(compileFiles: string[]) {
  const needReplaceFiles = [];
  const jsFilesInDist = getJsFilesInDist();

  for (const iterator in jsFilesInDist) {
    const tsFile: string = "src/" + iterator.split(".").join("/") + ".ts";
    const jsFile: string = "src/" + iterator.split(".").join("/");
    const index = compileFiles.findIndex((v) => v === tsFile);

    if (index !== -1) {
      compileFiles.splice(
        compileFiles.findIndex((v) => v === tsFile),
        1,
      );
      needReplaceFiles.push(jsFile);
    }
  }

  return {
    finalCompileFiles: compileFiles,
    needReplaceFiles: needReplaceFiles,
  };
}

export function getCompileFilesNotExistInDistDirectory(compileFiles: string[]) {
  return processCompileFiles(compileFiles);
}

/** @internal */
export function processRequire(
  fileName: string,
  code: string,
  needReplaceFiles: string[],
) {
  const _code: any[] = [];
  const _needReplaceFiles = needReplaceFiles.filter((item: string) =>
    item.match(/index/),
  );

  // 在ts-junit cli模式下，本地调试才会用到
  // ../src/index 替换成 dist/index'
  // ../../../src 替换成 dist/index'
  needReplaceFiles.push(
    ..._needReplaceFiles.map((item: string) => item.replace(/\/index/, "")),
  );
  needReplaceFiles.push(
    ..._needReplaceFiles.map((item: string) => item.replace(/\/index/, "/")),
  );

  debug("needReplaceFiles2");
  debug(needReplaceFiles);

  code.split(/\r?\n/).forEach(function (line) {
    debug(line);
    if (line.match("require")) {
      const require_re = /(\brequire\s*?\(\s*?)(['"])([^'"]+)(\2\s*?\))/g;
      const aline: any = new RegExp(require_re).exec(line)?.[3];

      // var calculator_1 = require("../../calculator");
      // var index_1 = require("../../src/index");
      // 'src/index' 替换 "../../src/index"
      // const filePath = path.resolve(fileName, aline);
      needReplaceFiles.forEach(function (file) {
        if (line.match(file.split("/").join("/"))) {
          debug(file.split("src/")[1]);
          const a = file.split("src/")[1] ? file.split("src/")[1] : "";
          const base = fileName.split("ts-junit")[0] + "ts-junit/dist/" + a;
          debug(base);
          line = line.replace(aline, base);
          debug(line);
        }
      });
    }

    _code.push(line);
  });

  return _code.join("\n");
}
