#!/usr/bin/env ts-node-script


const isTsNode = (Symbol.for('ts-node.register.instance') in process) || !!process.env.TS_NODE_DEV
const isJestEnviroment = process.env.JEST_WORKER_ID !== undefined
const hasTsJest = 'npm_package_devDependencies_ts_jest' in process.env
const typescriptSupport = isTsNode || (isJestEnviroment && hasTsJest)

if (typescriptSupport) {
    // 
}


import { Cli } from 'clipanion';

import { MainCommand } from './commands/MainCommand';

const [node, app, ...args] = process.argv;

const cli = new Cli({
    binaryLabel: `ts-junit Application`,
    binaryName: `${node} ${app}`,
    binaryVersion: `1.0.0`,
})

cli.register(MainCommand);
cli.runExit(args, Cli.defaultContext);
