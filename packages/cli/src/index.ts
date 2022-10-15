#!/usr/bin/env node

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { debug } from "@ts-junit/utils";

import { runCli } from "./run";

const argv = yargs(hideBin(process.argv)).argv as Record<"_", string[]>;

const files = argv["_"];

debug(argv);

// run
runCli(files);
