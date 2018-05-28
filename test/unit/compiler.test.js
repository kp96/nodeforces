/**
 * Tests for compiler
 */

var _ = require('lodash'),
    expect = require('expect.js'),
    sinon = require('sinon'),

    child_process = require('child_process'),
    path = require('path'),

    compiler = require('../../lib/compiler'),
    stubs = require('../fixtures/compiler/stubs'),

    sandbox = sinon.sandbox.create();

describe('.compiler', function() {
    var stub;

    beforeEach(function(done) {
        stub = sandbox.stub(child_process, 'spawn').callsFake(stubs.spawn);
        sandbox.stub(require('fs'), 'openSync').callsFake(stubs.openSync); // suppress console
        sandbox.stub(console, 'error').callsFake(_.noop); // suppress console

        return done();
    });

    afterEach(function(done) {
        sandbox.restore();

        return done();
    });

    describe('._compile', function() {
        it('should recognize .cpp files and compile them using g++', function(done) {
            compiler._compile(path.resolve('./test/fixtures/compiler/code'), 'test.cpp', function(err) {

                expect(err).to.not.be.ok();
                expect(stub.getCall(0).args[0]).to.be.equal('g++');
                expect(stub.getCall(0).args[1]).to.be.eql(['test.cpp']);

                return done();
            });
        });

        it('should recognize .java files and compile them using javac', function(done) {
            compiler._compile(path.resolve('./test/fixtures/compiler/code'), 'test.java', function(err) {

                expect(err).to.not.be.ok();
                expect(stub.getCall(0).args[0]).to.be.equal('javac');
                expect(stub.getCall(0).args[1]).to.be.eql(['test.java']);

                return done();
            });
        });

        it('should compile file with arguments if provided', function(done) {
            compiler._compile(path.resolve('./test/fixtures/compiler/code'), 'test.cpp', ['-std=c++11'], function(err) {

                expect(err).to.not.be.ok();
                expect(stub.getCall(0).args[0]).to.be.equal('g++');
                expect(stub.getCall(0).args[1]).to.be.eql(['-std=c++11', 'test.cpp']);

                return done();
            });
        });

        it('should throw error if compilation fails and must pipe child_process err to stderr', function(done) {
            compiler._compile(path.resolve('./test/fixtures/compiler/code'), 'test.cpp', ['-DDEBUG'], function(err) {

                expect(err).to.be.ok();
                expect(err.message).to.be.equal('Compilation Failed');
                expect(console.error.getCall(0).args[0]).to.be.equal('error compiling');

                return done();
            });
        });
    });

    describe('._run', function() {
        it('should recognize .cpp files and run them using apppropriate a files', function(done) {
            compiler._run({ dir: path.resolve('./test/fixtures/compiler/code'), fileName: 'test.cpp' },
                'in.txt', function(err) {

                    expect(err).to.not.be.ok();
                    expect(stub.getCall(0).args[0]).to.be.eql((/^win/).test(process.platform) ? 'a.exe' : './a.out');

                    return done();
                });
        });

        it('should recognize .java files and run them using java Main', function(done) {
            compiler._run({ dir: path.resolve('./test/fixtures/compiler/code'), fileName: 'test.java' },
                'in.txt', function(err) {

                    expect(err).to.not.be.ok();
                    expect(stub.getCall(0).args[0]).to.be.equal('java');
                    expect(stub.getCall(0).args[1]).to.be.eql(['Main']);

                    return done();
                });
        });

        it('should throw runtime error if run fails and must pipe child_process err to stderr', function(done) {
            compiler._run({ dir: path.resolve('./test/fixtures/compiler/code'), fileName: 'error.java' },
                'err.txt', function(err) {

                    expect(err).to.be.ok();
                    expect(err.message).to.match(/Run Failed. Exit Code \d+/);
                    expect(console.error.getCall(0).args[0]).to.be.equal('error compiling');

                    return done();
                });
        });
    });

    describe('._exec', function() {
        it('should recognize compile and run files without any errors', function(done) {
            compiler.exec({
                dir: path.resolve('./test/fixtures/compiler/code'),
                fileName: 'test.cpp',
                options: []
            }, 'in.txt', function(err) {

                expect(err).to.not.be.ok();

                return done();
            });
        });
    });
});
