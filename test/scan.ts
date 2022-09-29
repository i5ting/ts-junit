import { test } from 'uvu';
import * as path from 'node:path'
import * as assert from 'uvu/assert';

import { getTsFiles } from "../src/loadObject/scan";

test('getTsFiles(dir)', () => {
  const dir = path.resolve(process.cwd(), './tests/')

  const files = getTsFiles(dir)
  assert.is(Object.keys(files).length, 4)
})

test.run()
