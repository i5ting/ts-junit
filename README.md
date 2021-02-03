# ts-junit
use junit descrator with typescript


- ~~jest 支持 ts 需要引入babel~~
- ~~ts-jest 直接支持ts，测试语法上是jest语法，suite/test或describe/it~~
- **ts-junit 使用junit 5的装饰器进行封装，成熟，使用于熟悉OO的开发，尤其对Java开发更友好。**
- **ts-junit 默认使用uvu，同时提供各个常见测试框架的支持，比如jest、mocha、ava、tape、qunit、jasmine等。**

## 示例

```
import Calculator from './calculator';

import {Test, assertEquals} from 'ts-junit'

class MyFirstJUnitJupiterTests {

    private final Calculator calculator = new Calculator();

    @Test
    void addition() {
        expect(2).toEqual(calculator.add(1, 1))
    }

}

```

结合 https://github.com/midwayjs/injection 更简单


```
class Test {
  @Inject()
  helloTest: IHelloTest;
  @Inject()
  helloService: IHelloService;

  @Before()
  before() {
    mock(helloTest, 'sayhello', () => {
      return 'mocked'
    });
  }

  @Test()
  async test() {
    expect(this.helloTest.sayhello()).eq('mocked');
    
    expect(this.helloService.sayhello('test')).eq('hello test');
  }
}
```

## 装饰器

参考junit5的文档 https://junit.org/junit5/docs/current/user-guide/#writing-tests-annotations

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
            <td class="tableblock halign-left valign-top">❌</td>
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
            <td class="tableblock halign-left valign-top">❌</td>
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
            <td class="tableblock halign-left valign-top">❌</td>
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
            <td class="tableblock halign-left valign-top">❌</td>
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

