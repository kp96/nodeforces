/**
 * CLI Parser for test command
 */

var _ = require('lodash');

module.exports = function() {
    var args = arguments || {};

    if (!_.isString(args['0']) || !(/^\d{3}[A-Z]{1}$/).test(args['0'])) {
        console.error('Not a valid codeforces problem code [(roundnumber)(problemcode)] eg: 756A');
        process.exit(1);
    }
};
