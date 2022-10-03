import * as path from "node:path";
import { runTestFile, runTests } from "./src";

const f = path.resolve(process.cwd(), "./tests");
// const f = path.resolve(process.cwd(), "./tests/test.ts");

runTests([f]);
