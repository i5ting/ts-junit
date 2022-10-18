import type { ESCallable } from "@ts-junit/shared";

export type TestHooks = {
  beforeAll: string[];
  afterAll: string[];
  beforeEach: string[];
  afterEach: string[];
};

export interface TestBaseData {
  displayName?: string;
  type: string;
}

export interface TestSuiteData extends TestBaseData {
  type: "suite";
  /**
   * EcmaScript Class or Function
   */
  target: ESCallable;
  tags: Set<string>;
  hooks: TestHooks;
  cases: Map<string | symbol, TestCaseData | TestSuiteData>;
}

export interface TestCaseData extends TestBaseData {
  type: "case";
  func: string;
}
