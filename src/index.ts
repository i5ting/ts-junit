import * as fs from "node:fs";
import * as path from "node:path";
import Context from "./Context";
import UvuStrategy from "./UvuStrategy";
import { WatchDir, WatchFile } from "./Watch";
import { Debug } from "./Utils";

const debug = Debug();

export * from "./Decrator";
export * from "./IStrategy";
export * from "./Watch";
export * from "./Ast";
export * from "./Utils";
export * from "./parse";
export * from "./loadObject/scan";
export * from "./loadObject/require";
export * from "./loadObject/flatten";

export function executeWithDefaultStrategy(dirs: string[]) {
  debug("executeWithDefaultStrategy");

  // set context use default strategy
  const context = new Context(new UvuStrategy());

  // compile and watch, then run test
  WatchDir(dirs, context);
}

export function executeFileWithDefaultStrategy(testFiles: string[]) {
  debug("executeFileWithDefaultStrategy");

  // set context use default strategy
  const context = new Context(new UvuStrategy());

  // compile and watch, then run test
  testFiles.map(function (file) {
    WatchFile(file, context);
  });
}

export function execute(rest: any) {
  debug("execute With Strategy");
  console.time("build ts");
  rest.map(function (i: string) {
    let item = path.resolve(process.cwd(), i);

    try {
      const stat = fs.lstatSync(item);

      let fileOrDirType = stat.isDirectory()
        ? "dir"
        : stat.isFile()
        ? "file"
        : "other";

      switch (fileOrDirType) {
        case "dir":
          console.warn("find dir " + item);
          executeWithDefaultStrategy([item]);
          break;
        case "file":
          console.warn("find file 2" + item.replace(".ts", ""));

          executeFileWithDefaultStrategy([item.replace(".ts", "")]);
          break;
        default:
          console.warn("unknow type");
          break;
      }
    } catch (error) {
      throw error;
    }
  });
  console.timeEnd("build ts");
}

export function runTestFileWithDefaultStrategy(testFiles: string[]) {
  debug("runTestFileWithDefaultStrategy");

  // set context use default strategy
  const context = new Context(new UvuStrategy());

  // compile and watch, then run test
  testFiles.map(function (file) {
    context.runTsTestFile(file);
  });
}

// export function runWithDefaultStrategy(dirs: string[]) {
//   debug("executeWithDefaultStrategy");

//   // set context use default strategy
//   const context = new Context(new UvuStrategy(), {});

//   // compile and watch, then run test
//   context.runTests(dir);
// }
