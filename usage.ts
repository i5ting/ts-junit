import * as path from "node:path";
import { runTestFileWithDefaultStrategy } from "./src";

const f = path.resolve(process.cwd(), "./tests/test.ts");

runTestFileWithDefaultStrategy([f]);
