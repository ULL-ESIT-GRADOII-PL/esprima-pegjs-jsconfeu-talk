const util = require('util');
var espree = require('espree');
const tokens = espree.tokenize('answer.if = /* cuarenta y dos */ 42', {
    range: true,
    loc: true,
    comment: true
})
console.log(util.inspect(tokens, { depth: Math.Infinity }));