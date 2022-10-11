import * as fs from 'node:fs';
import * as path from 'node:path';
import debugModule from 'debug';

import { getAllImportsForFile, getNeedCompileFiles } from './ast';
import { getAllTsFiles } from './loadObject/scan';

const debug = Debug();

/**
 * 
 * @internal
 * @see https://github.com/i5ting/quickdebug/
 */
export function Debug(name?: string) {
  var key = name ? name : get_closest_package_json().name;

  return DebugWith(key);
}

/**
 * 
 * @internal
 * @see https://github.com/i5ting/colondebug/
 */
export function DebugWith(key: string) {
  var operation = key.split(':').pop();
  var debug = debugModule(key);

  if (Object.keys(console).includes(operation)) {
    debug = console[operation];
  }

  return debug;
}

/** @internal */
export function get_closest_package_json() {
  const debug = DebugWith('ts-junit:utils');

  var config;
  var isNext = true;

  module.paths.forEach(function (i) {
    var file = i.replace('node_modules', 'package.json');

    if (isNext && fs.existsSync(file) === true) {
      try {
        // break with flag
        isNext = false;

        // log
        debug('exist file = ' + file);

        // get package.json content
        config = require(file);
      } catch (e) {
        console.error('get_closest_package_json' + e);
      }
    } else {
      debug('not exist file = ' + file);
    }
  });

  return config;
}

/** @internal */
export function getFiles(rest: any) {
  var allfiles = [];
  rest.map(function (i: string) {
    let item = path.resolve(process.cwd(), i);

    try {
      const stat = fs.lstatSync(item);

      let fileOrDirType = stat.isDirectory()
        ? 'dir'
        : stat.isFile()
          ? 'file'
          : 'other';

      switch (fileOrDirType) {
        case 'dir':
          console.warn('find dir ' + item);
          getAllTsFiles([item]).map(function (i) {
            allfiles.push(i);
          });

          break;
        case 'file':
          console.warn('find file ' + item.replace('.ts', ''));

          // runTestFile([item.replace(".ts", "")]);
          allfiles.push(item.replace('.ts', ''));
          break;
        default:
          console.warn('unknow type');
          break;
      }
    } catch (error) {
      throw error;
    }
  });

  return unique(allfiles);
}

/** @internal */
export function getCompileFiles(testFiles: string[]) {
  let allfiles = [];
  for (let testFile of testFiles) {
    // make sure cli args 'file.ts'
    testFile = testFile.replace('.ts', '');

    let testTsFile = testFile;
    let testJsFile = testFile;

    // const a = getDependencyImports(['./tests/test.ts','./tests/a/test2.ts'])
    const extension = path.extname(testFile);
    if (!extension) {
      testTsFile += '.ts';
      testJsFile += '.js';

      testTsFile = testTsFile.replace(process.cwd() + '/', '');

      testJsFile =
        path.resolve(__dirname, '../') +
        '/output' +
        testJsFile.replace(process.cwd(), '');
    }

    getAllImportsForFile(testTsFile);

    const needCompileFiles = getNeedCompileFiles();

    allfiles.push(...needCompileFiles);
    debug('needCompileFiles');
    debug(needCompileFiles);
  }

  // console.dir(allfiles);
  return unique(allfiles.reverse());
}

/** @internal */
export function unique(arr: string[]): string[] {
  return Array.from(new Set(arr));
}
