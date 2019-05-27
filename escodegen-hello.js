// API page: https://github.com/estools/escodegen/wiki/API
// Tests: https://github.com/estools/escodegen/blob/master/test/test.js
const escodegen = require('escodegen');

let result = escodegen.generate({
    type: 'BinaryExpression',
    operator: '+',
    left: { type: 'Literal', value: 40 },
    right: { type: 'Literal', value: 2 }
});

console.log(result); //40 + 2
