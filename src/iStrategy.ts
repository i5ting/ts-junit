/**
 * The Strategy interface declares operations common to all supported versions
 * of some test framework.
 *
 * The Context uses this interface to call the test framework defined by Concrete
 * Strategies.
 */
export default interface IStrategy {
  test: any;
  testcase(name: string): any;
  parseData(i: string, clz_name: IStrategy, Clazz: any, obj: object): void;
}
