/**
 * Tests for codeforces parser
 */

var _ = require('lodash'),
    expect = require('expect.js'),

    path = require('path'),
    os = require('os'),

    sinon = require('sinon'),
    rewire = require('rewire'),
    sandbox = sinon.sandbox.create(),

    config = rewire('../../lib/config');

describe('.config', function() {
    it('should throw an error if filename provided is invalid', function(done) {
        config.get({}, function(err) {

            expect(err).to.be.ok();
            expect(err.message).to.be.equal('Not a valid filename [(roundnumber)(problemcode).(cpp|java)] eg: 756A');

            return done();
        });
    });

    it('should stick to default args if .cfrc is not found', function(done) {
        config.get({ '0': '765A.cpp' }, function(err) {

            expect(err).to.not.be.ok();

            return done();
        });
    });

    it('should parse arguments if .cfrc is found', function(done) {
        before(function(done) {
            config.__set__('homedir', path.resolve('./fixtures/config/.vcfrc'));

            return done();
        });

        config.get({ '0': '765A.cpp' }, function(err, args) {

            console.log(args);
            expect(err).to.not.be.ok();
            return done();
        });
    });
});
