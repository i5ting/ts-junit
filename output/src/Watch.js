"use strict";
exports.__esModule = true;
exports.WatchFile = exports.Watch = void 0;
var os = require("os");
var fs = require("fs");
var path = require("path");
var ts = require("typescript");
var ast_1 = require("./ast");
var memfs_1 = require("memfs");
var NodeVM = require('vm2').NodeVM;
var fs_monkey_1 = require("fs-monkey");
// const a = getDependencyImports(['./tests/test.ts','./tests/a/test2.ts'])
// console.dir(a)
// import { cache } from "./cache";
function watch(rootFileNames, options) {
    var files = {};
    // initialize the list of files
    rootFileNames.forEach(function (fileName) {
        files[fileName] = { version: 0 };
    });
    // Create the language service host to allow the LS to communicate with the host
    var servicesHost = {
        getScriptFileNames: function () { return rootFileNames; },
        getScriptVersion: function (fileName) {
            return files[fileName] && files[fileName].version.toString();
        },
        getScriptSnapshot: function (fileName) {
            if (!fs.existsSync(fileName)) {
                return undefined;
            }
            return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString());
        },
        getCurrentDirectory: function () { return process.cwd(); },
        getCompilationSettings: function () { return options; },
        getDefaultLibFileName: function (options) { return ts.getDefaultLibFilePath(options); },
        fileExists: ts.sys.fileExists,
        readFile: ts.sys.readFile,
        readDirectory: ts.sys.readDirectory,
        directoryExists: ts.sys.directoryExists,
        getDirectories: ts.sys.getDirectories
    };
    // Create the language service files
    var services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());
    // Now let's watch the files
    rootFileNames.forEach(function (fileName) {
        // First time around, emit all files
        emitFile(fileName);
        // Add a watch on the file to handle next change
        fs.watchFile(fileName, { persistent: true, interval: 250 }, function (curr, prev) {
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
    function emitFile(fileName) {
        var output = services.getEmitOutput(fileName);
        if (!output.emitSkipped) {
            console.log("Emitting ".concat(fileName));
        }
        else {
            console.log("Emitting ".concat(fileName, " failed"));
            logErrors(fileName);
        }
        output.outputFiles.forEach(function (o) {
            var dir = 'output';
            if (o.name.indexOf(os.homedir()) !== -1) {
                dir = 'output' + o.name.replace(process.cwd(), '');
            }
            else {
                dir += '/' + o.name;
            }
            ensureDirectoryExistence(dir);
            fs.writeFileSync(dir, o.text);
            console.log(o.name + ':= ' + o.text);
            memfs_1.vol.mkdirpSync('src/loadObject');
            memfs_1.vol.mkdirpSync('tests');
            memfs_1.vol.writeFileSync(o.name, o.text);
            (0, fs_monkey_1.patchRequire)(memfs_1.vol);
            // cache.set(o.name, o.text);
            // fs.writeFileSync(o.name, o.text, "utf8");
        });
    }
    function logErrors(fileName) {
        var allDiagnostics = services
            .getCompilerOptionsDiagnostics()
            .concat(services.getSyntacticDiagnostics(fileName))
            .concat(services.getSemanticDiagnostics(fileName));
        allDiagnostics.forEach(function (diagnostic) {
            var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            if (diagnostic.file) {
                var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), line = _a.line, character = _a.character;
                console.log("  Error ".concat(diagnostic.file.fileName, " (").concat(line + 1, ",").concat(character + 1, "): ").concat(message));
            }
            else {
                console.log("  Error: ".concat(message));
            }
        });
    }
}
// Initialize files constituting the program as all .ts files in the current directory
// const currentDirectoryFiles = fs
//   .readdirSync(process.cwd())
//   .filter(fileName => fileName.length >= 3 && fileName.substr(fileName.length - 3, 3) === ".ts");
// Start the watcher
function Watch(dirs) {
    watch(dirs, { module: ts.ModuleKind.CommonJS });
    // return debug
}
exports.Watch = Watch;
function WatchFile(file) {
    // const a = getDependencyImports(['./tests/test.ts','./tests/a/test2.ts'])
    (0, ast_1.getAllImportsForFile)(file);
    var a = (0, ast_1.getNeedCompileFiles)();
    console.dir(a);
    Watch(a);
    run();
    // console.dir(vol.readFileSync('tests/test.js').toString())
    // console.dir(require)
    // var obj = new A()
    // console.dir(obj)
    // console.dir(a)
    // watch([file], { module: ts.ModuleKind.CommonJS });
    // return debug
}
exports.WatchFile = WatchFile;
function run() {
    var m = require('module');
    (0, fs_monkey_1.patchRequire)(memfs_1.vol);
    var src = memfs_1.vol.readFileSync('tests/test.js').toString();
    var res = require('vm').runInThisContext(m.wrap(src))(exports, require, module, __filename, __dirname);
    console.log(module.exports);
}
function ensureDirectoryExistence(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}
