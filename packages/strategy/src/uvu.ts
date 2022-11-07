// @ts-nocheck
import { suite } from "uvu";
import { debug } from "@ts-junit/utils";
import { Strategy } from ".";

/**
 * Concrete Strategies implement the Uvu test framework while following the base Strategy
 * interface. The interface makes them interchangeable in the Context.
 */
export class UvuStrategy implements Strategy {
  test: any;

  testcase(name: string): any {
    debug("testcase(name: string): any {}");
    this.test = suite(name);
  }

  public parseData(
    i: string,
    clz_name: Strategy,
    Clazz: any,
    obj: object,
  ): void {
    if (Clazz["skipClass"]) {
      console.warn(`Class skip ${clz_name} reason: ${Clazz.skipClassReason}`);
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

            if (Clazz[j]["params"]) {
              const params = Clazz[j]["params"];

              params.map((param) => {
                this.test(j, obj[j].bind(obj, param));
              });
            } else {
              this.test(j, obj[j].bind(obj));
            }
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
