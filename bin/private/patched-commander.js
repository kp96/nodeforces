/**
 * Monkey-patch commander. Taken directly from Sails.js
 */

var _ = require('lodash'),
    program = require('commander'),
    usage = program.Command.prototype.usage;

// Override the `usage` method to always strip out the `*` command,
// which we added so that `nodeforces someunknowncommand` will output
// the nodeforces help message instead of nothing.
program.Command.prototype.usage = program.usage = function() {
    program.commands = _.reject(program.commands, {
        _name: '*'
    });
    return usage.apply(this, Array.prototype.slice.call(arguments));
};

// Force commander to display version information.
program.Command.prototype.versionInformation = program.versionInformation = function() {
    program.emit('version');
};

module.exports = program;
