import {
  BeforeAll,
  AfterAll,
  BeforeEach,
  AfterEach,
  DisplayName,
  Tag,
  Test,
  Nested,
  getSuiteData,
} from "@ts-junit/decorators";

@DisplayName("这是 Foo")
@Tag("阿卷")
@Tag("阿丰")
class Foo {
  @BeforeAll
  beforeAll() {
    // pass
  }
  @AfterAll
  afterAll() {
    // pass
  }

  @BeforeEach
  beforeEach() {
    // pass
  }

  @AfterEach
  afterEach() {
    // pass
  }

  @Test
  @DisplayName("这是 bar 方法")
  bar() {
    // pass
  }
}

@DisplayName("一个 DEMO")
@Tag("jjc")
@Tag("狼叔")
export class TestingDemo {
  @BeforeAll
  beforeAll() {
    // pass
  }
  @AfterAll
  afterAll() {
    // pass
  }

  @BeforeEach
  beforeEach() {
    // pass
  }

  @AfterEach
  afterEach() {
    // pass
  }

  @Nested
  @DisplayName("这是 foo 测试用例")
  static Foo = Foo;

  @Test
  @DisplayName("这是 hello 方法")
  hello() {
    // pass
  }
}

console.dir(getSuiteData(TestingDemo), { depth: 8 });
