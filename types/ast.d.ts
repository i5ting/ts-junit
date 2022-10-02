export declare const libFiles: Set<unknown>;
export declare const localFiles: Set<string>;
export declare const processedFiles: Set<unknown>;
export declare const needCompileFiles: any[];
export declare function getAllImportsForFile(file: string, options?: Object): void;
export declare function getNeedCompileFiles(): any[];
export declare function getDependencyImports(files: any): {
    lib: Set<unknown>;
    local: Set<unknown>;
};
