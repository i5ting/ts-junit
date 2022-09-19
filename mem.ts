import { fs, vol } from 'memfs';


import { patchRequire } from 'fs-monkey';

vol.writeFileSync('/index2.js', 'console.log("hi world")');
vol.writeFileSync('/index.js', `require('/index2');console.log("hi world")`);
patchRequire(vol);
require('/index'); // hi world


