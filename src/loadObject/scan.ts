import exp = require("node:constants");
import { flattenObj, getDataMapping, requireDir, emptydata } from "../";
import { data } from "../";

import { Debug } from "../utils";

const debug = Debug();

var cache = {};

/** @internal */
export function clearCache() {
  cache = {};
}

/** @internal */
export function getAllTsFiles(dirs: string[]) {
  var allfiles = [];
  dirs.map(function (dir) {
    // watch(dir, { module: ts.ModuleKind.CommonJS });
    var files = getTsFiles(dir);
    Object.keys(files).map(function (file) {
      const testFile =
        dir + "/" + file.replace(".default", "").split(".").join("/");
      allfiles.push(testFile);
    });
  });
  return allfiles;
}

/** @internal */
export function getTsFiles(dir: string) {
  // 定制require-dir
  var Classes = requireDir(dir, {
    recurse: true,
    extensions: [".ts"],
    require: function () { },
  });
  debug(Classes);

  return flattenObj(Classes);
}

/** @internal */
export function loadFromDecorator(file: string) {
  var Clazz = require(`${file}`);
  var obj = new Clazz.default();
  var clz_name = obj.constructor.name;
  const data = getDataFromDecoratorJson(file, obj);
  if (!data) return;

  // Clazz.default.data = data
  // require('../decrator').emptydata()
  clearCache();

  // obj.__data = data

  var newClz = data[clz_name]; //|| {}
  if (newClz) newClz.__obj = obj;

  return { clz_name, newClz };
}

/** @internal */
export function loadFromCache(file: string) {
  return import(file).then(function (Clazz) {
    var obj = new Clazz.default();
    var clz_name = obj.constructor.name;
    const _data = data();
    if (!_data) return;

    // Clazz.default.data = data
    emptydata();
    // obj.__data = _data;

    var newClz = _data[clz_name]; //|| {}
    if (newClz) newClz.__obj = obj;

    return Promise.resolve({ clz_name, newClz });
  });
}

/**
 * not log in this method
 * if need, go to uvustrategy
 */
function getDataFromDecoratorJson(file: string, obj: object) {
  // getEableRunDataMapping
  // [
  //     { method: 'initAll', hook: 'BeforeAll' },
  //     { method: 'init', hook: 'BeforeEach' },
  //     { method: 'tearDown', hook: 'AfterEach' },
  //     { method: 'tearDownAll', hook: 'AfterAll' },
  //     { method: 'succeedingTest', test: 'Test' },
  //     { method: 'addition', test: 'Test' },
  //     { Class: 'MyFirstJUnitJupiterTests', DisplayName: 'Clz test case' }
  //  ]

  // getDataMapping
  // [
  //     { method: 'initAll', hook: 'BeforeAll' },
  //     { method: 'init', hook: 'BeforeEach' },
  //     { method: 'tearDown', hook: 'AfterEach' },
  //     { method: 'tearDownAll', hook: 'AfterAll' },
  //     { method: 'succeedingTest', test: 'Test' },
  //     { method: 'addition', test: 'Test' },
  //     {
  //       method: 'addition5',
  //       test: 'Test',
  //       DisplayName: 'Custom test name containing spaces222',
  //       Disabled: 'Disabled until bug #42 has been resolved'
  //     },
  //     { Class: 'MyFirstJUnitJupiterTests', DisplayName: 'Clz test case' }
  //   ]
  const data = getDataMapping(file);
  const clazz = data.find((item) => item["Class"]?.length > 0);

  var className = clazz["Class"];
  var classDisplayName = clazz["DisplayName"];
  var classDisabledDesc = clazz["Disabled"];

  if (!cache[className]) cache[className] = {};
  if (!cache[className]["hook"]) cache[className]["hook"] = {};

  data.forEach(function (item) {
    if (item["method"]) {
      const propertyName = item["method"];

      if (!cache[className][propertyName]) cache[className][propertyName] = {};

      if (item["hook"] === "BeforeAll") {
        cache[className]["hook"]["before"] = obj[item["method"]];
      }
      if (item["hook"] === "BeforeEach") {
        cache[className]["hook"]["before.each"] = obj[item["method"]];
      }
      if (item["hook"] === "AfterEach") {
        cache[className]["hook"]["after.each"] = obj[item["method"]];
      }
      if (item["hook"] === "AfterAll") {
        cache[className]["hook"]["after"] = obj[item["method"]];
      }

      if (item["test"]) {
        if (item["DisplayName"]) {
          cache[className][propertyName]["desc"] = item["DisplayName"];
        } else {
          cache[className][propertyName]["desc"] = "no display name";
        }

        if (item["Disabled"]) {
          cache[className][propertyName]["skip"] = true;
          cache[className][propertyName]["skipReason"] = item["Disabled"];
        }
        cache[className][propertyName]["fn"] = obj[item["method"]];
      }
    }
  });

  // remove empty object, like init\initAll\tearDown\tearDownAll
  //
  // {
  //   hook: {
  //     before: [Function (anonymous)],
  //     'before.each': [Function (anonymous)],
  //     'after.each': [Function (anonymous)],
  //     after: [Function (anonymous)]
  //   },
  //   initAll: {},
  //   init: {},
  //   tearDown: {},
  //   tearDownAll: {},
  //   succeedingTest: { desc: 'no display name', fn: [Function (anonymous)] },
  //   addition: { desc: 'no display name', fn: [Function (anonymous)] },
  //   addition5: {
  //     desc: 'Custom test name containing spaces222',
  //     skip: true,
  //     skipReason: 'Disabled until bug #42 has been resolved',
  //     fn: [Function (anonymous)]
  //   }
  // }
  for (var i in cache) {
    for (var j in cache[i]) {
      var method = cache[i][j];
      if (Object.keys(method).length === 0) delete cache[i][j];
    }
  }

  // if { Class: 'MyFirstJUnitJupiterTests', DisplayName: 'Clz test case', Disabled: 'Disabled until bug #42 has been resolved'}
  // remove all method
  if (classDisabledDesc) {
    cache[className]["skipClaas"] = true;
    cache[className]["skipClaasReason"] = classDisabledDesc;
  }

  return cache;
}
