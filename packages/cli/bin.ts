#!/usr/bin/env node

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import { runCli } from "@ts-junit/core";

runCli(yargs(hideBin(process.argv)).argv["_"]);
