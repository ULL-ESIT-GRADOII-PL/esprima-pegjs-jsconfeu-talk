Escope (escope) is an ECMAScript scope analyzer extracted from the esmangle project.
escope finds lexical scopes in a source program, i.e. areas of that program where different occurrences of the same identifier refer to the same variable. With each scope the contained variables are collected, and each identifier reference in code is linked to its corresponding variable (if possible).

escope works on a syntax tree of the parsed source code which has to adhere to the Mozilla Parser API. E.g. esprima is a parser that produces such syntax trees.

The main interface is the [analyze](http://estools.github.io/escope/global.html#analyze) function.

* [API](http://estools.github.io/escope/)