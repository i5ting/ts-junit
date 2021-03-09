import IStrategy from './IStrategy';
export default class Context {
    private strategy;
    constructor(strategy: IStrategy);
    setStrategy(strategy: IStrategy): void;
    runTests(dir: String): void;
}
