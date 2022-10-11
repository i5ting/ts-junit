import debugModule from 'debug';
export declare function Debug(name?: string): debugModule.Debugger;
export declare function DebugWith(key: string): debugModule.Debugger;
export declare function get_closest_package_json(): any;
export declare function getFiles(rest: any): string[];
export declare function getCompileFiles(testFiles: string[]): string[];
export declare function unique(arr: string[]): string[];
