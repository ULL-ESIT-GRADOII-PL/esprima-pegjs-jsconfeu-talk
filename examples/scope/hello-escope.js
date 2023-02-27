// http://estools.github.io/escope/

var escope = require('escope');
var esprima = require('esprima');
var estraverse = require('estraverse');

const code = `
let a,b,c;
function tutu()  {
    let a;
    const b = 1;
    function tutu1() {
        var a, b;
        function tutu2() {
            var a, b;
            a = "tutu2 a"; // reference to local tutu2 a
            for(let i=0; i<10; i++) {
                let d = "tutu2 i"; 
            }
        }
    }
}
a = 4; // reference to global a
`;


function msg(node, currentScope) {
  let message = `Entering. ${node.id.name} scope: 
  scope type: ${currentScope.type}
  variable names: ${currentScope.variables.map(v => v.name)}
  reference names: ${currentScope.references.map(v => v.identifier.name)} 
`;

  return message
}
var ast = esprima.parse(code);

/**
 * analyze is the main interface function. Takes an Esprima syntax tree and returns the
 * analyzed scopes.
 * @function analyze
 * @param {esprima.Tree} tree
 * @param {Object} providedOptions - Options that tailor the scope analysis
 * @param {boolean} [providedOptions.optimistic=false] - the optimistic flag
 * @param {boolean} [providedOptions.directive=false]- the directive flag
 * @param {boolean} [providedOptions.ignoreEval=false]- whether to check 'eval()' calls
 * @param {boolean} [providedOptions.nodejsScope=false]- whether the whole
 * script is executed under node.js environment. When enabled, escope adds
 * a function scope immediately following the global scope.
 * @param {boolean} [providedOptions.impliedStrict=false]- implied strict mode
 * (if ecmaVersion >= 5).
 * @param {string} [providedOptions.sourceType='script']- the source type of the script. one of 'script' and 'module'
 * @param {number} [providedOptions.ecmaVersion=5]- which ECMAScript version is considered
 * @param {Object} [providedOptions.childVisitorKeys=null] - Additional known visitor keys. See [esrecurse](https://github.com/estools/esrecurse)'s the `childVisitorKeys` option.
 * @param {string} [providedOptions.fallback='iteration'] - A kind of the fallback in order to encounter with unknown node. See [esrecurse](https://github.com/estools/esrecurse)'s the `fallback` option.
 * @return {ScopeManager}
 */
var scopeManager = escope.analyze(ast);

/**
 * acquire scope from node.
 * @method ScopeManager#acquire
 * @param {Esprima.Node} node - node for the acquired scope.
 * @param {boolean=} inner - look up the most inner scope, default value is false.
 * @return {Scope?}
 */
var currentScope = scopeManager.acquire(ast); // global scope
/* CurrentScope is an object that has a "variables" attribute, which is an array of Variable objects. */
/* This array contains all the variables declared in the current scope. 
 * This includes occurrences of local variables as well as variables from
 * parent scopes (including the global scope). For local variables
 * this also includes defining occurrences (like in a 'var' statement).
 * In a 'function' scope this does not include the occurrences of the
 * formal parameter in the parameter list.
 * @member {Reference[]} Scope#references
 */

console.log(`Global scope:
  scope type: ${currentScope.type}
  variable names: ${currentScope.variables.map(v => v.name)}
  reference names: ${currentScope.references.map(v => v.identifier.name)}
`);

estraverse.traverse(ast, {
    enter: function(node, parent) {
        // do stuff

        if (/Function/.test(node.type)) {
            currentScope = scopeManager.acquire(node); // get current function scope
            console.log(msg(node, currentScope));
        }
    },
    
    leave: function(node, parent) {
        if (/Function/.test(node.type)) {
            //console.log(msg(node, currentScope));
            currentScope = currentScope.upper; // set to parent scope
        }

        // do stuff
    }
});
