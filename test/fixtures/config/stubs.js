/**
 * Sinon stubs for config functions
 */

var _ = require('lodash');

module.exports = {
    spawn: function(command, args, options) {
        return {
            stderr: {
                on: function(type, cb) {
                    return cb('error compiling');
                }
            },

            on: function(type, cb) {
                if (type === 'close') {
                    return cb((_.includes(args, '-DDEBUG') || _.get(options, 'stdio.0') === 'err.txt') ? 1 : 0);
                }
                return cb();
            }
        };
    },

    log: function() {
        return;
    },

    openSync: function(fileName) {
        return fileName;
    }
};
