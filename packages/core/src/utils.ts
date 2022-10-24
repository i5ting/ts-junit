import * as fs from "node:fs";
import * as path from "node:path";
import { unique, getAllTsFiles } from "@ts-junit/utils";
import { debug } from "./debug";

export function getFiles(obj: any) {
  const that = obj;
  const allfiles: string[] = [];

  debug("getFiles");
  debug(obj.base);

  obj.rest.map(function (i: string) {
    let item = path.resolve(that.base, i);
    debug("getFiles = " + item);

    const exists = fs.existsSync(item);

    // maybe it's a file
    if (!exists) {
      const extensions = [".ts", ".js"];
      const ext = extensions.find((ext) => fs.existsSync(`${item}${ext}`));
      if (!ext) {
        throw new Error(`"${i}" not file or dir`);
      }
      item = `${item}${ext}`;
    }

    const stat = fs.lstatSync(item);

    const fileOrDirType = stat.isDirectory()
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
        console.warn("find file " + item.replace(".ts", ""));

        // runTestFile([item.replace(".ts", "")]);
        allfiles.push(item.replace(".ts", ""));
        break;
      default:
        console.warn("unknown type");
        break;
    }
  });

  return unique(allfiles);
}
