#!/usr/bin/env node

import { resolve } from "node:path";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import { runCli } from "@ts-junit/core";

const argv = yargs(hideBin(process.argv)).argv as Record<"_", string[]>;
const files = argv["_"].map((file: string) => resolve(file));

runCli(files);
