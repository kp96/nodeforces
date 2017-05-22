/**
 * Main api that exposes init and test functions
 */
var async = require('async'),

    cfapi = require('./lib/cfapi'),
    fsapi = require('./lib/fsapi'),
    testapi = require('./lib/testapi'),

    compiler = require('./lib/compiler');

module.exports = {
    init: function(args, cb) {
        async.waterfall([
            // 1. Get problem from codeforces
            function(cb) {
                cfapi.getProblem({ url: args.url }, cb);
            },

            // 2. Create IO Files
            function(io, cb) {
                return fsapi.createIOFiles(args.dir, io, cb);
            },

            // 3. Create codefile
            function(cb) {
                return fsapi.createFileWithHeader(args.fileHeaderPath, args.filePath, cb);
            }
        ], cb);
    },

    test: function(args, cb) {
        async.waterfall([
            // 1. Get inputs for the problem
            function(cb) {
                return fsapi.getFilesByRegex(args.dir, /^(input).*$/, cb);
            },

            // 2. Compile and run the code with inputs
            function(files, cb) {
                return compiler.exec(args, files.input, cb);
            },

            // 3. Hope everything ran fine and run the testapi
            function(results, cb) {
                return testapi.runTests(args.title, args.dir, cb);
            }
        ], cb);
    }
};
