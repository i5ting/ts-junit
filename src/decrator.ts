import { Debug } from "./utils";

const debug = Debug("ts-junit");

let cache = {};

/** @alpha */
export function emptydata() {
  debug("emptydata := {}");
  debug(cache);
  cache = {};
  return cache;
}

/** @alpha */
export function data() {
  debug("Data Dump:");
  debug(cache);
  return cache;
}

/** @alpha */
export function BeforeAll(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<any>,
) {
  debug(`BeforeAll`);
  // console.dir(propertyName)
  // console.dir(descriptor)
  // test(cache[propertyName] || "default", target[propertyName])
  // test.run()
  const className = target.constructor.name;
  if (!cache[className]) cache[className] = {};
  if (!cache[className]["hook"]) cache[className]["hook"] = {};

  cache[className]["hook"]["before"] = target[propertyName];
  debug(`exist hook: ${className}.hook.before`);
}

/** @alpha */
export function BeforeEach(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<any>,
) {
  debug(target[propertyName]);
  // console.dir(propertyName)
  // console.dir(descriptor)
  const className = target.constructor.name;
  if (!cache[className]) cache[className] = {};
  if (!cache[className]["hook"]) cache[className]["hook"] = {};

  cache[className]["hook"]["before.each"] = target[propertyName];
  debug(`exist hook: ${className}.hook.before.each`);
}

/** @alpha */
export function AfterEach(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<any>,
) {
  debug(target[propertyName]);
  // console.dir(propertyName)
  // console.dir(descriptor)
  const className = target.constructor.name;
  if (!cache[className]) cache[className] = {};
  if (!cache[className]["hook"]) cache[className]["hook"] = {};

  cache[className]["hook"]["after.each"] = target[propertyName];
  debug(`exist hook: ${className}.hook.after.each`);
}

/** @alpha */
export function AfterAll(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<any>,
) {
  debug(target[propertyName]);
  // console.dir(propertyName)
  // console.dir(descriptor)
  const className = target.constructor.name;
  if (!cache[className]) cache[className] = {};
  if (!cache[className]["hook"]) cache[className]["hook"] = {};

  cache[className]["hook"]["after"] = target[propertyName];
  debug(`exist hook: ${className}.hook.after`);
}

/** @alpha */
export function Test(
  target: object,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<any>,
) {
  debug(target[propertyName]);

  //classname
  const className = target.constructor.name;
  // console.log(target.constructor.name);
  // console.dir(Object.keys(target))
  // console.log(Reflect.ownKeys(target));
  // console.log(className);
  // console.dir(propertyName)
  if (!cache[className]) cache[className] = {};
  if (!cache[className][propertyName]) cache[className][propertyName] = {};

  // console.dir(Object.keys(target).join('-'))

  cache[className][propertyName]["desc"] = "no display name";
  cache[className][propertyName]["fn"] = target[propertyName];
}

/**
 * Creates a test case DisplayName.
 * Can be used on entity property or on entity.
 * Can create suite name when used on entity.
 *
 * @alpha
 */

export function DisplayName(
  message: string,
): ClassDecorator & PropertyDecorator {
  // console.dir(message)
  return function (
    clsOrObject: CallableFunction | object,
    propertyName?: string | symbol,
  ) {
    const target = propertyName
      ? clsOrObject.constructor
      : (clsOrObject as CallableFunction);
    const className = target.name;
    if (!cache[className]) cache[className] = {};

    if (propertyName) {
      // when @DisplayName with property
      // test(message, fn)
      //
      // when
      //      @Test
      //      @DisplayName("Custom test name 1")
      //      @DisplayName("Custom test name 2")
      // message = "Custom test name 2"

      // console.dir(className)
      if (!cache[className][propertyName]) {
        cache[className][propertyName] = {
          desc: message,
        };
      }

      debug(`when @DisplayName with property: ${message}`);
    } else {
      // when @DisplayName with class
      // const testSuite = suite(message);
      debug(`when @DisplayName with class: ${message}`);
      const className = target.name;
      // console.dir(className)
      // cache[className]['desc'] = message
    }
  };
}

/**
 * Creates a test case DisplayName.
 * Can be used on entity property or on entity.
 * Can create suite name when used on entity.
 *
 * @alpha
 */

export function Disabled(message: string): ClassDecorator & PropertyDecorator {
  // console.dir(message)
  return function (
    clsOrObject: CallableFunction | object,
    propertyName?: string | symbol,
  ) {
    const target = propertyName
      ? clsOrObject.constructor
      : (clsOrObject as CallableFunction);
    const className = target.name;
    if (!cache[className]) cache[className] = {};

    if (propertyName) {
      // when @DisplayName with property
      // test(message, fn)
      //
      // when
      //      @Test
      //      @DisplayName("Custom test name 1")
      //      @DisplayName("Custom test name 2")
      // message = "Custom test name 2"
      // cache[propertyName] = message

      debug(`when @Disabled with property: ${message}`);

      if (!cache[className][propertyName]) {
        cache[className][propertyName] = {};
        debug(cache[className][propertyName]);
      }

      cache[className][propertyName]["skip"] = true;
      cache[className][propertyName]["skipReason"] = message;
    } else {
      // when @DisplayName with class
      // const testSuite = suite(message);
      debug(`when @DisplayName with class: ${message}`);

      cache[className]["skipClaas"] = true;
      cache[className]["skipClaasReason"] = message;
    }
  };
}
