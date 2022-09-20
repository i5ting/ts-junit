
const { NodeVM } = require('vm2');
const { fs, vol } = require('memfs')
const f1 = require('fs');
const { patchRequire } = require('fs-monkey');

const { ufs } = require('unionfs');
ufs.use(f1).use(vol);


ufs.writeFileSync('/index.js', `const debug = require('debug')('xxx');module.exports=function(x){console.log(x)}`);

patchRequire(ufs);
// hi world


// const vm = new NodeVM({
//     require: {
//         external: true,
//         root: process.cwd(),
//         // customRequire: require
//     },
//     sandbox: {
//         a: (x) => require('/index.js')(x)
//     }
// });


// vm.run(`
//     a(112121)
// `, 'test-with-memfs.js');

require('/index.js')(112)