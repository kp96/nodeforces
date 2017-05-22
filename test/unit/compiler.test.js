/**
 * Tests for compiler
 */

var _ = require('lodash'),
    expect = require('expect.js'),
    sinon = require('sinon'),

    child_process = require('child_process'),
    path = require('path'),

    compiler = require('../../lib/compiler'),
    stubs = require('../fixtures/compiler/stubs');

describe('.compiler', function() {
    var stub;

    beforeEach(function(done) {
        stub = sinon.stub(child_process, 'spawn').callsFake(stubs.spawn);
        sinon.stub(console, 'error').callsFake(_.noop); // suppress console

        return done();
    });

    afterEach(function(done) {
        stub.restore();
        console.error.restore();

        return done();
    });

    describe('._compile', function() {
        it('should recognize .cpp files and compile them using g++', function(done) {
            compiler._compile(path.resolve('./test/fixtures/compiler/code'), 'test.cpp', function(err) {

                expect(err).to.not.be.ok();
                expect(stub.getCall(0).args[0]).to.be.equal('g++');

                return done();
            });
        });

        it('should recognize .java files and compile them using javac', function(done) {
            compiler._compile(path.resolve('./test/fixtures/compiler/code'), 'test.java', function(err) {

                expect(err).to.not.be.ok();
                expect(stub.getCall(0).args[0]).to.be.equal('javac');

                return done();
            });
        });
    });
});
