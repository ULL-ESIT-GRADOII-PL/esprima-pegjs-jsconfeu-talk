const esprima = require('esprima');
const estraverse = require('estraverse');

function checkStyle(code, filename) {
    const ast = esprima.parse(code, parseOptions);
    let errors = [];
    estraverse.traverse(ast, {
        enter: function(node, parent) {
            if (node.type === 'VariableDeclaration')
                checkVariableNames(node, errors);
        }
    });
    return formatErrors(code, errors, filename);
}

function checkVariableNames(node, errors) {
    node.declarations.forEach(function(decl) {
        if (decl.id.name.indexOf('_') >= 0) {
            return errors.push({
                location: decl.loc,
                message: 'Use camelCase for variable names, not hacker_style.'
            });
        }
    });
}

// Takes a list of errors found by `checkStyle`, and returns a list of
// human-readable error messages.
function formatErrors(code, errors, filename) {
    return errors.map(function(e) {
        const loc = e.location.start;
        const prefix = (typeof filename === "function" ?
                filename("" + filename + ":" + loc.line + ":" + loc.column) : void 0) ? void 0 :
            "Line " + loc.line + ", column " + loc.column;
        return "" + prefix + ": " + e.message;
    });
}

const parseOptions = {
    loc: true,
    range: true
};

const input = `
var foo = bar;
var this_is_bad = 3;
function blah() {
  return function x() {
    var oops_another_one;
  }
}`;

const output = checkStyle(input);

console.log("input ----\n"+input+"\n---\n");
console.log("output ----\n"+output.join("\n")+"\n---\n");
