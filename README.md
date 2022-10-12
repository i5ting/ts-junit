# ts-junit

![version](https://img.shields.io/npm/v/ts-junit)
![license](https://img.shields.io/npm/l/ts-junit)
[![TypeScript](https://img.shields.io/badge/lang-typescript-informational)](https://www.typescriptlang.org)
![npm total downloads](https://img.shields.io/npm/dt/ts-junit.svg)
![npm month downloads](https://img.shields.io/npm/dm/ts-junit.svg)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/i5ting/ts-junit/pulls)
[![Github action](https://github.com/i5ting/ts-junit/actions/workflows/ci.yml/badge.svg)](https://github.com/i5ting/ts-junit/actions/workflows/ci.yml)

> use JUnit 5 Decorator in TypeScript

在我看来，在 TypeScript 里使用面向对象是很大概率变成最常用的方式的。目前所有的 JavaScript 测试都是面向过程的，比如 qunit、jest、mocha、ava、tape 等测试框架实现，还是围绕在面向过程阶段。我以为这不是 TypeScript 在现实中该有的样式。

我对 Java 还算熟悉，比如使用 JUnit 5 的测试代码就是采用面向对象写法的，代码如下。

```Java
import static org.junit.jupiter.api.Assertions.assertEquals;
import example.util.Calculator;
import org.junit.jupiter.api.Test;

class MyFirstJUnitJupiterTests {

    private final Calculator calculator = new Calculator();

    @Test
    void addition() {
        assertEquals(2, calculator.add(1, 1));
    }
}
```

这种写法是非常简单的，这就是 Java 面向的好处。如果换成 TypeScript，几乎可以保持写法一模一样，代码如下。

```ts
import assert from "assert";
import { Test } from "ts-junit";

export default class MyFirstJUnitJupiterTests {
  calculator = new Calculator();

  @Test
  addition() {
    assert.is(2, calculator.add(1, 1));
  }
}
```

反观前端的测试代码基本上 2 种风格。前端的测试代码风格 1，它是最常用的测试方式，代码实例如下。

```js
test("JSON", () => {
  const input = {
    foo: "hello",
    bar: "world",
  };

  const output = JSON.stringify(input);

  assert.snapshot(output, `{"foo":"hello","bar":"world"}`);
  assert.equal(JSON.parse(output), input, "matches original");
});
```

前端的测试代码风格 2，bdd 风格，它更强调行为对测试用例的影响，代码实例如下。

```js
describe("User", function () {
  describe("#save()", function () {
    it("should save without error", function (done) {
      var user = new User("Luna");
      user.save(function (err) {
        if (err) throw err;
        done();
      });
    });
  });
});
```

对比一下 Java 和 JavaScript 测试多个写法之后，你会发现，面向对象在 JavaScript（TypeScript）里根本不是一等公民。于是我就萌发了一个想法，想用 TypeScript 实现一下 JUnit。

## 特性

- ~~jest 支持 ts 需要引入 babel~~
- ~~ts-jest 直接支持 ts，测试语法上是 jest 语法，suite/test 或 describe/it~~
- ts-junit 支持 2 种用法，其中 cli 方式采用增量 ts 编译，效率很高的。
- ts-junit 使用 junit 5 的装饰器进行封装，成熟，使用于熟悉 OO 的开发，尤其对了解 Java 的开发者更友好。
- ts-junit 使用 uvu 作为默认策略，同时也可以实现各个常见测试框架的支持，比如 jest、mocha、ava、tape、qunit、jasmine 等（暂时未实现）。

## 示例

```ts
import assert from 'assert'
import { BeforeAll, BeforeEach, Disabled, Test, AfterEach, AfterAll } from 'ts-junit'

export default class MyFirstJUnitJupiterTests {
    calculator = new Calculator()

    @BeforeAll
    static void initAll() {
    }

    @BeforeEach
    void init() {
    }

    @Test
    void succeedingTest() {

    }

    @Test
    void failingTest() {
        assert.fail("a failing test");
    }

    @Test
    @Disabled("for demonstration purposes")
    void skippedTest() {
        // not executed
    }

    @Test
    void abortedTest() {
        assert.assumeTrue("abc".contains("Z"));
        assert.fail("test should have been aborted");
    }

    @AfterEach
    void tearDown() {
    }

    @AfterAll
    static void tearDownAll() {
    }
}
```

## Usages

### 方式 1: 使用独立 cli 进行编译

不依赖当前项目的 ts 环境，直接通过 cli 执行，参考源码中 tests 目录下的文件。

```shell
$ npm i --global ts-juint
$ junit tests
$ junit tests/test.ts
```

编写第一个测试用例

```ts
import assert from 'assert'
import { Test } from 'ts-junit'

export default class MyFirstJUnitJupiterTests  {

    calculator = new Calculator();

    @Test
    void addition() {
        assert.is(2, calculator.add(1, 1));
    }
}
```

### 方式 2: 依赖当前项目的 ts 环境进行编译

```shell
$ npm i --save-dev ts-juint
```

编写测试入口文件 ts-junit.ts，文件内指定测试文件或测试目录即可。

```ts
import * as path from "node:path";
import { run } from "ts-junit";

const folder = path.resolve(process.cwd(), "./tests");
const file = path.resolve(process.cwd(), "./tests/test.ts");

run([folder, file]);
// or custom Strategy
// import SomeStrategy from "./SomeStrategy";
// run([folder, file], new SomeStrategy());
```

创建编译时的 tsconfig.json 文件

```ts
{
  "compileOnSave": true,
  "compilerOptions": {
    "target": "es2017",
    "module": "commonjs",
    "sourceMap": true,
    "outDir": "./build",
    "rootDir": "./src",
    "typeRoots": [],
    "types": [],
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "exclude": ["node_modules"],
  "include": ["./src/**/*.ts", "./test/**/*.ts"]
}
```

编辑 package.json 的启动和编译脚本

```ts
{
  "scripts": {
    "test": "NODE_ENV=dev ts-node --project tsconfig.json --files ts-junit.ts",
    "build": "tsc"
  }
}
```

启动服务

```
$ npm test
> NODE_ENV=dev ts-node --project tsconfig.json --files ts-junit.ts
[2020-9-1 19:52:12] [debug] [init] [router] get - /
```

## 装饰器

- 参考 junit5 的文档 https://junit.org/junit5/docs/current/user-guide/#writing-tests-annotations
- 进度 `7/20`

<table class="tableblock frame-all grid-all stretch">
    <colgroup>
        <col style="width: 20%;">
        <col style="width: 80%;">
    </colgroup>
    <thead>
        <tr>
            <th class="tableblock halign-left valign-top">Annotation</th>
            <th class="tableblock halign-left valign-top">Description</th>
            <th class="tableblock halign-left valign-top">isSupported</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock"><code>@Test</code></p>
            </td>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock">Denotes that a method is a test method. Unlike JUnit 4’s <code>@Test</code>
                    annotation, this annotation does not declare any attributes, since test extensions in JUnit Jupiter
                    operate based on their own dedicated annotations. Such methods are <em>inherited</em> unless they
                    are <em>overridden</em>.</p>
            </td>
            <td class="tableblock halign-left valign-top">✅</td>
        </tr>
        <tr>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock"><code>@ParameterizedTest</code></p>
            </td>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock">Denotes that a method is a <a
                        href="https://junit.org/junit5/docs/current/user-guide/#writing-tests-parameterized-tests">parameterized test</a>. Such methods are
                    <em>inherited</em> unless they are <em>overridden</em>.
                </p>
            </td>
            <td class="tableblock halign-left valign-top">❌</td>
        </tr>
        <tr>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock"><code>@RepeatedTest</code></p>
            </td>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock">Denotes that a method is a test template for a <a
                        href="https://junit.org/junit5/docs/current/user-guide/#writing-tests-repeated-tests">repeated test</a>. Such methods are <em>inherited</em>
                    unless they are <em>overridden</em>.</p>
            </td>
            <td class="tableblock halign-left valign-top">❌</td>
        </tr>
        <tr>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock"><code>@TestFactory</code></p>
            </td>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock">Denotes that a method is a test factory for <a
                        href="https://junit.org/junit5/docs/current/user-guide/#writing-tests-dynamic-tests">dynamic tests</a>. Such methods are <em>inherited</em>
                    unless they are <em>overridden</em>.</p>
            </td>
            <td class="tableblock halign-left valign-top">❌</td>
        </tr>
        <tr>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock"><code>@TestTemplate</code></p>
            </td>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock">Denotes that a method is a <a href="https://junit.org/junit5/docs/current/user-guide/#writing-tests-test-templates">template for
                        test cases</a> designed to be invoked multiple times depending on the number of invocation
                    contexts returned by the registered <a href="https://junit.org/junit5/docs/current/user-guide/#extensions-test-templates">providers</a>. Such methods
                    are <em>inherited</em> unless they are <em>overridden</em>.</p>
            </td>
            <td class="tableblock halign-left valign-top">❌</td>
        </tr>
        <tr>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock"><code>@TestMethodOrder</code></p>
            </td>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock">Used to configure the <a href="https://junit.org/junit5/docs/current/user-guide/#writing-tests-test-execution-order">test method
                        execution order</a> for the annotated test class; similar to JUnit 4’s
                    <code>@FixMethodOrder</code>. Such annotations are <em>inherited</em>.
                </p>
            </td>
            <td class="tableblock halign-left valign-top">❌</td>
        </tr>
        <tr>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock"><code>@TestInstance</code></p>
            </td>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock">Used to configure the <a href="https://junit.org/junit5/docs/current/user-guide/#writing-tests-test-instance-lifecycle">test
                        instance lifecycle</a> for the annotated test class. Such annotations are <em>inherited</em>.
                </p>
            </td>
            <td class="tableblock halign-left valign-top">❌</td>
        </tr>
        <tr>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock"><code>@DisplayName</code></p>
            </td>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock">Declares a custom <a href="https://junit.org/junit5/docs/current/user-guide/#writing-tests-display-names">display name</a> for the
                    test class or test method. Such annotations are not <em>inherited</em>.</p>
            </td>
            <td class="tableblock halign-left valign-top">✅</td>
        </tr>
        <tr>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock"><code>@DisplayNameGeneration</code></p>
            </td>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock">Declares a custom <a href="https://junit.org/junit5/docs/current/user-guide/#writing-tests-display-name-generator">display name
                        generator</a> for the test class. Such annotations are <em>inherited</em>.</p>
            </td>
            <td class="tableblock halign-left valign-top">❌</td>
        </tr>
        <tr>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock"><code>@BeforeEach</code></p>
            </td>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock">Denotes that the annotated method should be executed <em>before</em>
                    <strong>each</strong> <code>@Test</code>, <code>@RepeatedTest</code>,
                    <code>@ParameterizedTest</code>, or <code>@TestFactory</code> method in the current class; analogous
                    to JUnit 4’s <code>@Before</code>. Such methods are <em>inherited</em> unless they are
                    <em>overridden</em>.
                </p>
            </td>
            <td class="tableblock halign-left valign-top">✅</td>
        </tr>
        <tr>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock"><code>@AfterEach</code></p>
            </td>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock">Denotes that the annotated method should be executed <em>after</em>
                    <strong>each</strong> <code>@Test</code>, <code>@RepeatedTest</code>,
                    <code>@ParameterizedTest</code>, or <code>@TestFactory</code> method in the current class; analogous
                    to JUnit 4’s <code>@After</code>. Such methods are <em>inherited</em> unless they are
                    <em>overridden</em>.
                </p>
            </td>
            <td class="tableblock halign-left valign-top">✅</td>
        </tr>
        <tr>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock"><code>@BeforeAll</code></p>
            </td>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock">Denotes that the annotated method should be executed <em>before</em>
                    <strong>all</strong> <code>@Test</code>, <code>@RepeatedTest</code>,
                    <code>@ParameterizedTest</code>, and <code>@TestFactory</code> methods in the current class;
                    analogous to JUnit 4’s <code>@BeforeClass</code>. Such methods are <em>inherited</em> (unless they
                    are <em>hidden</em> or <em>overridden</em>) and must be <code>static</code> (unless the "per-class"
                    <a href="https://junit.org/junit5/docs/current/user-guide/#writing-tests-test-instance-lifecycle">test instance lifecycle</a> is used).
                </p>
            </td>
            <td class="tableblock halign-left valign-top">✅</td>
        </tr>
        <tr>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock"><code>@AfterAll</code></p>
            </td>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock">Denotes that the annotated method should be executed <em>after</em>
                    <strong>all</strong> <code>@Test</code>, <code>@RepeatedTest</code>,
                    <code>@ParameterizedTest</code>, and <code>@TestFactory</code> methods in the current class;
                    analogous to JUnit 4’s <code>@AfterClass</code>. Such methods are <em>inherited</em> (unless they
                    are <em>hidden</em> or <em>overridden</em>) and must be <code>static</code> (unless the "per-class"
                    <a href="https://junit.org/junit5/docs/current/user-guide/#writing-tests-test-instance-lifecycle">test instance lifecycle</a> is used).
                </p>
            </td>
            <td class="tableblock halign-left valign-top">✅</td>
        </tr>
        <tr>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock"><code>@Nested</code></p>
            </td>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock">Denotes that the annotated class is a non-static <a
                        href="https://junit.org/junit5/docs/current/user-guide/#writing-tests-nested">nested test class</a>. <code>@BeforeAll</code> and
                    <code>@AfterAll</code> methods cannot be used directly in a <code>@Nested</code> test class unless
                    the "per-class" <a href="https://junit.org/junit5/docs/current/user-guide/#writing-tests-test-instance-lifecycle">test instance lifecycle</a> is
                    used. Such annotations are not <em>inherited</em>.
                </p>
            </td>
            <td class="tableblock halign-left valign-top">❌</td>
        </tr>
        <tr>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock"><code>@Tag</code></p>
            </td>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock">Used to declare <a href="https://junit.org/junit5/docs/current/user-guide/#writing-tests-tagging-and-filtering">tags for filtering
                        tests</a>, either at the class or method level; analogous to test groups in TestNG or Categories
                    in JUnit 4. Such annotations are <em>inherited</em> at the class level but not at the method level.
                </p>
            </td>
            <td class="tableblock halign-left valign-top">❌</td>
        </tr>
        <tr>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock"><code>@Disabled</code></p>
            </td>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock">Used to <a href="https://junit.org/junit5/docs/current/user-guide/#writing-tests-disabling">disable</a> a test class or test
                    method; analogous to JUnit 4’s <code>@Ignore</code>. Such annotations are not <em>inherited</em>.
                </p>
            </td>
            <td class="tableblock halign-left valign-top">✅</td>
        </tr>
        <tr>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock"><code>@Timeout</code></p>
            </td>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock">Used to fail a test, test factory, test template, or lifecycle method if its
                    execution exceeds a given duration. Such annotations are <em>inherited</em>.</p>
            </td>
            <td class="tableblock halign-left valign-top">❌</td>
        </tr>
        <tr>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock"><code>@ExtendWith</code></p>
            </td>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock">Used to <a href="https://junit.org/junit5/docs/current/user-guide/#extensions-registration-declarative">register extensions
                        declaratively</a>. Such annotations are <em>inherited</em>.</p>
            </td>
            <td class="tableblock halign-left valign-top">❌</td>
        </tr>
        <tr>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock"><code>@RegisterExtension</code></p>
            </td>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock">Used to <a href="https://junit.org/junit5/docs/current/user-guide/#extensions-registration-programmatic">register extensions
                        programmatically</a> via fields. Such fields are <em>inherited</em> unless they are
                    <em>shadowed</em>.
                </p>
            </td>
            <td class="tableblock halign-left valign-top">❌</td>
        </tr>
        <tr>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock"><code>@TempDir</code></p>
            </td>
            <td class="tableblock halign-left valign-top">
                <p class="tableblock">Used to supply a <a
                        href="https://junit.org/junit5/docs/current/user-guide/#writing-tests-built-in-extensions-TempDirectory">temporary directory</a> via field
                    injection or parameter injection in a lifecycle method or test method; located in the
                    <code>org.junit.jupiter.api.io</code> package.
                </p>
            </td>
            <td class="tableblock halign-left valign-top">❌</td>
        </tr>
    </tbody>
</table>

## TODO

1. 结合 https://github.com/midwayjs/injection 更简单(暂未实现)

   ```ts
   class Test {
     @Inject()
     helloTest: IHelloTest;
     @Inject()
     helloService: IHelloService;

     @Before()
     before() {
       mock(helloTest, "sayhello", () => {
         return "mocked";
       });
     }

     @Test()
     async test() {
       expect(this.helloTest.sayhello()).eq("mocked");

       expect(this.helloService.sayhello("test")).eq("hello test");
     }
   }
   ```

2. use vm2 with require from memfs

3. 目前 ts 编译成 js 之后，是通过 ast 去解析的 js 提取装饰器信息的，

   提取方式是

   <!-- prettier-ignore -->
   ```js
   __decorate([index_1.BeforeAll], MyFirstJUnitJupiterTests.prototype, 'initAll');
   ```

   这里面可以试试能否直接反射出来，用一个类似探针的方式，运行时去提取装饰器，应该也是可行的。

   <!-- prettier-ignore -->
   ```js
   var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
       var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
       if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
       else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
       return c > 3 && r && Object.defineProperty(target, key, r), r;
   };
   ```
