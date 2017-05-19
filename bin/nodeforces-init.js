/**
 * CLI Parser for initialize command
 */

var _ = require('lodash'),
    async = require('async'),
    mkdirp = require('mkdirp'),

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
        if (args['1'] && args['1'].ext && !_.includes(['cpp', 'py', 'java'], args['1'].ext)) {
            console.error('Not a valid extension. Use -e flag with one of (cpp|py|java)');
            process.exit(1);
        }

        var contestNumber = args['0'].substr(0, 3),
            problemAlpha = args['0'][3];

        args.url = `http://codeforces.com/contest/${contestNumber}/problem/${problemAlpha}`;

        args.dir = path.join(_.get(configArgs, 'src.dir', homedir), args['0']);
        args.filePath = path.join(args.dir, `${args['0']}.${args['1'].ext || configArgs.src.fileExt}`);
        args.fileHeaderPath = _.get(configArgs, 'src.fileHeaderPath', 'none');

        async.waterfall([
            // 1. Create problem dir
            async.apply(mkdirp, args.dir),

            // 2. Call init method of api
            function(made, cb) {
                return api.init(_.pick(args, ['filePath', 'fileHeaderPath', 'url', 'dir']), cb);
            }
        ], function(err) {
            if (err) {
                console.error(err.message || err);
                return process.exit(1);
            }

            return console.info(`File Created at ${args.filePath}. Get ready to start coding`);
        });
    });
};
