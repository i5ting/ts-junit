"use strict";
exports.__esModule = true;
exports.getDependencyImports = exports.getNeedCompileFiles = exports.getAllImportsForFile = exports.needCompileFiles = exports.processedFiles = exports.localFiles = exports.libFiles = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var ts = require("typescript");
// const fileInfo = ts.preProcessFile(readFileSync('./tests/test.ts').toString())['importedFiles']
// console.dir(fileInfo)
// const result = fileInfo.map(el => {return el.fileName});
// console.dir(result)
exports.libFiles = new Set();
exports.localFiles = new Set();
exports.processedFiles = new Set();
exports.needCompileFiles = new Array();
function getImportsForFile(file, options) {
    console.dir(file);
    var fileInfo = ts.preProcessFile((0, fs_1.readFileSync)(file).toString());
    if (options && options.verbose)
        console.log('getImportsForFile ' + file + ': ' + fileInfo.importedFiles.map(function (el) { return el.fileName; }).join(', '));
    return fileInfo.importedFiles
        .map(function (importedFile) { return importedFile.fileName; })
        .flatMap(function (fileName) {
        // console.dir(fileName)
        if (!fileName.startsWith('.')) {
            exports.libFiles.add(fileName);
        }
        return fileName;
        // flat map is not ideal here, because we could hit multiple valid imports, and not the first aka best one
        //return applyPathMapping(fileName, path_mapping) 
    })
        .filter(function (x) { return x.startsWith('.'); }) // only relative paths allowed
        .flatMap(function (fileName) {
        return [fileName, (0, path_1.join)((0, path_1.dirname)(file), fileName)];
    })
        .map(function (fileName) {
        if ((0, fs_1.existsSync)("".concat(fileName, ".ts"))) {
            exports.localFiles.add("".concat(fileName, ".ts"));
        }
        if ((0, fs_1.existsSync)("".concat(fileName, ".tsx"))) {
            return "".concat(fileName, ".tsx");
        }
        var yo = (0, path_1.join)(fileName, 'index.ts').normalize();
        if ((0, fs_1.existsSync)(yo)) {
            exports.localFiles.add(yo);
        }
        var tsx_subfolder = (0, path_1.join)(fileName, 'index.tsx').normalize();
        if ((0, fs_1.existsSync)(tsx_subfolder)) {
            return tsx_subfolder;
        }
        if (fileName.endsWith('.js')) {
            var tsFromJs = fileName.replace(/[.]js$/, '.ts');
            if ((0, fs_1.existsSync)(tsFromJs)) {
                return tsFromJs;
            }
        }
        // ignoredFiles.add(fileName)
        // return undefined
        // throw new Error(`Unresolved import ${fileName} in ${file}`);
    });
    // .filter(isDefined)
    // .map(convertPath)
}
function getAllImportsForFile(file) {
    exports.processedFiles.add(file);
    exports.needCompileFiles.push(file);
    getImportsForFile(file, { verbose: true });
    var count = 0;
    exports.localFiles.forEach(function (i) {
        count++;
        // 
        if (!exports.processedFiles.has(i) && count > 0) {
            // processedFiles.add(i)
            getAllImportsForFile(i);
        }
    });
}
exports.getAllImportsForFile = getAllImportsForFile;
function getNeedCompileFiles() {
    var arr = exports.needCompileFiles.reverse();
    return arr.filter(function (item, index) { return arr.indexOf(item) === index; });
}
exports.getNeedCompileFiles = getNeedCompileFiles;
function getDependencyImports(files) {
    var alibFiles = new Set();
    var alocalFiles = new Set();
    files.map(function (a) {
        getImportsForFile(a);
        exports.libFiles.forEach(alibFiles.add, alibFiles);
        exports.localFiles.forEach(alibFiles.add, alocalFiles);
    });
    return {
        'lib': alibFiles,
        'local': alocalFiles
    };
}
exports.getDependencyImports = getDependencyImports;
// example
// const a = getDependencyImports(['./tests/test.ts','./tests/a/test2.ts'])
// console.dir(a)
