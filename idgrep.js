#!/usr/bin/env node

const fs = require('fs');
const esprima = require('espree');
const program = require('commander');
const { version, description } = require('./package.json');
const estraverse = require('estraverse');

const idgrep = function (pattern, code, filename) {
    const lines = code.split('\n');
    const ast = esprima.parse(code, {
        ecmaVersion: 6,
        loc: true,
        range: true
    });
    estraverse.traverse(ast, {
        enter: function (node, parent) {
            if (node.type === 'Identifier' && node.name.indexOf(pattern) >= 0) {
                let loc = node.loc.start;
                let line = loc.line - 1;
                console.log("" + line + ":" + loc.column + ": " + lines[line]);
            }
        }
    });
};

program
    .version(version)
    .description(description)
    .usage('[options] <filename> [...]');


program.parse(process.argv);

let inputFilename = program.args.shift();
try {
    if (inputFilename) {
        fs.readFile(inputFilename, 'utf8', (err, input) => {
            debugger;
            if (err) throw `Error reading '${inputFilename}':${err}`;
            idgrep('hack', input, inputFilename);
        })
    } else {
        program.help();
    }
} catch (e) {
    console.log(`Errores! ${e}`);
}

/*
  idgrep('hack', `
// This is a hack!
function hacky_function() {
   var hack = 3;
   return 'hacky string';
 }`);

 */