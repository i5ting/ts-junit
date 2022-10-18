import * as path from "path";
import ts from "typescript";

import {
  debug,
  requireDir,
  flattenObj,
  getCompileFiles,
  Context,
  Strategy,
} from "@ts-junit/core";

import { watch, runTestEmitter } from "./watch";

export class CliContext extends Context {
  constructor(strategy: Strategy, options: any) {
    super(strategy, options);
  }

  public watch() {
    // console.dir(context.rest);
    const testFiles = this.getFiles();
    // console.dir(testFiles);

    const compileFiles = getCompileFiles(testFiles);
    // console.dir(compileFiles);

    const { finalCompileFiles, needReplaceFiles } =
      this.getCompileFilesNotExistInDistDirectory(compileFiles);

    // console.dir(finalCompileFiles);
    // console.dir(needReplaceFiles);

    // start compile and watch files
    watch(finalCompileFiles, needReplaceFiles, {
      module: ts.ModuleKind.CommonJS,
    });

    const that = this;

    // run test at once
    that.runCliTests();

    // when file change run after 100ms * testFiles.length
    setTimeout(function () {
      runTestEmitter.on("runTestEvent", function () {
        // debug("run tests" + testFile);
        that.runCliTests();
      });
    }, 100);
  }

  getJsFilesInDist() {
    // console.dir("getJsFilesInDist");
    const dir = __dirname.search(/ts-junit/)
      ? path.resolve(__dirname, "../dist")
      : path.resolve(__dirname, "../");
    // console.dir(`getJsFilesInDist dir = ` + dir);
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

  processCompileFiles(compileFiles: string[]) {
    const needReplaceFiles = [];
    const jsFilesInDist = this.getJsFilesInDist();

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

    // console.dir("compileFiles");
    // console.dir(compileFiles);
    // console.dir("needReplaceFiles");
    // console.dir(needReplaceFiles);

    return {
      finalCompileFiles: compileFiles,
      needReplaceFiles: needReplaceFiles,
    };
  }

  getCompileFilesNotExistInDistDirectory(compileFiles: string[]) {
    return this.processCompileFiles(compileFiles);
  }
}
