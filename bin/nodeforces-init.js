/**
 * CLI Parser for initialize command
 */

require('colors');

var _ = require('lodash'),
    async = require('async'),
    mkdirp = require('mkdirp'),

    ora = require('ora'),

    config = require('../lib/config'),
    api = require('../');


module.exports = function() {
    var args = arguments || {},
        spinner = ora('Parsing problem from codeforces').start();

    async.waterfall([
        // 1. Get args
        async.apply(config.get, args),

        // 2. Create problem dir
        function(args, cb) {
            return mkdirp(args.dir, cb);
        },

        // 3. Call init method of api
        function(made, cb) {
            return api.init(_.pick(args, ['filePath', 'fileHeaderPath', 'url', 'dir']), cb);
        }
    ], function(err) {

        if (err) {
            spinner.fail(err.toString().red);
            return process.exit(1);
        }

        return spinner.succeed(`File Created at ${args.filePath}. Get ready to start coding`.green);
    });
};
