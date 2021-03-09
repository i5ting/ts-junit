import IStrategy from './IStrategy';
export * from './decrator';
export * from './IStrategy';
export declare function executeWithDefaultStrategy(dir: String): void;
export declare function execute(dir: String, strategy: IStrategy): void;
