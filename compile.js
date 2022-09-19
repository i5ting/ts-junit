// based on code from https://stackoverflow.com/questions/38779924/compiling-webpack-in-memory-but-resolving-to-node-modules-on-disk

// import * as webpack from 'webpack'
import * as MemoryFileSystem from 'memory-fs'
import * as path from 'path'
import * as fs from 'fs'
import * as promisify from 'util.promisify'

const memFs = new MemoryFileSystem()
const statOrig = memFs.stat.bind(memFs)
const readFileOrig = memFs.readFile.bind(memFs)

memFs.stat = function (_path, cb) {
  statOrig(_path, function (err, result) {
    if (err) {
      return fs.stat(_path, cb)
    } else {
      return cb(err, result)
    }
  })
}
memFs.readFile = function (path, cb) {
  readFileOrig(path, function (err, result) {
    if (err) {
      return fs.readFile(path, cb)
    } else {
      return cb(err, result)
    }
  })
}

export default async function compile (code) {
  // Setup webpack
  // create a directory structure in MemoryFS that matches
  // the real filesystem
  const rootDir = __dirname
  //write code snippet to memoryfs
  const outputName = `file.js`
  const entryName = `file.ts`
  const entry = path.join(rootDir, entryName)
  const rootExists = memFs.existsSync(rootDir)
  if (!rootExists) {
    memFs.mkdirpSync(rootDir)
  }
  memFs.writeFileSync(entry, code)
  //point webpack to memoryfs for the entry file
  const compiler = webpack({
    entry: entry,
    output: {
      filename: outputName,
    },
    module: {
      loaders: [
        {
          test: /\.tsx?$/,
          loaders: [
            'ts-loader?' + JSON.stringify({
              transpileOnly: true,
              configFileName: 'tsconfig.json',
            }),
          ],
        },
        {
          test: /\.json$/, loader: 'json',
        },
      ],
    },
  }) as any
  compiler.run = promisify(compiler.run)

  // direct webpack to use memoryfs for file input
  compiler.inputFileSystem = memFs
  compiler.resolvers.normal.fileSystem = memFs

  //direct webpack to output to memoryfs rather than to disk
  compiler.outputFileSystem = memFs
  const stats = await compiler.run()

  // remove entry from memory. we're done with it
//   memFs.unlinkSync(entry)
  const errors = stats.compilation.errors
  if (errors && errors.length > 0) {
    // if there are errors, throw the first one
    throw errors[0]
  }
  // retrieve the output of the compilation
  const res = stats.compilation.assets[outputName].source()
  return res
}


// var m = require('module')
// var src = 'module.exports = 42'

// function eval2(src){
//     var res = require('vm').runInThisContext(m.wrap(src))(exports, require, module, __filename, __dirname)
//     console.log(module.exports)
// }