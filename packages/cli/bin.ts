#!/usr/bin/env node

import { resolve } from "node:path";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import { runCli } from "@ts-junit/core";

const files = yargs(hideBin(process.argv)).argv["_"].map((file: string) =>
  resolve(file),
);

runCli(files);
