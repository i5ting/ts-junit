import { runCli } from "./src";

console.time();

runCli([process.cwd() + "/examples"]);

console.timeEnd();
