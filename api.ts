import * as path from "node:path";
import { run } from "./src";

let b = path.resolve(process.cwd(), "./examples/");
// runTests([f]);

let a = path.resolve(process.cwd(), "./examples/test-class-disable.ts");
let f = path.resolve(process.cwd(), "./examples/test.ts");
// runTestFile([f]);
// run([a, f]);

run([a, b, f]);
