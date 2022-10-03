import * as fs from 'node:fs'
import * as path from "node:path";
import debugModule from 'debug';

import { getAllTsFiles } from "./loadObject/scan";

// const debug = new debugModule('foo');

// see https://github.com/i5ting/quickdebug/
export function Debug(name?: string) {
  var key = name ? name : get_closest_package_json().name;

  return DebugWith(key);
}

// see https://github.com/i5ting/colondebug/
export function DebugWith(key: String) {
  var operation = key.split(":").pop();
  var debug = new debugModule(key);

  if (Object.keys(console).includes(operation)) {
    debug = console[operation];
  }

  return debug;
}

export function get_closest_package_json() {
  const debug = DebugWith("ts-junit:utils");

  var config;
  var isNext = true;

  module.paths.forEach(function (i) {
    var file = i.replace("node_modules", "package.json");

    if (isNext && fs.existsSync(file) === true) {
      try {
        // break with flag
        isNext = false;

        // log
        debug("exist file = " + file);

        // get package.json content
        config = require(file);
      } catch (e) {
        console.error("get_closest_package_json" + e);
      }
    } else {
      debug("not exist file = " + file);
    }
  });

  return config;
}

export function getFiles(rest: any) {
  var allfiles = [];
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
          getAllTsFiles([item]).map(function (i) {
            allfiles.push(i);
          });

          break;
        case "file":
          console.warn("find file 2" + item.replace(".ts", ""));

          // runTestFile([item.replace(".ts", "")]);
          allfiles.push(item.replace(".ts", ""));
          break;
        default:
          console.warn("unknow type");
          break;
      }
    } catch (error) {
      throw error;
    }
  });

  function unique(arr: string[]): string[] {
    return Array.from(new Set(arr));
  }

  return unique(allfiles);
}
  
  