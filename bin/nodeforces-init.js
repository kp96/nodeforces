/**
 * CLI Parser for initialize command
 */

var _ = require('lodash'),

    config = require('../lib/config');

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

        configArgs;
        // fallback to commandline args
        if (args['1'] && args['1'].ext && !_.includes(['cpp', 'py', 'java'], args['1'].ext)) {
            console.error('Not a valid extension. Use -e flag with one of (cpp|py|java)');
            process.exit(1);
        }

        // var fileName = `${args['0']}.${args['1'].ext || configArgs.src.fileExt}`;
    });
};
