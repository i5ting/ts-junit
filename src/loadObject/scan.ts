import { flatten, flattenObj } from './flatten'

import { Debug } from '../Utils'

import { getDataMapping } from '../'

import { requireDir } from './require'

const debug = Debug()

var cache = {}

export function getTsFiles(dir: string) {
    // 定制require-dir
    var Classes = requireDir(dir, {
        recurse: true,
        extensions: ['.ts'],
        // require: function (r, abs, folder) {
        //     var Clazz = r;
        //     var obj = new Clazz.default()

        //     debug("obj0" + abs)
        //     debug(obj)

        //     const data = require('../decrator').data()
        //     if (!data) return

        //     // Clazz.default.data = data
        //     require('../decrator').emptydata()

        //     obj.__data = data
        //     var clz_name = obj.constructor.name
        //     var newClz = data[clz_name]
        //     if (newClz) newClz.__obj = obj

        //     return { clz_name, newClz }
        // }
    })
    debug(Classes)

    return flattenObj(Classes)
}

export function scan(dir: String) {
    var requireDir = require('./require')
    // 定制require-dir
    var Classes = requireDir(dir, {
        recurse: true,
        extensions: ['.ts'],
        require: function (r, abs, folder) {
            var Clazz = r;
            var obj = new Clazz.default()

            debug("obj0" + abs)
            debug(obj)

            const data = require('../decrator').data()
            if (!data) return

            // Clazz.default.data = data
            require('../decrator').emptydata()

            obj.__data = data
            var clz_name = obj.constructor.name
            var newClz = data[clz_name]
            if (newClz) newClz.__obj = obj

            return { clz_name, newClz }
        }
    })

    let nodeList = flatten(Classes)

    return nodeList
}

// var nodeList = scan('../../tests')
export function load(file: string) {
    var Clazz = require(`${file}`)
    var obj = new Clazz.default()
    var clz_name = obj.constructor.name
    const data = getDataFromDecoratorJson(file, obj)
    if (!data) return

    // Clazz.default.data = data
    // require('../decrator').emptydata()
    cache = {}

    obj.__data = data

    var newClz = data[clz_name] //|| {}
    if (newClz) newClz.__obj = obj

    return { clz_name, newClz }
}

function getDataFromDecoratorJson(file: string, obj: object) {
    // getEableRunDataMapping
    // [
    //     { method: 'initAll', hook: 'BeforeAll' },
    //     { method: 'init', hook: 'BeforeEach' },
    //     { method: 'tearDown', hook: 'AfterEach' },
    //     { method: 'tearDownAll', hook: 'AfterAll' },
    //     { method: 'succeedingTest', test: 'Test' },
    //     { method: 'addition', test: 'Test' },
    //     { Class: 'MyFirstJUnitJupiterTests', DisplayName: 'Clz test case' }
    //  ]

    // getDataMapping
    // [
    //     { method: 'initAll', hook: 'BeforeAll' },
    //     { method: 'init', hook: 'BeforeEach' },
    //     { method: 'tearDown', hook: 'AfterEach' },
    //     { method: 'tearDownAll', hook: 'AfterAll' },
    //     { method: 'succeedingTest', test: 'Test' },
    //     { method: 'addition', test: 'Test' },
    //     {
    //       method: 'addition5',
    //       test: 'Test',
    //       DisplayName: 'Custom test name containing spaces222',
    //       Disabled: 'Disabled until bug #42 has been resolved'
    //     },
    //     { Class: 'MyFirstJUnitJupiterTests', DisplayName: 'Clz test case' }
    //   ]
    const data = getDataMapping(file)
    const clazz = data.find(item => item['Class']?.length > 0)

    var className = clazz['Class']
    var classDisplayName = clazz['DisplayName']

    if (!cache[className]) cache[className] = {}
    if (!cache[className]['hook']) cache[className]['hook'] = {}

    data.forEach(function (item) {
        if (item['method']) {
            const propertyName = item['method']

            if (!cache[className][propertyName]) cache[className][propertyName] = {}

            if (item['hook'] === 'BeforeAll') {
                cache[className]['hook']['before'] = obj[item['method']]
            }
            if (item['hook'] === 'BeforeEach') {
                cache[className]['hook']['before.each'] = obj[item['method']]
            }
            if (item['hook'] === 'AfterEach') {
                cache[className]['hook']['after.each'] = obj[item['method']]
            }
            if (item['hook'] === 'AfterAll') {
                cache[className]['hook']['after'] = obj[item['method']]
            }

            if (item['test']) {
                if (item['DisplayName']) {
                    cache[className][propertyName]['desc'] = item['DisplayName']
                } else {
                    cache[className][propertyName]['desc'] = 'no display name'
                }

                if (item['Disabled']) {
                    cache[className][propertyName]['skip'] = true
                    cache[className][propertyName]['skipReason'] = item['Disabled']
                }
                cache[className][propertyName]['fn'] = obj[item['method']]
            }
        }
    })

    return cache
}
