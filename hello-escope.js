// http://estools.github.io/escope/

const inspect = require('util').inspect;
var escope = require('escope');
var esprima = require('esprima');
var estraverse = require('estraverse');

const code = `
function tutu()  {
    var a = 0;
    function tutu1() {
        var a = 0;
        function tutu2() {
            var a = 0;
        }
    }
}
`;

var ast = esprima.parse(code);
var scopeManager = escope.analyze(ast);

var currentScope = scopeManager.acquire(ast); // global scope

estraverse.traverse(ast, {
    enter: function(node, parent) {
        // do stuff

        if (/Function/.test(node.type)) {
            currentScope = scopeManager.acquire(node); // get current function scope
            console.log("Entering " + inspect(currentScope.set.keys(), { depth: null }));
        }
    },
    leave: function(node, parent) {
        if (/Function/.test(node.type)) {
            console.log("Leaving " + inspect(currentScope.set.keys(), { depth: null }));
            currentScope = currentScope.upper; // set to parent scope
        }

        // do stuff
    }
});
