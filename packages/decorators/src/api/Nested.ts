import { isClass, createTypeError } from "@ts-junit/shared";

import { defineSuiteData, getSuiteData } from "./Suite";
import { getDisplayName } from "./DisplayName";

export const Nested: PropertyDecorator = (
  target: any,
  propertyKey: string | symbol,
) => {
  // TODO 只支持静态属性？
  if (isClass(target) === false) {
    throw createTypeError(
      `Metadata.decorate.DisplayName(${target.constructor.name})`,
      propertyKey!,
      target,
      "class",
    );
  }

  const sub = target[propertyKey! as string];

  if (isClass(sub) === false) {
    throw createTypeError(
      `Metadata.decorate.DisplayName(${target.name})`,
      propertyKey!,
      sub,
      "class",
    );
  }

  const suite = getSuiteData(sub)!;

  // TODO 如果没有加 Test 装饰器，不会创建测试套件数据
  // TODO 为以后支持 SkipIf 等装饰器，会导致不创建测试套件数据
  if (suite === null) {
    return;
  }

  const parentSuite = defineSuiteData(target);
  const displayName = getDisplayName(target, propertyKey);

  if (displayName === null) {
    parentSuite.cases.set(propertyKey, suite);
  } else {
    parentSuite.cases.set(propertyKey, { ...suite, displayName });
  }
};
