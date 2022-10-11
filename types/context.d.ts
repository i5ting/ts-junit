import IStrategy from './iStrategy';
export default class Context {
  private strategy;
  constructor(strategy: IStrategy);
  setStrategy(strategy: IStrategy): void;
  runTsTestFiles(files: string[]): any;
  private _runTsTestFile;
}
