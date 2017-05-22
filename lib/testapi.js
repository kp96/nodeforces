/**
 *  Run Mocha Programatically
 */

var async = require('async'),
    Mocha = require('mocha'),

    chai = require('./private/patched-chai'),
    fsapi = require('./fsapi'),

    expect = chai.expect,
    Test = Mocha.Test;

module.exports = {
    _getRunner: function() {
        return new Mocha();
    },

    _getTestInstance: function(mochaInstance, name) {
        return Mocha.Suite.create(mochaInstance.suite, name);
    },

    _addTest: function(suiteInstance, name, files) {
        suiteInstance.addTest(new Test(name, function(done) {
            async.map(files, fsapi.getLinesFromFile, function(err, results) {
                if (err) { return done(err); }

                expect(results[0]).to.eql(results[1]);

                return done();
            });
        }));
    },

    _run: function(mochaInstance) {
        return mochaInstance.run();
    },

    runTests: function(problem, dir, cb) {
        var self = this,
            testRunner = self._getRunner(),
            testInstance = self._getTestInstance(testRunner, `***Tests for ${problem}**`);

        fsapi.getFilesByRegex(dir, /^(toutput|output).*$/, function(err, bundledFiles) {
            if (err) { return cb(err); }

            for (var i = 0; i < bundledFiles.output.length; i++) {
                self._addTest(testInstance, `Case: ${i + 1}`, [bundledFiles.toutput[i], bundledFiles.output[i]]);
            }

            return cb(null, self._run(testRunner));
        });
    }
};
