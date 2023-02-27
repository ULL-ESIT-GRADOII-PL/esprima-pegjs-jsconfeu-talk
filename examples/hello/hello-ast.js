const util = require('util');
const esprima = require('esprima');
const ast = esprima.parse(`
function getAnswer() {
 return 42;
}
`);
console.log(util.inspect(ast, {depth: Math.Infinity}));
