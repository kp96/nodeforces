/**
 *  Run Mocha Programatically
 */

var async = require('async'),
    expect = require('expect.js'),

    Mocha = require('mocha'),
    Test = Mocha.Test,

    fsapi = require('./fsapi');

module.exports = {
    getInstance: function() {
        return new Mocha();
    },

    getSuiteInstance: function(mochaInstance, name) {
        return Mocha.Suite.create(mochaInstance, name);
    },

    addTestToSuite: function(suiteInstance, name, files) {
        suiteInstance.addTest(new Test(name, function(done) {
            async.map(files, fsapi.getLinesFromFile, function(err, results) {
                if (err) { return done(err); }

                expect(results[0]).to.be.deep.equal(results[1]);

                return done();
            });
        }));
    },

    runInstance: function(mochaInstance) {
        return mochaInstance.run();
    }
};
