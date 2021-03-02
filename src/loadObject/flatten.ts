import { Debug } from '../Utils'

const debug = Debug()

export function flatten(node: any, path = '', nodeList = []) {
    if (node != null) {
        debug('node i')

        // let children = node.children
        for (let i in node) {
            debug(i)
            debug(node[i])

            if (node[i]['newClz']) {
                debug('找到了具体的object了 ' + path)

                node[i]['path'] = path + '/' + i
                nodeList.push(node[i]);
            } else {
                debug('没找到，继续深度优先' + i)
                flatten(node[i], path + '/' + i, nodeList)
            }
        }
    }

    return nodeList
}
