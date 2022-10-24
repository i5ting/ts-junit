import * as fs from "fs";
import * as path from "path";
import { EventEmitter } from "node:events";
import ts from "typescript";
import { ensureDirectoryExistence } from "@ts-junit/core";
import { debug } from "./debug";
import { cleanUnitTestsRequireCache, processRequire } from "./utils";

const files: ts.MapLike<{ version: number }> = {};
export const runTestEmitter = new EventEmitter();

export function watch(
  rootFileNames: string[],
  needReplaceFiles: string[],
  options: ts.CompilerOptions,
) {
  debug("rootFileNames+");
  debug(rootFileNames);

  // initialize the list of files
  rootFileNames.forEach((fileName) => {
    files[fileName] = { version: 0 };
  });

  // Create the language service host to allow the LS to communicate with the host
  const servicesHost: ts.LanguageServiceHost = {
    getScriptFileNames: () => rootFileNames,
    getScriptVersion: (fileName) =>
      files[fileName] && files[fileName].version.toString(),
    getScriptSnapshot: (fileName) => {
      if (!fs.existsSync(fileName)) {
        return undefined;
      }

      return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString());
    },
    getCurrentDirectory: () => process.cwd(),
    getCompilationSettings: () => options,
    getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    directoryExists: ts.sys.directoryExists,
    getDirectories: ts.sys.getDirectories,
  };

  // Create the language service files
  const services = ts.createLanguageService(
    servicesHost,
    ts.createDocumentRegistry(),
  );

  // Now let's watch the files
  rootFileNames.forEach((fileName) => {
    // First time around, emit all files
    emitFile(fileName);
    debug("fileName = " + fileName);

    // Add a watch on the file to handle next change
    fs.watchFile(
      fileName,
      { persistent: true, interval: 250 },
      (curr, prev) => {
        // Check timestamp
        if (+curr.mtime <= +prev.mtime) {
          return;
        }

        // Update the version to signal a change in the file
        files[fileName].version++;

        // write the changes to disk
        emitFile(fileName);
      },
    );
  });

  async function emitFile(fileName: string) {
    const output = services.getEmitOutput(fileName);

    if (!output.emitSkipped) {
      debug(`Emitting ${fileName}`);
    } else {
      console.log(`Emitting ${fileName} failed`);
      logErrors(fileName);
    }

    cleanUnitTestsRequireCache();

    // wait file write
    await Promise.all(
      output.outputFiles.map((o) => {
        const fileName = path.join(
          path.resolve(__dirname, "../"),
          "output/" + o.name.replace(path.resolve(__dirname, "../"), ""),
        );
        debug("destination = " + fileName);

        // mkdir -p
        ensureDirectoryExistence(fileName);

        const code = processRequire(fileName, o.text, needReplaceFiles);

        return fs.promises.writeFile(fileName, code);
      }),
    );

    runTestEmitter.emit("runTestEvent");
  }

  function logErrors(fileName: string) {
    const allDiagnostics = services
      .getCompilerOptionsDiagnostics()
      .concat(services.getSyntacticDiagnostics(fileName))
      .concat(services.getSemanticDiagnostics(fileName));

    allDiagnostics.forEach((diagnostic) => {
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n",
      );
      if (diagnostic.file) {
        /* eslint-disable  @typescript-eslint/no-non-null-assertion */
        const { line, character } =
          diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
        console.log(
          `  Error ${diagnostic.file.fileName} (${line + 1},${
            character + 1
          }): ${message}`,
        );
      } else {
        console.log(`  Error: ${message}`);
      }
    });
  }
}
