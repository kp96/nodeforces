/**
 * Tests for codeforces parser
 */

var _ = require('lodash'),
    expect = require('expect.js'),

    url = require('url'),
    nock = require('nock'),

    cfapi = require('../../lib/cfapi'),
    mappings = require('../fixtures/cf/mappings');


describe('.cfapi', function() {
    before(function(done) {
        _.forEach(mappings.problem, function(mapping) {
            // initialize nocks
            nock('http://codeforces.com')
                .persist()
                .get(mapping.path)
                .replyWithFile(mapping.statusCode, mapping.response);
        });

        return done();
    });

    after(function(done) {
        nock.restore();

        return done();
    });

    it('should correctly parse a valid problem statement', function(done) {
        cfapi.getProblem({
            url: url.resolve('http://codeforces.com', _.get(mappings, 'problem.valid.path'))
        }, function(err, io) {

            expect(err).to.not.be.ok();
            expect(io).to.be.ok();
            expect(io).to.be.an('object');
            expect(io).to.not.be.empty();

            return done();
        });
    });

    it('should throw an error if problem could not be found', function(done) {
        cfapi.getProblem({
            url: url.resolve('http://codeforces.com', _.get(mappings, 'problem.invalid.path'))
        }, function(err) {

            expect(err).to.be.ok();
            expect(err.message).to.equal('Could not parse codeforces problem. If you\'re sure it exits please ' +
                'raise an issue');

            return done();
        });
    });

    it('should throw an error if codeforces is down', function(done) {
        cfapi.getProblem({
            url: url.resolve('http://codeforces.com', _.get(mappings, 'problem.nonok.path'))
        }, function(err) {

            expect(err).to.be.ok();
            expect(err.message).to.equal(
                `Received ${_.get(mappings, 'problem.nonok.statusCode')} from codeforces. Please check codeforces.com`);

            return done();
        });
    });
});
