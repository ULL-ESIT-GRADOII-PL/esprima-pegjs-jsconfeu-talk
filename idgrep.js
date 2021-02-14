    let esprima, estraverse, idgrep, parseOptions;

    esprima = require('esprima');

    estraverse = require('estraverse');

    idgrep = function(pattern, code, filename) {
        let ast, lines;
        lines = code.split('\n');
        ast = esprima.parse(code, parseOptions);
        estraverse.traverse(ast, {
            enter: function(node, parent) {
                var line, loc;
                if (node.type === 'Identifier' && node.name.indexOf(pattern) >= 0) {
                    loc = node.loc.start;
                    line = loc.line - 1;
                    console.log("" + line + ":" + loc.column + ": " + lines[line]);
                }
            }
        });
    };

    parseOptions = {
        loc: true,
        range: true
    };

    idgrep('hack', `
  // This is a hack!
  function hacky_function() {
     var hack = 3;
     return 'hacky string';
   }`);
