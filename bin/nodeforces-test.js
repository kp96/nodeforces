/**
 * CLI Parser for test command
 */

var _ = require('lodash'),
    async = require('async'),

    fs = require('fs'),
    path = require('path'),

    config = require('../lib/config'),
    api = require('../'),

    homedir = require('os').homedir();

module.exports = function() {
    var args = arguments || {};

    if (!_.isString(args['0']) || !(/^\d{3}[A-Z]{1}$/).test(args['0'])) {
        console.error('Not a valid codeforces problem code [(roundnumber)(problemcode)] eg: 756A');
        return process.exit(1);
    }

    // check if config is provided
    config.get(function(err, configArgs) {
        if (err) {
            console.warn('Warn: Ignoring Config File:', err.message || err);
            configArgs = {};
        }

        // fallback to commandline args
        if (args['1'] && args['1'].ext && !_.includes(['cpp', 'java'], args['1'].ext)) {
            console.error('Not a valid extension. Use -e flag with one of (cpp|java)');
            process.exit(1);
        }

        args.title = args['0'];
        args.dir = path.join(_.get(configArgs, 'src.dir', homedir), args['0']);
        args.fileName = `${args['0']}.${args['1'].ext || configArgs.src.fileExt}`;
        args.filePath = path.join(args.dir, args.fileName);

        async.waterfall([
            // 1. Check if file really exists :O
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

            // 2. Call test method of api
            function(cb) {
                return api.test(_.pick(args, ['title', 'fileName', 'filePath', 'dir']), cb);
            }
        ], function(err) {
            if (err) {
                console.error(err.message || err);
                return process.exit(1);
            }

            return console.info('\t\tReporting Basic Test Results.\n\t' +
                'However there are still pretests and finaltests that we cant see :)\n');
        });
    });
};
