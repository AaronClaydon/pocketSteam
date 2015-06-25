var readline = require('readline');
var steamClient = require('./steamClient');
var config = require('./config');
var pack = require('./package.json');
var Table = require('cli-table');
var winston = require('winston');

module.exports.start = function() {
    var read = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    read.on('line', function (input) {
        var parts = input.split(' ');
        var cmd = parts[0];

        if(cmd === 'config') {
            console.log(config.current);
        } else if(cmd === 'version') {
            console.log('Version ' + pack.version)
        } else if(cmd === 'connected') {
            connected();
        } else if(cmd === 'quit') {
            quit();
        } else if(cmd === 'setstate') {
            setState(parts);
        } else {
            console.log("Unknown command: " + cmd)
        }
    });
}

function connected() {
    /* col widths */
    var table = new Table({
        head: ['Username', 'Platform', 'Timeout', 'Time connected'], colWidths: [35, 10, 12, 17]
    });

    for (var key in steamClient.List) {
        var client = steamClient.List[key];

        table.push([client.username, client.settings.platform, (client.settings.persistent ?  'false' : client.settings.timeout), '--']);
    }

    console.log(table.toString());
}

function quit() {
    winston.info('Server shutting down');
    process.exit();
}

function setState(parts) {
    if(parts[1] === 'online') {
        winston.info('Server state', {'online': true});

        delete config.current.offlineMessage;
        config.save();
    } else if (parts[1] === 'offline') {
        parts.splice(0, 2);
        message = parts.join(' ');

        config.current.offlineMessage = message;
        config.save();
        winston.info('Server state', {'online':false, 'message': message});
    } else {
        console.log('Unknown state');
    }
}
