/**
 * CLI Parser for initialize command
 */

require('colors');

var async = require('async'),
    ora = require('ora');


module.exports = function() {
    var args = arguments || {},
        action = args['1']._name,
        loaderText = action === 'init' ? 'Parsing problem from codeforces' : 'Compiling and executing your code',
        spinner = ora(loaderText).start(),
        taskFn = require('../')[action];

    async.waterfall([
        // 1. Call action method
        function(cb) {
            return taskFn(args, cb);
        }

    ], function(err) {

        if (err) {
            spinner.fail(err.toString().red);
            return process.exit(1);
        }

        var successResponse = {
            init: `File Created at ${args.filePath}. Get ready to start coding`.green,
            test: 'Tests ran succesfully'
        };

        return spinner.succeed(successResponse[action]);
    });
};
