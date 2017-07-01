#!/usr/bin/env node
require('shelljs/global');
require('colors');


var _ = require('lodash'),
    async = require('async'),
    child_process = require('child_process'),
    path = require('path'),

    fsapi = require('../lib/fsapi'),
    mappings = require('../test/integration/mappings');


module.exports = function(exit) {

    /**
     * need to be refactored. use async
     */
    var runner = function(options, exit) {
        var fileName = options.fileName,
            filePath = options.filePath || path.resolve(require('os').homedir(), _.split(fileName, '.')[0], fileName),
            binPath = path.resolve('./bin/nodeforces'),
            init = child_process.spawn('node', _.flatten([binPath, 'init', fileName, options.options]),
                { timeout: 5000 });

        init.on('close', function(code) {
            if (code !== (options.ccode || 0)) {
                console.error(`Integration tests failed at nodeforces init ${fileName}`.red.bold);
                return exit(1);
            }
            fsapi.copyFile(path.resolve(`./test/integration/${fileName}`), filePath,
                function(err) {
                    if (err) {
                        console.error(`Integration tests failed due to ext error: ${err}`.red);
                        return exit(1);
                    }

                    var test = child_process.spawn('node', _.flatten([binPath, 'test', fileName, options.options]));

                    test.stderr.on('data', function(data) {
                        console.error(`${data}`);
                    });
                    test.on('close', function(code) {
                        if (code !== (options.rcode || 0)) {
                            console.error(`Integration Tests failed at nodeforces test ${fileName}. Code ${code}`
                                .red.bold);
                            return exit(1);
                        }

                        console.info(`Integration Tests For ${fileName}: [OK]`.green);

                        return exit(0);
                    });
                });
        });

        init.stderr.on('data', function(data) {
            console.error(`${data}`);
        });
    };

    console.info('\nRunning integration tests using nodeforces as a cli tool'.yellow.bold);

    return async.map(mappings.problems, runner, exit);
};


// ensure we run this script exports if this is a direct stdin.tty run
!module.parent && module.exports(exit);
