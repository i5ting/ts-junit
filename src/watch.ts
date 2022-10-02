import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";

import { EventEmitter } from 'node:events';

import { getAllImportsForFile, getNeedCompileFiles } from "./ast";

import { Debug } from './Utils'
import Context from './Context'
import { getTsFiles } from './index'

const debug = Debug('watch')

const runTestEmitter = new EventEmitter();
const files: ts.MapLike<{ version: number }> = {};

function watch(rootFileNames: string[], options: ts.CompilerOptions) {
  debug('rootFileNames+')
  debug(rootFileNames)

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
    debug('fileName = ' + fileName)

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
      debug(`Emitting ${fileName}`);
    } else {
      console.log(`Emitting ${fileName} failed`);
      logErrors(fileName);
    }

    output.outputFiles.forEach(o => {
      const destination = path.join(path.resolve(__dirname, '../'), 'output/' + o.name.replace(path.resolve(__dirname, '../'), ''))
      debug('destination = ' + destination)

      // mkdir -p
      ensureDirectoryExistence(destination)

      fs.writeFileSync(destination, o.text)
    });

    // debug('done')
    runTestEmitter.emit('runTestEvent')
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
export function WatchDir(dirs: string[], context: Context) {
  var allfiles = []
  dirs.map(function (dir) {
    // watch(dir, { module: ts.ModuleKind.CommonJS });
    var files = getTsFiles(dir)
    Object.keys(files).map(function (file) {
      const testFile = dir + '/' + file.replace('.default', '').split('.').join('/')
      allfiles.push(testFile)
    })
  })

  debug(allfiles)

  allfiles.map(function (file) {
    WatchFile(file, context)
  })
}

export function WatchFile(testFile: string, context: Context) {
  // make sure cli args 'file.ts'
  testFile = testFile.replace('.ts', '')

  let testTsFile = testFile
  let testJsFile = testFile

  // const a = getDependencyImports(['./tests/test.ts','./tests/a/test2.ts'])
  const extension = path.extname(testFile)
  if (!extension) {
    testTsFile += '.ts'
    testJsFile += '.js'

    testTsFile = testTsFile.replace(process.cwd() + '/', '')

    testJsFile = path.resolve(__dirname, '../') + '/output' + testJsFile.replace(process.cwd(), '')
  }

  getAllImportsForFile(testTsFile)

  const needCompileFiles = getNeedCompileFiles()

  debug('needCompileFiles')
  debug(needCompileFiles)

  console.log("start compile file = " + testTsFile)
  watch(needCompileFiles, { module: ts.ModuleKind.CommonJS });


  debug('needCompileFiles2')
  debug(needCompileFiles)

  // when file change run after 1s
  setTimeout(function () {

    debug('testJsFile = ' + testJsFile)

    // path.resolve(__dirname,'../'), 'output/'

    // run test at once
    context.runTest(testTsFile, testJsFile)

    runTestEmitter.on('runTestEvent', function () {
      debug('run tests' + testFile)
      context.runTest(testTsFile, testJsFile)
    })
  }, 100)
}

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}
