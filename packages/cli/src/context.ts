// @ts-nocheck
import ts from "typescript";
import { getFiles, getCompileFiles, Context, Strategy } from "@ts-junit/core";
import path from "path";
import Promise2 from "bluebird";
import { sleep } from "@ts-junit/utils";
import { watch, runTestEmitter } from "./watch";
import {
  getCompileFilesNotExistInDistDirectory,
  registerRequireExtension,
  unregisterRequireExtension,
  collectionUnitDep,
} from "./utils";
import { debug } from "./debug";

export class CliContext extends Context {
  constructor(strategy: Strategy, options: any) {
    super(strategy, options);
  }

  public watch() {
    const testFiles = getFiles(this);
    debug(testFiles);

    const compileFiles = getCompileFiles(testFiles);
    debug(compileFiles);

    const { finalCompileFiles, needReplaceFiles } =
      getCompileFilesNotExistInDistDirectory(compileFiles);

    debug(finalCompileFiles);
    debug(needReplaceFiles);

    // start compile and watch files
    watch(finalCompileFiles, needReplaceFiles, {
      module: ts.ModuleKind.CommonJS,
    });
  }

  public async runCliTests(): any {
    const that = this;
    debug("runCliTests");
    debug(this.base);
    debug(this.buildOutput);
    debug(this.rest);
    let files = getFiles(this);
    files = files.map(function (file) {
      return (
        that.buildOutput +
        path.resolve(
          that.buildOutput,
          file.replace(that.buildRoot, "").replace(".ts", "") + ".js",
        )
      );
    });

    debug(files);

    const iterator = async (element) => {
      return this._runTsTestFile(element).then(sleep(100));
    };

    const originExtension = { ...require.extensions };

    registerRequireExtension(originExtension, (_, module) => {
      collectionUnitDep(module.id);
    });

    const result = await Promise2.each(files, iterator);

    unregisterRequireExtension(originExtension);

    return result;
  }

  runTests() {
    const that = this;

    // run test at once
    that.runCliTests();

    // when file change run after 100ms
    setTimeout(function () {
      runTestEmitter.on("runTestEvent", function () {
        // debug("run tests" + testFile);
        that.runCliTests();
      });
    }, 100);
  }
}
