import Context from './Context'
import IStrategy from './IStrategy'
import UvuStrategy from './UvuStrategy'
import { Debug } from './Utils'

const debug = Debug()

export * from './decrator'
export * from './IStrategy'

export function executeWithDefaultStrategy(dir: String) {
    debug('executeWithDefaultStrategy')
    const context = new Context(new UvuStrategy())

    context.runTests(dir)
}

export function execute(dir: String, strategy: IStrategy) {
    debug('execute With Strategy')
    const context = new Context(strategy)
    context.runTests(dir)
}
