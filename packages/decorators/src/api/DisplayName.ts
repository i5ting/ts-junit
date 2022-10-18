import {
  createTypeError,
  isFunction,
  isNullOrUndefined,
  isClass,
  defineMetadata,
  getOwnMetadata,
} from "@ts-junit/shared";

import { defineSuiteData } from "./Suite";

const metadataKey = Symbol.for("junit.metadata.deco:displayName");

export const getDisplayName = (target: any, propertyKey?: string | symbol) => {
  return getOwnMetadata(metadataKey, target, propertyKey);
};

export function DisplayName(displayName: string) {
  const deco = (
    target: any,
    propertyKey?: any,
    descriptor?: TypedPropertyDescriptor<any>,
  ): void => {
    if (isNullOrUndefined(propertyKey)) {
      const suite = defineSuiteData(target);
      suite.displayName = displayName;
      return;
    }

    // 如果是装饰在属性上，则必须是一个 class 对象
    if (isNullOrUndefined(descriptor)) {
      // TODO 只支持静态属性？
      if (isClass(target) === false) {
        throw createTypeError(
          `Metadata.decorate.DisplayName(${target.constructor.name})`,
          propertyKey!,
          target,
          "class",
        );
      }

      const sub = target[propertyKey!];

      if (isClass(sub) === false) {
        throw createTypeError(
          `Metadata.decorate.DisplayName(${target.name})`,
          propertyKey!,
          sub,
          "class",
        );
      }

      defineMetadata(metadataKey, displayName, target, propertyKey);
      return;
    }

    const cls = target.constructor;
    const func = descriptor!.value;

    // 有可能被装饰在某个属性访问器上
    if (isFunction(func) === false) {
      throw createTypeError(
        `Metadata.decorate.DisplayName(${cls.name})`,
        propertyKey!,
        func,
        "function",
      );
    }

    defineMetadata(metadataKey, displayName, cls, propertyKey);
  };

  return deco;
}
