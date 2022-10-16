#!/usr/bin/env node

import { resolve } from "node:path";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { debug } from "@ts-junit/utils";

import { runCli } from "./run";

const argv = yargs(hideBin(process.argv)).argv as Record<"_", string[]>;

const files = argv["_"]; //.map((file: string) => resolve(file));

// console.dir("files+++" + argv);
debug(argv);
// console.dir(files);

// run
runCli(files);
