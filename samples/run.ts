import { runCli } from "@ts-junit/core";

console.time();

runCli([__dirname + "/hello"]);

console.timeEnd();
