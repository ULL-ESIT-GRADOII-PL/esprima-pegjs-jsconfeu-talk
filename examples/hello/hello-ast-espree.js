const util = require('util');
const espree = require('espree');
const ast = espree.parse(`
function getAnswer() {
 return 42;
}
`);
console.log(util.inspect(ast, { depth: Math.Infinity }));