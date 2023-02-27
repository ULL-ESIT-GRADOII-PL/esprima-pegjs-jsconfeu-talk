#!/usr/bin/env node
const fs = require("fs");
const esprima = require("espree");
const program = require("commander");
const { version } = require("../../package.json");
const estraverse = require("estraverse");

const idgrep = function (pattern, code, filename) {
  const lines = code.split("\n");
  if (/^#!/.test(lines[0])) code = code.replace(/^.*/, ""); // Avoid line "#!/usr/bin/env node"
  const ast = esprima.parse(code, {
    ecmaVersion: 6,
    loc: true,
    range: true,
  });
  estraverse.traverse(ast, {
    enter: function (node, parent) {
      if (node.type === "Identifier" && pattern.test(node.name)) {
        let loc = node.loc.start;
        let line = loc.line - 1;
        console.log(
          `file ${filename}: line ${loc.line}: col: ${loc.column} text: ${lines[line]}`
        );
      }
    },
  });
};

program
  .version(version)
  .description('Searches for IDs in a list of programs')
  .option("-p --pattern [regexp]", "regexp to use in the search", "hack")
  .usage("[options] <filename> ...");

program.parse(process.argv);
const options = program.opts();
const pattern = new RegExp(options.pattern);

if (program.args.length == 0) program.help();

for (const inputFilename of program.args) {
  try {
    fs.readFile(inputFilename, "utf8", (err, input) => {
      debugger;
      if (err) throw `Error reading '${inputFilename}':${err}`;
      idgrep(pattern, input, inputFilename);
    });
  } catch (e) {
    console.log(`Errores! ${e}`);
  }
}