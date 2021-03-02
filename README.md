# ts-junit
use junit descrator with jest


- jest 支持 ts 需要引入babel
- ts-jest 直接支持ts，测试语法上是jest语法，suite/test或describe/it
- ts-junit 使用junit 5的装饰器进行封装

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
