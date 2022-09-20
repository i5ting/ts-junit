// const A = require('./output/tests/test').default
const { NodeVM } = require('vm2');

// const o = new A()
// console.dir(o)
const f1 = require('fs')
const { fs, vol } = require('memfs');
const { patchRequire } = require('fs-monkey');


const { ufs } = require('unionfs');
ufs.use(f1).use(vol);

var walk = require('walkdir');

//async with path callback 

var json = {}
walk.sync('output', function (path, stat) {
    // const a = f1.readFileSync(path)

    if (stat.isFile()) {
        var p = path.replace(process.cwd(), '').replace('/output/', '')
        console.log('found: ', p);
        json[p] = f1.readFileSync(path).toString();
    }
});

// console.dir(json)

// const json = {
//     './README.md': '1',
//     './src/index.js': '2',
//     './node_modules/debug/index.js': '3',
// };
vol.fromJSON(json);

// 
// 


// patchRequire(ufs)
patchRequire(vol)

const A = require('tests/test').default

const o = new A()
console.dir(o)


// global.vol = vol


// const vm = new NodeVM({
//     require: {
//         external: true,
//         root: './',
//         customRequire: require
//         // builtin: ['fs', 'path', 'uvu']
//     }
// });


// vm.run(`

//     var request = require('debug')("sss");
//     request('http://www.google.com');
//     // var assert = require("uvu/assert");

//     // function main(){
//     //     assert.is(Math.sqrt(4), 2);
//     //     assert.is(Math.sqrt(4), 21);
//     // }

//     // // main()
//     const A = require('tests/test').default
//     // const A = require('src/index').default

//     const o = new A()
//     console.dir(o)
// `, 'vm.js');


// console.dir(vol.readFileSync('tests/test.js').toString())

// var m = require('module')
// var src = `
//     const A = require('tests/test').default;
//     const o = new A()
//     console.dir(o)
// `

// patchRequire(ufs);
// patchRequire(vol);

// var res = require('vm').runInThisContext(m.wrap(src))(exports, require, module, __filename, __dirname)
// console.log(module.exports)