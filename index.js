/**
 * Main api that exposes init and test functions
 */
var async = require('async'),
    mkdirp = require('mkdirp'),

    fs = require('fs'),

    config = require('./lib/config'),
    cfapi = require('./lib/cfapi'),
    fsapi = require('./lib/fsapi'),
    testapi = require('./lib/testapi'),
    compiler = require('./lib/compiler');

module.exports = {
    init: function(args, cb) {
        config.get(args, function(err, args) {
            if (err) { return cb(err); }

            async.waterfall([
                // 1. Create problem dir
                function(cb) {
                    return mkdirp(args.dir, cb);
                },

                // 2. Get problem from codeforces
                function(data, cb) {
                    cfapi.getProblem({ url: args.url }, cb);
                },

                // 3. Create IO Files
                function(io, cb) {
                    return fsapi.createIOFiles(args.dir, io, cb);
                },

                // 4. Create codefile
                function(cb) {
                    return fsapi.createFileWithHeader(args.fileHeaderPath, args.filePath, cb);
                }
            ], cb);
        });
    },

    test: function(args, cb) {
        config.get(args, function(err, args) {
            if (err) { return cb(err); }

            async.waterfall([
                // 1. Check if file really exists
                function(cb) {
                    fs.stat(args.filePath, function(err, stats) {
                        if (err) { return cb(err); }

                        if (!stats.isFile()) {
                            return cb(new Error('File Cannot be found. Are you sure you did nodeforces init first?'));
                        }

                        // go ahead now
                        return cb();
                    });
                },

                // 2. Get inputs for the problem
                function(cb) {
                    return fsapi.getFilesByRegex(args.dir, /^(input).*$/, cb);
                },

                // 3. Compile and run the code with inputs
                function(files, cb) {
                    return compiler.exec(args, files.input, cb);
                },

                // 4. Hope everything ran fine and run the testapi
                function(results, cb) {
                    return testapi.runTests(args, cb);
                }
            ], cb);
        });
    }
};
