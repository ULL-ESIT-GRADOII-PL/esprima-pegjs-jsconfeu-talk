const util = require('util');
var esprima = require('esprima');
const tokens = esprima.tokenize('answer.if = /* cuarenta y dos */ 42', {
    range: true,
    loc: true,
    comment: true
})
console.log(util.inspect(tokens, { depth: Math.Infinity }));