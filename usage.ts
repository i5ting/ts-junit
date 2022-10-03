import * as path from "node:path";
import { run } from "./src";

let b = path.resolve(process.cwd(), "./tests/");
// runTests([f]);

let a = path.resolve(process.cwd(), "./tests/test-class-disable.ts");
let f = path.resolve(process.cwd(), "./tests/test.ts");
// runTestFile([f]);
// run([a, f]);

run([a, b, f]);