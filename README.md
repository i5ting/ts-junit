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
        assertEquals(2, calculator.add(1, 1));
    }

}

```
