var fs = require('fs');

module.exports.current = {};
module.exports.init = function(filename) {
    module.exports.current = require(filename);

    fs.watch(filename, function() {
        module.exports.current = JSON.parse(fs.readFileSync(filename));
    });
}
