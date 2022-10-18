#!/usr/bin/env node

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { debug } from "./debug";
import { runCli } from "./run";

const argv = yargs(hideBin(process.argv)).argv as Record<"_", string[]>;

const fileOrDirs = argv["_"];

debug(fileOrDirs);

// compile and run tests
runCli(fileOrDirs);
