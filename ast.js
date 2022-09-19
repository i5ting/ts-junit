var detective = require('detective');
var fs = require('fs');

var src = fs.readFileSync(__dirname + '/a.js');
var requires = detective(src);
console.dir(requires);