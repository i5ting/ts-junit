import * as path from "node:path";
import { runTestFile, runTests } from "./src";

let f = path.resolve(process.cwd(), "./tests/");
runTests([f]);


// let f = path.resolve(process.cwd(), "./tests/test.ts");
// runTestFile([f]);
