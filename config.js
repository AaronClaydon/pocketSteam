var fs = require('fs');

module.exports.current = {};
module.exports.filename = '';

module.exports.init = function(filename) {
    module.exports.filename = filename;
    module.exports.current = require(filename);

    // fs.watch(filename, function() {
    //     module.exports.current = JSON.parse(fs.readFileSync(filename));
    // });
}

module.exports.save = function() {
    fs.writeFile(module.exports.filename, JSON.stringify(module.exports.current));
}
