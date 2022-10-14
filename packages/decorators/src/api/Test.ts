import { isFunction, createTypeError } from "@ts-junit/shared";

import { defineSuiteData } from "./Suite";
import { getDisplayName } from "./DisplayName";

export const Test: MethodDecorator = (
  target: any,
  propertyKey: any,
  descriptor: TypedPropertyDescriptor<any>,
) => {
  const cls = target.constructor;
  const func = descriptor.value;

  // 有可能被装饰在某个属性访问器上
  if (isFunction(func) === false) {
    throw createTypeError(
      `Metadata.decorate.Test(${cls.name}):`,
      propertyKey,
      func,
      "function",
    );
  }

  const suite = defineSuiteData(cls);
  const displayName = getDisplayName(cls, propertyKey);

  suite.cases.set(propertyKey, {
    displayName,
    type: "case",
    func: propertyKey,
  });
};
