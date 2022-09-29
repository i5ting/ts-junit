import Context from './Context'
import IStrategy from './IStrategy'
import UvuStrategy from './UvuStrategy'
import { WatchDir, WatchFile } from './Watch'
import { Debug } from './Utils'

const debug = Debug()

export * from './decrator'
export * from './IStrategy'
export * from './Watch'
export * from './ast'
export * from './Utils'
export * from './parse'
export * from './loadObject/scan'
export * from './loadObject/flatten'


export function executeWithDefaultStrategy(dirs: string[]) {
    debug('executeWithDefaultStrategy')

    // set context use default strategy
    const context = new Context(new UvuStrategy())

    // compile and watch, then run test
    WatchDir(dirs, context)
}

export function executeFileWithDefaultStrategy(testFiles: string[]) {
    debug('executeFileWithDefaultStrategy')

    // set context use default strategy
    const context = new Context(new UvuStrategy())

    // compile and watch, then run test
    testFiles.map(function (file) {
        WatchFile(file, context)
    })
}

export function execute(dir: string[], strategy: IStrategy) {
    debug('execute With Strategy')
    const context = new Context(strategy)
    context.runTests(dir)
}
