import { Debug } from ".";

const debug = Debug();

/** @internal */
export function flatten(node: any, path = "", nodeList = []) {
  if (node != null) {
    debug("node i");

    // let children = node.children
    for (const i in node) {
      debug(i);
      debug(node[i]);

      if (node[i]["newClz"]) {
        debug("找到了具体的object了 " + path);

        node[i]["path"] = path + "/" + i;
        nodeList.push(node[i]);
      } else {
        debug("没找到，继续深度优先" + i);
        flatten(node[i], path + "/" + i, nodeList);
      }
    }
  }

  return nodeList;
}

/**
 * Declare a flatten function that takes
 * object as parameter and returns the
 * flatten object
 *
 * @internal
 * */
export function flattenObj(ob: any) {
  // The object which contains the
  // final result
  const result = {};

  // loop through the object "ob"
  for (const i in ob) {
    // We check the type of the i using
    // typeof() function and recursively
    // call the function again
    if (typeof ob[i] === "object" && !Array.isArray(ob[i])) {
      const temp = flattenObj(ob[i]);
      for (const j in temp) {
        // Store temp in result
        result[i + "." + j] = temp[j];
      }
    }

    // Else store ob[i] in result directly
    else {
      result[i] = ob[i];
    }
  }
  return result;
}
