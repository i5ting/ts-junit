import * as fs from 'node:fs'
import debugModule from 'debug';
// const debug = new debugModule('foo');

// see https://github.com/i5ting/quickdebug/
export function Debug(name?: string) {
    var key = name ? name : get_closest_package_json().name

    return DebugWith(key)
}

// see https://github.com/i5ting/colondebug/
export function DebugWith(key: String) {
    var operation = key.split(':').pop()
    var debug = new debugModule(key)

    if (Object.keys(console).includes(operation)) {
        debug = console[operation]
    }

    return debug
}

export function get_closest_package_json() {
    const debug = DebugWith("ts-junit:utils")

    var config
    var isNext = true

    module.paths.forEach(function (i) {
        var file = i.replace('node_modules', 'package.json')

        if (isNext && fs.existsSync(file) === true) {
            try {
                // break with flag
                isNext = false

                // log
                debug('exist file = ' + file)

                // get package.json content
                config = require(file)
            } catch (e) {
                console.error('get_closest_package_json' + e)
            }
        } else {
            debug('not exist file = ' + file)
        }
    })

    return config
}
