/**
 * CLI Parser for test command
 */

var _ = require('lodash'),
    async = require('async'),

    fs = require('fs'),

    ora = require('ora'),
    config = require('../lib/config'),
    api = require('../');

require('colors');

module.exports = function() {
    var args = arguments || {},
        spinner = ora('Compiling and executing your code').start();

    async.waterfall([
        // 1. Get config
        async.apply(config.get, args),

        // 2. Check if file really exists :O
        function(args, cb) {
            fs.stat(args.filePath, function(err, stats) {
                if (err) { return cb(err); }

                if (!stats.isFile()) {
                    return cb(new Error('File Cannot be found. Are you sure you did nodeforces init first?'));
                }

                // go ahead now
                return cb();
            });
        },

        // 3. Call test method of api
        function(cb) {
            return api.test(_.pick(args, ['title', 'fileName', 'filePath', 'dir', 'options']), cb);
        }
    ], function(err) {
        spinner.stop();

        if (err) {
            console.error(err.toString().red);
            return process.exit(1);
        }

        return console.info('\t\tReporting Basic Test Results.\n\t' +
            'However there are still pretests and finaltests that we cant see :)\n'.green);
    });
};
