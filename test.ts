import { execute } from "./src";

console.time();

execute([process.cwd() + "/tests"]);

console.timeEnd();
