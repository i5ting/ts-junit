#!/usr/bin/env node

import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers'

import { execute } from '.'

execute(yargs(hideBin(process.argv)).argv['_'])
