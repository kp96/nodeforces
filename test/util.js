/**
 * Some helpers for testing
 */

module.exports = {
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
