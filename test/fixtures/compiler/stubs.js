/**
 * Sinon stubs for compiler functions
 */

module.exports = {
    spawn: function(command, args, options) {
        return {
            stderr: {
                on: function(type, cb) {
                    return cb('');
                }
            },

            on: function(type, cb) {
                if (type === 'close') {
                    return cb(options.err ? 1 : 0);
                }
                return cb();
            }
        };
    },

    log: function() {
        return;
    }
};
