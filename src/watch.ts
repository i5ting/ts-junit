import * as fs from "fs";
import * as ts from "typescript";
import {getDependencyImports, getAllImportsForFile, getNeedCompileFiles} from "./ast";
 
import { fs as f1, vol } from 'memfs';


import { patchRequire } from 'fs-monkey';


// const a = getDependencyImports(['./tests/test.ts','./tests/a/test2.ts'])
// console.dir(a)
// import { cache } from "./cache";


function watch(rootFileNames: string[], options: ts.CompilerOptions) {
  const files: ts.MapLike<{ version: number }> = {};

  // initialize the list of files
  rootFileNames.forEach(fileName => {
    files[fileName] = { version: 0 };
  });

  // Create the language service host to allow the LS to communicate with the host
  const servicesHost: ts.LanguageServiceHost = {
    getScriptFileNames: () => rootFileNames,
    getScriptVersion: fileName =>
      files[fileName] && files[fileName].version.toString(),
    getScriptSnapshot: fileName => {
      if (!fs.existsSync(fileName)) {
        return undefined;
      }

      return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString());
    },
    getCurrentDirectory: () => process.cwd(),
    getCompilationSettings: () => options,
    getDefaultLibFileName: options => ts.getDefaultLibFilePath(options),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    directoryExists: ts.sys.directoryExists,
    getDirectories: ts.sys.getDirectories,
  };

  // Create the language service files
  const services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());

  // Now let's watch the files
  rootFileNames.forEach(fileName => {
    // First time around, emit all files
    emitFile(fileName);

    // Add a watch on the file to handle next change
    fs.watchFile(fileName, { persistent: true, interval: 250 }, (curr, prev) => {
      // Check timestamp
      if (+curr.mtime <= +prev.mtime) {
        return;
      }

      // Update the version to signal a change in the file
      files[fileName].version++;

      // write the changes to disk
      emitFile(fileName);
      
    });
  });

  function emitFile(fileName: string) {
    let output = services.getEmitOutput(fileName);

    if (!output.emitSkipped) {
      console.log(`Emitting ${fileName}`);
    } else {
      console.log(`Emitting ${fileName} failed`);
      logErrors(fileName);
    }

    output.outputFiles.forEach(o => {
      console.log(o.name + ':= ' )

      vol.mkdirpSync('src/loadObject')
      vol.mkdirpSync('tests')
      vol.writeFileSync(o.name, o.text);
      patchRequire(vol);
      // cache.set(o.name, o.text);
      // fs.writeFileSync(o.name, o.text, "utf8");
    });
  }

  function logErrors(fileName: string) {
    let allDiagnostics = services
      .getCompilerOptionsDiagnostics()
      .concat(services.getSyntacticDiagnostics(fileName))
      .concat(services.getSemanticDiagnostics(fileName));

    allDiagnostics.forEach(diagnostic => {
      let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
      if (diagnostic.file) {
        let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
          diagnostic.start!
        );
        console.log(`  Error ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
      } else {
        console.log(`  Error: ${message}`);
      }
    });
  }
}

// Initialize files constituting the program as all .ts files in the current directory
// const currentDirectoryFiles = fs
//   .readdirSync(process.cwd())
//   .filter(fileName => fileName.length >= 3 && fileName.substr(fileName.length - 3, 3) === ".ts");

// Start the watcher

export function Watch(dirs: string[]) {
  watch(dirs, { module: ts.ModuleKind.CommonJS });

  // return debug
}

export function WatchFile(file: string) {
  // const a = getDependencyImports(['./tests/test.ts','./tests/a/test2.ts'])

  getAllImportsForFile(file)
  var a = getNeedCompileFiles()

  console.dir(a)  
  Watch(a)

  patchRequire(vol);

  // console.dir(vol.readFileSync('tests/test.js').toString())
  // const A = require('tests/test.js')
  console.dir(require)

  // var obj = new A()
  // console.dir(obj)

  // console.dir(a)
  // watch([file], { module: ts.ModuleKind.CommonJS });

  // return debug
}