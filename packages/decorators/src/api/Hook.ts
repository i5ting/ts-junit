import { isFunction, createTypeError } from "@ts-junit/shared";
import type { TestHooks } from "../types";

import { defineSuiteData } from "./Suite";

const createHook = (hookName: keyof TestHooks): MethodDecorator => {
  return (
    target: any,
    propertyKey: any,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const cls = target.constructor;
    const func = descriptor.value;

    // 有可能被装饰在某个属性访问器上
    if (isFunction(func) === false) {
      throw createTypeError(
        `Metadata.decorate.${hookName}(${cls.name}):`,
        propertyKey,
        func,
        "function",
      );
    }

    const suite = defineSuiteData(cls);

    suite.hooks[hookName].push(propertyKey);
  };
};

export const BeforeAll: MethodDecorator = createHook("beforeAll");

export const AfterAll: MethodDecorator = createHook("afterAll");

export const BeforeEach: MethodDecorator = createHook("beforeEach");

export const AfterEach: MethodDecorator = createHook("afterEach");
