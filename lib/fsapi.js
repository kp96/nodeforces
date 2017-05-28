/**
 * Bunch of filesystem plus shell utilities
 */

var _ = require('lodash'),
    async = require('async'),

    fs = require('fs'),
    path = require('path');

module.exports = {
    readJSONFile: function(fileName, cb) {
        fs.readFile(fileName, 'utf8', function(err, data) {
            if (err) { return cb({}); }

            var jsonData;

            try {
                jsonData = JSON.parse(data);
            }
            catch (e) {
                jsonData = {};
            }

            return cb(null, jsonData);
        });
    },

    createFileWithHeader: function(fileHeaderPath, filePath, cb) {
        async.waterfall([
            // 1. Try to read file header
            function(cb) {
                fs.readFile(fileHeaderPath, 'utf8', function(err, data) {
                    err && (data = '');

                    return cb(null, data);
                });
            },

            // 2. Create the File
            function(data, cb) {
                return fs.writeFile(filePath, data, cb);
            }
        ], function(err) {
            if (err) { return cb(err); }

            return cb();
        });
    },

    createIOFiles: function(dir, io, cb) {
        var self = this,
            files = self._parseIOFiles(io);

        async.map(files, function(file, cb) {
            return fs.writeFile(path.join(dir, file.name), file.data, cb);
        }, function(err) {
            if (err) { return cb(err); }

            return cb();
        });
    },

    _parseIOFiles: function(io) {
        return _.transform(io, function(result, vals, type) {
            for (var i = 0; i < vals.length; i++) {
                result.push({ name: type + i + '.txt', data: vals[i] });
            }
        }, []);
    },

    getLinesFromFile: function(fileName, cb) {
        var isWin = (/^win/).test(process.platform);

        fs.readFile(fileName, 'utf8', function(err, data) {
            if (err) { return cb(null, []); }

            return cb(null, _.compact(_.split(data, isWin ? '\r\n' : '\n')));
        });
    },

    /**
     * getFilesByRegex - Returns set of files grouped by capturing group of the regex
     *
     * @param  {string} dir   the dir name
     * @param  {Object} regex the regex object
     * @param  {Function} cb    The function that marks end of getFilesByRegex function
     * @return {*}
     */
    getFilesByRegex: function(dir, regex, cb) {
        fs.readdir(dir, function(err, files) {
            if (err) { return cb(err); }

            files.sort(); // unsorted may not work in windows

            return cb(null, _.transform(files, function(result, file) {
                var grp = _.get(regex.exec(file), '1');

                grp && (result[grp] || (result[grp] = []));
                grp && (result[grp].push(path.join(dir, file)));
            }, {}));
        });
    },

    copyFile: function(source, target, cb) {
        var cbCalled = false,
            rd = fs.createReadStream(source),
            wr = fs.createWriteStream(target),
            done = function(err) {
                if (!cbCalled) {
                    cb(err);
                    cbCalled = true;
                }
            };

        rd.on('error', function(err) {
            done(err);
        });

        wr.on('error', function(err) {
            done(err);
        });

        wr.on('close', function() {
            done();
        });

        rd.pipe(wr);
    }
};
