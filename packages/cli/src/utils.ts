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
