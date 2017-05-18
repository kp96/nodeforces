/**
 * Read, Validate and Return the config file
 */

var _ = require('lodash'),

    path = require('path'),

    fsapi = require('./fsapi'),

    homedir = require('os').homedir();

module.exports = {
    get: function(cb) {
        fsapi.readJSONFile(path.join(homedir, '.cfrc'), function(err, config) {

            if (_.isEmpty(config)) { return cb(null, {}); }

            if (!config.src || !_.includes(['cpp', 'java', 'py'], config.src.fileExt)) {
                return cb(new Error('Invalid file extension. Only cpp, java and py are supported'));
            }

            return cb(null, config);
        });
    }
};
