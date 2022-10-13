import { suite } from "uvu";

import IStrategy from "./iStrategy";
import { Debug } from "./utils";

const debug = Debug();

/**
 * Concrete Strategies implement the Uvu test framework while following the base Strategy
 * interface. The interface makes them interchangeable in the Context.
 */
export default class UvuStrategy implements IStrategy {
  test: any;

  testcase(name: string): any {
    debug("testcase(name: string): any {}");
    this.test = suite(name);
  }

  public parseData(
    i: string,
    clz_name: IStrategy,
    Clazz: any,
    obj: object,
  ): void {
    if (Clazz["skipClaas"]) {
      console.warn(`Class skip ${clz_name} reason: ${Clazz.skipClaasReason}`);
    } else {
      for (const j in Clazz) {
        if (j === "hook") {
          for (const z in Clazz["hook"]) {
            debug(z + " hook=" + Clazz["hook"][z]);

            if (z.split(".").length == 2) {
              const a = z.split(".");

              debug("a1= " + a);

              this.test[a[0]][a[1]](Clazz["hook"][z].bind(obj));
            } else {
              debug(z + " a2= " + Clazz["hook"][z]);
              // console.dir("z")
              // console.dir(Clazz['hook'][z])
              // console.dir(z)
              this.test[z](Clazz["hook"][z].bind(obj));
            }
          }
        } else {
          if (!Clazz[j]["skip"]) {
            debug(`define testcase ${j}`);
            debug(" test.handler = " + obj[j]);

            this.test(j, obj[j].bind(obj));
          } else {
            debug(`skipReason ${j}`);
            console.log(
              `method skip ${Clazz[i]}#${j}() reason: ${Clazz[j]["skipReason"]}`,
            );
          }
        }
      }
    }
  }
}
