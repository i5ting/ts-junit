export default interface IStrategy {
    test: any;
    testcase(name: string): any;
    parseData(i: string, clz_name: IStrategy, Clazz: any, obj: Object): void;
}
