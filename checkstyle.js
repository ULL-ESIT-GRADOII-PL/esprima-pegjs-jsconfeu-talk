let _ = require('underscore');
let esprima = require('esprima');
let estraverse = require('estraverse');

function checkStyle(code, filename) {
    let ast = esprima.parse(code, parseOptions);
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
    _.each(node.declarations, function(decl) {
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
    return _.map(errors, function(e) {
        let loc = e.location.start;
        let prefix = (typeof filename === "function" ?
                filename("" + filename + ":" + loc.line + ":" + loc.column) : void 0) ? void 0 :
            "Line " + loc.line + ", column " + loc.column;
        return "" + prefix + ": " + e.message;
    });
}

let parseOptions = {
    loc: true,
    range: true
};

let input = `var foo = bar;
var this_is_bad = 3;
function blah() {
  return function x() {
    var oops_another_one;
  }
}`;

let output = checkStyle(input);

console.log("input ----\n"+input+"\n---\n");
console.log("output ----\n"+output.join("\n")+"\n---\n");
