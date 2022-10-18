import {
  defineMetadata,
  getOwnMetadata,
  hasOwnMetadata,
} from "@ts-junit/shared";
import type { TestSuiteData } from "../types";

const metadataKey = Symbol.for("junit.metadata.deco:suite");

function initializeSuiteData(target: any): TestSuiteData {
  const data: TestSuiteData = {
    displayName: undefined,
    type: "suite",
    target,
    tags: new Set(),
    hooks: {
      beforeAll: [],
      afterAll: [],
      beforeEach: [],
      afterEach: [],
    },
    cases: new Map(),
  };

  return data;
}

function getOrCreateSuiteData(target: any, create: true): TestSuiteData;
function getOrCreateSuiteData(
  target: any,
  create: false,
): TestSuiteData | undefined;
function getOrCreateSuiteData(
  target: any,
  create: boolean,
): TestSuiteData | undefined {
  if (hasOwnMetadata(metadataKey, target) === false) {
    if (create === false) return void 0;

    defineMetadata(metadataKey, initializeSuiteData(target), target);
  }

  return getOwnMetadata(metadataKey, target);
}

export function defineSuiteData(target: any) {
  return getOrCreateSuiteData(target, true);
}

export function getSuiteData(target: any): TestSuiteData | undefined {
  return getOrCreateSuiteData(target, false);
}
