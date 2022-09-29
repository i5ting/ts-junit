import * as fs from 'node:fs'
import { load } from './loadObject/scan';

import { Debug } from './Utils'

// import { Watch } from './Watch'

import { Parse } from './parse'

const debug = Debug("ts-junit")

import IStrategy from './IStrategy'
import { assert } from 'node:console';

let d = debug
/**
 * The Context defines the interface of interest to clients.
 */
export default class Context {
    /**
     * @type {IStrategy} The Context maintains a reference to one of the Strategy
     * objects. The Context does not know the concrete class of a strategy. It
     * should work with all strategies via the Strategy interface.
     */
    private strategy: IStrategy;

    /**
     * Usually, the Context accepts a strategy through the constructor, but also
     * provides a setter to change it at runtime.
     */
    constructor(strategy: IStrategy) {
        this.strategy = strategy;
    }

    /**
     * Usually, the Context allows replacing a Strategy object at runtime.
     */
    public setStrategy(strategy: IStrategy) {
        this.strategy = strategy;
    }

    /**
     * run one test file
     * 
     * parse ts to get decorator meta data
     * invoke js to run test
     */
    public runTest(tsFile: string, jsFile: string): void {
        debug('runTest: ' + jsFile)

        assert(fs.existsSync(jsFile))


        debug(" --- runTest --- ")
        let nodeList = [load(jsFile)]

        debug("--------------- MAIN ------------------")
        debug('nodeList')
        debug(nodeList)

        for (let i in nodeList) {
            const Clazz = nodeList[i]
            debug("Clazz---")
            debug(Clazz)

            let newClz = Clazz.newClz

            debug(newClz)

            var obj = Clazz.newClz.__obj
            delete newClz.__obj

            debug('Context: Run tests using the strategy (not sure how it\'ll do it)');

            this.strategy.testcase(Clazz.clz_name)

            d(i)
            d(Clazz.clz_name)
            d(newClz)
            d(obj)
            this.strategy.parseData(i, Clazz.clz_name, newClz, obj);

            this.strategy.test.run()
        }
    }

}
