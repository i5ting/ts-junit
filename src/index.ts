import Context from './context';
import UvuStrategy from './uvuStrategy';
import { WatchFiles } from './watch';
import { Debug, getFiles } from './utils';
import IStrategy from './iStrategy';

const debug = Debug();

export * from './decrator';
export * from './iStrategy';
export * from './watch';
export * from './ast';
export * from './utils';
export * from './parse';
export * from './loadObject/scan';
export * from './loadObject/require';
export * from './loadObject/flatten';

/**
 * for cli invoke (need compile ts to js)
 *
 * run([path.resolve(process.cwd(), "./tests/")])
 * run([path.resolve(process.cwd(), "./tests/"),path.resolve(process.cwd(), "./tests/test.ts")])
 * 
 * @public
 */
export function runCli(rest: any, strategy: IStrategy = new UvuStrategy()) {
  debug('runCli With UvuStrategy');
  console.time('build ts');

  // set context use default strategy
  const context = new Context(strategy);

  // get all file from rest(file or folder)
  const files = getFiles(rest);

  // compile and watch, then run test
  WatchFiles(files, context);

  // time statistics
  console.timeEnd('build ts');
}

/**
 * for api invoke (use ts-node)
 *
 * run([path.resolve(process.cwd(), "./tests/")])
 * run([path.resolve(process.cwd(), "./tests/"),path.resolve(process.cwd(), "./tests/test.ts")])
 * 
 * @public
 */
export function run(rest: any, strategy: IStrategy = new UvuStrategy()) {
  debug('run With UvuStrategy');
  console.time('run ts');

  // set context use default strategy
  const context = new Context(strategy);

  // get all file from rest(file or folder)
  const files = getFiles(rest);

  // run tests
  context.runTsTestFiles(files);

  // time statistics
  console.timeEnd('run ts');
}
