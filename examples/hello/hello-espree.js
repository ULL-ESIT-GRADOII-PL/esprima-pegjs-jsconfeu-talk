/*
  Espree started out as a fork of Esprima v1.2.2, the last stable
  published released of Esprima before work on ECMAScript 6 began.
  Espree is now built on top of Acorn, which has a modular architecture
  that allows extension of core functionality. The goal of Espree is
  to produce output that is similar to Esprima with a similar API so
  that it can be used in place of Esprima.
*/
const ins = require('util').inspect;
const dump = (x) => ins(x, {depth: null});
const espree = require("espree");
const code = `
  let a = 4;
  if (a == 4) a = 5;
`;
const ast = espree.parse(code, {
    // attach range information to each node
    range: false,
    // attach line/column location information to each node
    loc: false,
    // create a top-level comments array containing all comments
    comment: false,
    // create a top-level tokens array containing all tokens
    tokens: false,
    // Set to 3, 5 (default), 6, 7, 8, 9, or 10 to specify the version of ECMAScript syntax you want to use.
    // You can also set to 2015 (same as 6), 2016 (same as 7), 2017 (same as 8), 2018 (same as 9), or 2019 (same as 10) to use the year-based naming.
    ecmaVersion: 6,
    // specify which type of script you're parsing ("script" or "module")
    sourceType: "script",
    // specify additional language features
    ecmaFeatures: {
        // enable JSX parsing
        jsx: false,
        // enable return in global scope
        globalReturn: false,
        // enable implied strict mode (if ecmaVersion >= 5)
        impliedStrict: false
    }
});
console.log(dump(ast));
