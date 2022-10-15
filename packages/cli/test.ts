import { run } from "@ts-junit/core";

console.time();

run([process.cwd() + "/examples"]);

console.timeEnd();
