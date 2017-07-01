/**
 * Tests for codeforces parser
 */

var expect = require('expect.js'),

    path = require('path'),

    rewire = require('rewire'),
    fsapi = require('../../lib/fsapi'),

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
        config.get({ '0': '765A.cpp' }, function(err, args) {

            var homedir = require('os').homedir();

            expect(err).to.not.be.ok();
            expect(args).to.have.property('ext');
            expect(args).to.have.property('title');
            expect(args).to.have.property('fileName');
            expect(args).to.have.property('dir');
            expect(args).to.have.property('filePath');
            expect(args).to.have.property('fileHeaderPath');
            expect(args).to.have.property('url');
            expect(args).to.have.property('options');
            expect(args).to.have.property('timeout');
            expect(args).to.have.property('debug');

            expect(args.ext).to.equal('cpp');
            expect(args.title).to.equal('765A');
            expect(args.fileName).to.equal('765A.cpp');
            expect(args.dir).to.equal(path.join(homedir, '765A'));
            expect(args.filePath).to.equal(path.join(homedir, '765A', '765A.cpp'));
            expect(args.filePath).to.equal(path.join(homedir, '765A', '765A.cpp'));
            expect(args.fileHeaderPath).to.equal('none');
            expect(args.url).to.equal('http://codeforces.com/contest/765/problem/A');
            expect(args.options).to.eql([]);

            return done();
        });
    });

    it('should parse arguments if .cfrc is found', function(done) {
        config.__set__('homedir', path.resolve('./test/fixtures/config')); // mock homedir

        config.get({ '0': '765A.cpp' }, function(err, args) {
            expect(err).to.not.be.ok();
            expect(args).to.be.ok();
            expect(args).to.have.property('ext');
            expect(args).to.have.property('title');
            expect(args).to.have.property('fileName');
            expect(args).to.have.property('dir');
            expect(args).to.have.property('filePath');
            expect(args).to.have.property('fileHeaderPath');
            expect(args).to.have.property('url');
            expect(args).to.have.property('options');
            expect(args).to.have.property('timeout');
            expect(args).to.have.property('debug');

            expect(args.ext).to.equal('cpp');
            expect(args.title).to.equal('765A');
            expect(args.fileName).to.equal('765A.cpp');

            fsapi.readJSONFile(path.resolve('./test/fixtures/config/.cfrc'), function(err, data) {
                if (err) { return done(err); }

                expect(args.dir).to.equal(path.join(data.src.dir, '765A'));
                expect(args.filePath).to.equal(path.join(data.src.dir, '765A', '765A.cpp'));
                expect(args.fileHeaderPath).to.equal(data.src.fileHeaderPath);
                expect(args.url).to.equal('http://codeforces.com/contest/765/problem/A');
                expect(args.options).to.eql(data.compiler.options);

                return done();
            });
        });
    });
});
