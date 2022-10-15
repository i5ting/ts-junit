import { run } from "@ts-junit/core";

console.time();

run([__dirname + "/test"]);

console.timeEnd();
