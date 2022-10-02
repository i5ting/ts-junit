import IStrategy from './IStrategy';
export * from './decrator';
export * from './IStrategy';
export * from './Watch';
export * from './ast';
export * from './Utils';
export * from './parse';
export * from './loadObject/scan';
export * from './loadObject/require';
export * from './loadObject/flatten';
export declare function executeWithDefaultStrategy(dirs: string[]): void;
export declare function executeFileWithDefaultStrategy(testFiles: string[]): void;
export declare function execute(dir: string[], strategy: IStrategy): void;
