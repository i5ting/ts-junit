// copyright https://github.com/aurelia/aurelia/blob/master/packages/metadata/src/index.ts

import { isObject } from "./is";
import { createTypeError } from "./util";

/** @internal  */
const metadataInternalSlot = new WeakMap<
  any,
  Map<string | symbol | undefined, Map<any, any>>
>();

function OrdinaryDefineOwnMetadata(
  MetadataKey: any,
  MetadataValue: any,
  O: any,
  P: string | symbol | undefined,
): void {
  const metadataMap = GetOrCreateMetadataMap(O, P, true);

  metadataMap.set(MetadataKey, MetadataValue);
}

/** @internal  */
function GetOrCreateMetadataMap(
  O: any,
  P: string | symbol | undefined,
  Create: true,
): Map<any, any>;

/** @internal  */
function GetOrCreateMetadataMap(
  O: any,
  P: string | symbol | undefined,
  Create: false,
): Map<any, any> | undefined;

/** @internal  */
function GetOrCreateMetadataMap(
  O: any,
  P: string | symbol | undefined,
  Create: boolean,
): Map<any, any> | undefined {
  let targetMetadata = metadataInternalSlot.get(O);
  if (targetMetadata === void 0) {
    if (!Create) return void 0;

    targetMetadata = new Map<string | symbol | undefined, Map<any, any>>();

    metadataInternalSlot.set(O, targetMetadata);
  }

  let metadataMap = targetMetadata.get(P);

  if (metadataMap === void 0) {
    if (!Create) return void 0;
    metadataMap = new Map<any, any>();
    targetMetadata.set(P, metadataMap);
  }

  return metadataMap;
}

/** @internal  */
function OrdinaryHasOwnMetadata(
  MetadataKey: any,
  O: any,
  P: string | symbol | undefined,
): boolean {
  const metadataMap = GetOrCreateMetadataMap(O, P, false);

  if (metadataMap === void 0) return false;

  return metadataMap.has(MetadataKey);
}

/** @internal  */
function OrdinaryGetOwnMetadata(
  MetadataKey: any,
  O: any,
  P: string | symbol | undefined,
): any {
  const metadataMap = GetOrCreateMetadataMap(O, P, false);

  if (metadataMap === void 0) {
    return void 0;
  }

  return metadataMap.get(MetadataKey);
}

/** @internal  */
function toPropertyKeyOrUndefined(
  propertyKey: any,
): undefined | string | symbol {
  switch (typeof propertyKey) {
    case "undefined":
    case "string":
    case "symbol":
      return propertyKey;
    default:
      return `${propertyKey}`;
  }
}

export function defineMetadata(
  metadataKey: any,
  metadataValue: any,
  target: any,
): void;

export function defineMetadata(
  metadataKey: any,
  metadataValue: any,
  target: any,
  propertyKey: any,
): void;

export function defineMetadata(
  metadataKey: any,
  metadataValue: any,
  target: any,
  propertyKey?: any,
): void {
  if (!isObject(target)) {
    throw createTypeError(
      "Metadata.define",
      "target",
      target,
      "Object or Function",
    );
  }

  return OrdinaryDefineOwnMetadata(
    metadataKey,
    metadataValue,
    target,
    toPropertyKeyOrUndefined(propertyKey),
  );
}

export function hasOwnMetadata(metadataKey: any, target: any): boolean;

export function hasOwnMetadata(
  metadataKey: any,
  target: any,
  propertyKey: any,
): boolean;
export function hasOwnMetadata(
  metadataKey: any,
  target: any,
  propertyKey?: any,
): boolean {
  if (!isObject(target)) {
    throw createTypeError(
      "Metadata.hasOwn",
      "target",
      target,
      "Object or Function",
    );
  }

  return OrdinaryHasOwnMetadata(
    metadataKey,
    target,
    toPropertyKeyOrUndefined(propertyKey),
  );
}

export function getOwnMetadata(metadataKey: any, target: any): any;

export function getOwnMetadata(
  metadataKey: any,
  target: any,
  propertyKey: any,
): any;
export function getOwnMetadata(
  metadataKey: any,
  target: any,
  propertyKey?: any,
): any {
  if (!isObject(target)) {
    throw createTypeError(
      "Metadata.getOwn",
      "target",
      target,
      "Object or Function",
    );
  }
  return OrdinaryGetOwnMetadata(
    metadataKey,
    target,
    toPropertyKeyOrUndefined(propertyKey),
  );
}
