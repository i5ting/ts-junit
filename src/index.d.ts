type Types = 'string' | 'number' | 'boolean' | 'object' | 'undefined' | 'function';

export type Message = string | Error;
export function ok(actual: any, msg?: Message): void;
export function is(actual: any, expects: any, msg?: Message): void;
export function equal(actual: any, expects: any, msg?: Message): void;
export function type(actual: any, expects: Types, msg?: Message): void;
export function instance(actual: any, expects: any, msg?: Message): void;
export function snapshot(actual: string, expects: string, msg?: Message): void;
export function fixture(actual: string, expects: string, msg?: Message): void;
export function match(actual: string, expects: string | RegExp, msg?: Message): void;
export function throws(fn: Function, expects?: Message | RegExp | Function, msg?: Message): void;
export function not(actual: any, msg?: Message): void;
export function unreachable(msg?: Message): void;
