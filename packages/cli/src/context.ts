import ts from "typescript";
import { getCompileFiles, Context, Strategy } from "@ts-junit/core";
import { watch, runTestEmitter } from "./watch";
import { getCompileFilesNotExistInDistDirectory } from "./utils";
import { debug } from "./debug";

export class CliContext extends Context {
  constructor(strategy: Strategy, options: any) {
    super(strategy, options);
  }

  public watch() {
    const testFiles = this.getFiles();
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
