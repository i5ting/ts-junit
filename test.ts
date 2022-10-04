import { runCli } from "./src";

console.time();

runCli([process.cwd() + "/tests"]);

console.timeEnd();
