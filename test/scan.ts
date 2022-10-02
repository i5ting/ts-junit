import { test } from 'uvu';
import * as path from 'node:path'
import * as assert from 'uvu/assert';

import { getTsFiles, requireDir } from "../src/";

test('getTsFiles(dir)', () => {
  const dir = path.resolve(process.cwd(), './tests/')

  const files = getTsFiles(dir)
  assert.is(Object.keys(files).length, 4)
})

test.only('requireDir(dir)', () => {
  const dir = path.resolve(process.cwd(), './tests/')

  const files = requireDir(dir, {
    recurse: true,
    extensions: ['.ts'],
    require: function () { }
  })

  console.dir(files)
  // assert.is(Object.keys(files).length, 4)
})

test.run()
