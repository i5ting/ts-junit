
import {getAllImportsForFile,getNeedCompileFiles} from './src'



getAllImportsForFile('tests/test.ts')


var a = getNeedCompileFiles()

console.dir(a)
console.log('--------\n')


import { Watch,WatchFile } from './src'



WatchFile('tests/test.ts')
// getAllImportsForFile(process.cwd() + '/calculator.ts')



// console.log('--------\n')


// getAllImportsForFile(process.cwd() + '/src/index.ts')
