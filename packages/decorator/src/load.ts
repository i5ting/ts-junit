import { debug } from "@ts-junit/utils";

import { data } from "./";

/** @internal */
export function loadFromCache(file: string) {
  return import(file).then(function (Clazz) {
    debug(Clazz);

    const obj = new Clazz.default();
    const clz_name = obj.constructor.name;

    debug(data());
    const _data = data();

    debug(_data);

    if (!_data) return;

    debug(file);
    debug(clz_name);
    debug(_data);
    // Clazz.default.data = data
    // emptydata();
    // obj.__data = _data;

    const newClz = _data[clz_name] || {};
    if (newClz) newClz.__obj = obj;

    return Promise.resolve({ clz_name, newClz });
  });
}
