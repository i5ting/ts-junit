const { NodeVM } = require('vm2');
const vm = new NodeVM({
    require: {
        external: true,
        root: process.cwd()
    }
});

// vm.run(`
//     var request = require('debug')("sss");
//     request('http://www.google.com');
//     var assert = require("uvu/assert");

//     function main(){
//         assert.is(Math.sqrt(4), 2);
//         assert.is(Math.sqrt(4), 21);
//     }

//     main()

// `, 'vm.js');


// vm.run(`
//     var request = require('debug')("sss");
   
//     const A = require('./output/tests/test').default

//     const o = new A()
//     console.dir(o)
    
// `, 'vm.js');

