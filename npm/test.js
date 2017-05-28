#!/usr/bin/env node
require('shelljs/global');
require('colors');

var prettyms = require('pretty-ms'),
    startedAt = Date.now();

require('async').series([
    require('./test-lint'),
    require('./test-system'),
    require('./test-unit'),
    require('./test-integration')
], function (code) {
    console.info(`\nnodeforces: duration ${prettyms(Date.now() - startedAt)}\ntests: ${code ? 'not ok' : 'ok'}!`[code ?
        'red' : 'green']);
    exit(code && (typeof code === 'number' ? code : 1) || 0);
});
