import type { ESConstructor, ESFunction } from "./types";

export const isNullOrUndefined = (o: unknown): o is null => o == null;

export const isFunction = (o: unknown): o is ESFunction =>
  typeof o === "function";

// eslint-disable-next-line @typescript-eslint/ban-types
export function isObject<T extends object = Object | Function>(
  value: unknown,
): value is T {
  return (
    (typeof value === "object" && value !== null) || typeof value === "function"
  );
}

// copy from npm:is-class
function fnBody(fn: ESConstructor) {
  return toString
    .call(fn)
    .replace(/^[^{]*{\s*/, "")
    .replace(/\s*}[^}]*$/, "");
}

// copy from npm:is-class
export function isClass(cls: unknown): cls is ESConstructor {
  if (typeof cls !== "function") return false;
  if (/^class[\s{]/.test(Function.prototype.toString.call(cls))) return true;

  // babel.js classCallCheck() & inlined
  const body = fnBody(cls as ESConstructor);
  return (
    /classCallCheck\(/.test(body) ||
    /TypeError\("Cannot call a class as a function"\)/.test(body)
  );
}
