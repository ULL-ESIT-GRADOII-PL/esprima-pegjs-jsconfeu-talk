const util = require('util');
const acorn = require('acorn');
const ast = acorn.parse(`
function getAnswer() {
 return 42;
}
`);
console.log(util.inspect(ast, { depth: Math.Infinity }));