import * as path from "node:path";
import { run } from "./src";

const b = path.resolve(process.cwd(), "./examples/");
// runTests([f]);

const a = path.resolve(process.cwd(), "./examples/test-class-disable.ts");
const f = path.resolve(process.cwd(), "./examples/test.ts");
// runTestFile([f]);
// run([a, f]);

run([a, b, f]);
