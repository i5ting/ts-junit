#!/usr/bin/env ts-node-script

import { executeWithDefaultStrategy } from './index'

const isTsNode = (Symbol.for('ts-node.register.instance') in process) || !!process.env.TS_NODE_DEV
const isJestEnviroment = process.env.JEST_WORKER_ID !== undefined
const hasTsJest = 'npm_package_devDependencies_ts_jest' in process.env
const typescriptSupport = isTsNode || (isJestEnviroment && hasTsJest)

if (typescriptSupport) {
    executeWithDefaultStrategy('../../tests')
}
