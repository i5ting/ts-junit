export declare function clearCache(): void;
export declare function getAllTsFiles(dirs: string[]): any[];
export declare function getTsFiles(dir: string): {};
export declare function loadFromDecorator(file: string): {
  clz_name: any;
  newClz: any;
};
export declare function loadFromCache(file: string): Promise<{
  clz_name: any;
  newClz: any;
}>;
