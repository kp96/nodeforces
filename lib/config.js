/**
 * Read, Validate and Return the config file
 */

var _ = require('lodash'),

    path = require('path'),

    fsapi = require('./fsapi'),

    homedir = require('os').homedir();

module.exports = {
    get: function(args, cb) {

        if (!_.isString(args['0']) || !(/^\d{3}[A-Z]{1}\.(cpp|java)$/).test(args['0'])) {
            return cb(new Error('Not a valid filename [(roundnumber)(problemcode).(cpp|java)] eg: 756A'));
        }

        fsapi.readJSONFile(path.join(homedir, '.cfrc'), function(err, configArgs) {

            args.ext = _.split(args['0'], '.')[1];

            var contestNumber = args['0'].substr(0, 3),
                problemAlpha = args['0'][3];

            args.title = _.split(args['0'], '.')[0];
            args.fileName = args['0'];
            args.dir = path.join(_.get(configArgs, 'src.dir', homedir), args.title);
            args.filePath = path.join(args.dir, args.fileName);
            args.fileHeaderPath = _.get(configArgs, 'src.fileHeaderPath', 'none');
            args.url = `http://codeforces.com/contest/${contestNumber}/problem/${problemAlpha}`;
            args.options = _.get(configArgs, 'compiler.options', []);
            args.debug = args[1] && (args[1].debug || false);
            args.timeout = args[1] && (args[1].timeout || 0);
            return cb(null, args);
        });
    }
};
