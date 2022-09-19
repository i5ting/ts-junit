import * as os from "os";
import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";
import { getDependencyImports, getAllImportsForFile, getNeedCompileFiles, libFiles } from "./ast";

import { fs as f1, vol } from 'memfs';
const { NodeVM } = require('vm2');

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
      // var dir = 'output'
      // if (o.name.indexOf(os.homedir()) !== -1) {
      //   dir = 'output' + o.name.replace(process.cwd(), '')
      // } else {
      //   dir += '/' + o.name
      // }

      // ensureDirectoryExistence(dir)
      // fs.writeFileSync(dir, o.text);
      console.log(o.name + ':= ' + o.text)

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

  console.dir(libFiles)

  console.dir(a)
  Watch(a)

  run()
  // console.dir(vol.readFileSync('tests/test.js').toString())

  // console.dir(require)

  // var obj = new A()
  // console.dir(obj)

  // console.dir(a)
  // watch([file], { module: ts.ModuleKind.CommonJS });

  // return debug
}


function run() {
  var m = require('module')
  patchRequire(vol);
  var src = vol.readFileSync('tests/test.js').toString()
  var res = require('vm').runInThisContext(m.wrap(src))(exports, require, module, __filename, __dirname)
  console.log(module.exports)
}


function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}
