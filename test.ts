import { executeWithDefaultStrategy, executeFileWithDefaultStrategy } from './src'

console.time()
// executeFileWithDefaultStrategy([process.cwd() + '/tests/test.ts'])

executeWithDefaultStrategy([process.cwd() + "/tests"]);

console.timeEnd()
