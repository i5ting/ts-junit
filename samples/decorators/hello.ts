import { DisplayName, Test, getSuiteData } from "@ts-junit/decorators";

@DisplayName("一个 DEMO")
export class HelloTest {
  @Test
  @DisplayName("这是 hello 方法")
  sayHello() {
    // pass
  }
}

console.dir(getSuiteData(HelloTest), { depth: 8 });
