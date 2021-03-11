import { flatten } from './flatten'

import { Debug } from '../Utils'

const debug = Debug()

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

export function load(file: String) {
    var Clazz = require(`${file}`)
    var obj = new Clazz.default()
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