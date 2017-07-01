/**
 *  Run Mocha Programatically
 */

var _ = require('lodash'),
    async = require('async'),
    Mocha = require('mocha'),

    chai = require('./private/patched-chai'),
    fsapi = require('./fsapi'),

    expect = chai.expect,
    Test = Mocha.Test;

require('colors');

module.exports = {
    _getRunner: function() {
        return new Mocha();
    },

    _getTestInstance: function(mochaInstance, name) {
        return Mocha.Suite.create(mochaInstance.suite, name);
    },

    _addTest: function(suiteInstance, name, files, debug) {
        suiteInstance.addTest(new Test(name, function(done) {
            async.map(files, fsapi.getLinesFromFile, function(err, results) {
                if (err) { return done(err); }

                if (!debug) {
                    expect(results[0]).to.eql(results[1]);
                    return done();
                }

                var result = _.transform(results[0], function(output, result) {
                    var key = _.startsWith(result, '~') ? 'debug' : 'output';

                    if (!output[key]) { output[key] = []; }

                    output[key].push(result);
                }, {});

                console.info(`    DEBUG output for ${name}`.blue.bold);
                console.info(`    ${(result.debug || []).join('\n    ').blue}`);
                expect(result.output).to.eql(results[1]);

                return done();
            });
        }));
    },

    _run: function(mochaInstance, cb) {
        return mochaInstance.run(cb);
    },

    runTests: function(args, cb) {
        var self = this,
            testRunner = self._getRunner(),
            testInstance = self._getTestInstance(testRunner, `***Tests for ${args.title}**\n`);

        async.waterfall([
            function(cb) {
                fsapi.getFilesByRegex(args.dir, /^(toutput|output).*$/, cb);
            },

            function(bundledFiles, cb) {
                for (var i = 0; i < bundledFiles.output.length; i++) {
                    self._addTest(testInstance, `Case: ${i + 1}`, [bundledFiles.toutput[i], bundledFiles.output[i]],
                        args.debug);
                }

                return self._run(testRunner, cb);
            }
        ], function(code) {
            if (code === 0) {
                return cb();
            }

            return cb(new Error(`${code} tests din't pass`));
        });
    }
};
