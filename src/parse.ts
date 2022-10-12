// use https://astexplorer.net/

import * as fs from "node:fs";
import { parse, visit } from "recast";
import { Debug } from "./utils";

const debug = Debug("parse");

/** @internal */
export function getEableRunDataMapping(commonjsFile: string) {
  const allTest = getDataMapping(commonjsFile);
  const clazz = allTest.find((item) => item["Class"]?.length > 0);

  if (clazz["Disabled"]?.length > 0) {
    console.log(
      clazz["Disabled"] + "has @Disabled decorator, no need to run any test!",
    );
    return [];
  }

  return allTest.filter((item) => item["Disabled"] === undefined);
}

/** @internal */
export function getDataMapping(commonjsFile: string) {
  const decoratorJson = Parse(commonjsFile);
  debug(commonjsFile);
  debug(decoratorJson);

  const arr = [];

  decoratorJson.forEach(function (item) {
    if (item.type === 1) {
      const classInfo = type1(item);
      // console.dir(i)
      if (Object.keys(classInfo).length > 0) arr.push(classInfo);
    }
    if (item.type === 2) {
      const testOrHookInfo = type2(item);
      // console.dir(i)
      if (Object.keys(testOrHookInfo).length > 0) arr.push(testOrHookInfo);
    }
  });

  function type2(item: object) {
    // 类型1
    // {
    //     "type": 2,
    //     "args": 3,
    //     "a": [
    //         [
    //             "MemberExpression",
    //             "index_1",
    //             "BeforeAll"
    //         ]
    //     ],
    //     "b": [
    //         "MyFirstJUnitJupiterTests",
    //         "prototype"
    //     ],
    //     "c": "initAll"
    // },
    //  期望结果
    //    {BeforeAll,"initAll"}
    //
    // 类型2
    //   {
    //     "type": 2,
    //     "args": 3,
    //     "a": [
    //         [
    //             "MemberExpression",
    //             "index_1",
    //             "Test"
    //         ],
    //         [
    //             "CallExpression",
    //             0,
    //             "index_1",
    //             "DisplayName",
    //             "Custom test name containing spaces111"
    //         ],
    //         [
    //             "CallExpression",
    //             0,
    //             "index_1",
    //             "DisplayName",
    //             "Custom test name containing spaces222"
    //         ],
    //         [
    //             "CallExpression",
    //             0,
    //             "index_1",
    //             "Disabled",
    //             "Disabled until bug #42 has been resolved"
    //         ]
    //     ],
    //     "b": [
    //         "MyFirstJUnitJupiterTests",
    //         "prototype"
    //     ],
    //     "c": "addition5"
    // },
    // 期望结果
    // {
    //    test: "addition5"
    //    DisplayName: "Custom test name containing spaces222"
    //    Disabled: "Disabled until bug #42 has been resolved"
    // }
    //

    const result = { method: item["c"] };

    item["a"].forEach(function (i) {
      // test or hook
      // example： BeforeAll、Test
      if (i[0] === "MemberExpression") {
        if (i[2] === "Test") {
          result["test"] = i[2];
        } else {
          result["hook"] = i[2];
        }
      }

      // DisplayName or Disabled
      if (i[0] === "CallExpression") {
        result[i[3]] = i[4];
      }
    });

    debug(result);

    return result; //(result['Disabled']) ? {} : result
  }

  function type1(item: object) {
    //   {
    //     "type": 1,
    //     "args": 2,
    //     "b": "MyFirstJUnitJupiterTests",
    //     "a": [
    //         [
    //             0,
    //             "index_1",
    //             "DisplayName",
    //             "Clz test case"
    //         ],
    //         [
    //             0,
    //             "index_1",
    //             "Disabled",
    //             "Disabled all Clazz until bug #99 has been fixed"
    //         ]
    //     ]
    // }
    // 期望结果
    // {
    //    class: "MyFirstJUnitJupiterTests"
    //    DisplayName: "Clz test case"
    //    Disabled: "Disabled all Clazz until bug #99 has been fixed"
    // }

    const result = { Class: item["b"] };

    item["a"].forEach(function (i) {
      result[i[2]] = i[3];
    });

    debug("class result");
    debug(result);

    return result; //(result['Disabled']) ? {} : result
  }

  debug(arr);

  return arr;
}

/** @internal */
export function Parse(commonjsFile: string) {
  // const source = fs.readFileSync('/Users/i5ting/workspace/ali/ts-junit/output/tests/test.js').toString()
  const source = fs.readFileSync(commonjsFile).toString();

  const ast = parse(source);

  const result = [];

  // console.dir(ast.program.body);

  visit(ast, {
    visitCallExpression(path) {
      const node = path.node;

      // d(node)
      // 方式1：hook
      //   __decorate([
      //     index_1.BeforeAll
      // ], MyFirstJUnitJupiterTests.prototype, "initAll");

      // 方式1：测试
      //   __decorate([
      //     index_1.Test
      // ], MyFirstJUnitJupiterTests.prototype, "succeedingTest");

      // 方式1：
      //   __decorate([
      //     index_1.Test,
      //     (0, index_1.DisplayName)("Custom test name containing spaces111"),
      //     (0, index_1.DisplayName)("Custom test name containing spaces222"),
      //     (0, index_1.Disabled)("Disabled until bug #42 has been resolved")
      // ], MyFirstJUnitJupiterTests.prototype, "addition5");

      // 方式2：
      // MyFirstJUnitJupiterTests = __decorate([
      //     (0, index_1.DisplayName)("Clz test case")
      //     // @Disabled("Disabled all Clazz until bug #99 has been fixed")
      // ], MyFirstJUnitJupiterTests);

      let _obj = {};

      if (node["callee"] && node["callee"]["name"] === "__decorate") {
        const type = node.arguments.length;
        // d(type)

        switch (type) {
          case 2:
            _obj = type1(node);
            break;
          case 3:
            _obj = type2(node);
            break;

          default:
            break;
        }
      }

      // filer non decorator object
      if (Object.keys(_obj).length > 0) {
        result.push(_obj);
      }

      this.traverse(path);
    },
  });
  return result;
}

/**
 * for class decorator
 * parse
    MyFirstJUnitJupiterTests = __decorate([
      (0, index_1.DisplayName)("Clz test case")
      // \@Disabled("Disabled all Clazz until bug #99 has been fixed")
    ], MyFirstJUnitJupiterTests);

 * @internal
 */
export function type1(node) {
  const result = {
    type: 1,
    args: node.arguments.length,
  };
  // d(node)
  const a = node.arguments[0];
  const b = node.arguments[1];

  const o = [];
  a.elements.forEach(function (i) {
    if (i.type === "MemberExpression") {
      // d(i.object.name + ' - ' + i.property.name)
    }

    if (i.type === "CallExpression") {
      let a1, a2, a3;
      if (i.callee.type === "SequenceExpression") {
        // d(i.callee.expressions[0].value)
        // d(i.callee.expressions[1].object.name)
        // d(i.callee.expressions[1].property.name)

        a1 = i.callee.expressions[0].value;
        a2 = i.callee.expressions[1].object.name;
        a3 = i.callee.expressions[1].property.name;
      }

      const a4 = i.arguments[0].value;

      o.push([a1, a2, a3, a4]);
    }

    if (node.arguments.length > 1) {
      result["b"] = b.name;
    }
  });

  result["a"] = o;

  debug(o);

  return result;
}

/**
 * for test method & hooks decorator
 * parse
   __decorate([
        index_1.Test
    ], MyFirstJUnitJupiterTests.prototype, "addition");
    __decorate([
        index_1.Test,
        (0, index_1.DisplayName)("Custom test name containing spaces111"),
        (0, index_1.DisplayName)("Custom test name containing spaces222"),
        (0, index_1.Disabled)("Disabled until bug #42 has been resolved")
    ], MyFirstJUnitJupiterTests.prototype, "addition5");

 * @internal
 */
export function type2(node) {
  const result = {
    type: 2,
    args: node.arguments.length,
  };
  // d(node)
  const a = node.arguments[0];
  const b = node.arguments[1];
  const c = node.arguments[2];

  // d(a)

  const o = [];
  a.elements.forEach(function (i) {
    // d('i.type = ' + i.type)
    // [
    //    index_1.Test
    // ]
    if (i.type === "MemberExpression") {
      o.push(["MemberExpression", i.object.name, i.property.name]);
    }

    // [
    //     index_1.Test,
    //     (0, index_1.DisplayName)("Custom test name containing spaces111"),
    //     (0, index_1.DisplayName)("Custom test name containing spaces222"),
    //     (0, index_1.Disabled)("Disabled until bug #42 has been resolved")
    // ]
    if (i.type === "CallExpression") {
      let a1, a2, a3;
      if (i.callee.type === "SequenceExpression") {
        // d(i.callee.expressions[0].value)
        // d(i.callee.expressions[1].object.name)
        // d(i.callee.expressions[1].property.name)
        // d(i.callee.expressions)

        a1 = i.callee.expressions[0].value;
        a2 = i.callee.expressions[1].object.name;
        a3 = i.callee.expressions[1].property.name;
      }

      const a4 = i.arguments[0].value;

      o.push(["CallExpression", a1, a2, a3, a4]);
    }
  });

  result["a"] = o;

  if (b.type === "MemberExpression") {
    result["b"] = [b.object.name, b.property.name];
  }

  if (c.type === "Literal") result["c"] = c.value;

  return result;
}
