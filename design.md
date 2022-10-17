
# 设计

- cli：命令行实现
- core：提供核心工，比如直接应用就可以使用ts-node运行。
- decorator：装饰器实现，当然，如果有schema处理更好
- strategy : 策略接口，以及默认uvu策略。
- utils：工具函数

# cli


run test with some package

> pnpm --filter  @ts-junit/utils test

# install

注意顺序

```js
$ pnpm --filter  @ts-junit/utils build
$ pnpm --filter  @ts-junit/decorator build
$ pnpm --filter  @ts-junit/strategy build
$ pnpm --filter  @ts-junit/core build
$ pnpm --filter  @ts-junit/cli build
```
