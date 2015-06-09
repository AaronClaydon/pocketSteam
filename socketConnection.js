var steamClient = require('./steamClient');
var SteamClient = steamClient.Client;
var uuid = require('uuid');
var config = require('./config.json');

module.exports = function (socket) {
    socket.on('resume', function (request) {
        var value = steamClient.List[request.token];

        if(value == undefined) {
            socket.emit('resume:failed');
            return;
        }

        value.socket = socket;
        value.requestFriends();

        socket['steam'] = value;
    });

    socket.on('friend:message', function (request) {
        if(socket['steam'] == undefined)
            return;

        socket['steam'].client.sendMessage(request.steamid, request.message);
    });

    socket.on('login', function (request) {
        if(config.whitelist != undefined) { //whitelist is enabled
            if(config.whitelist.indexOf(request.username) == -1) {
                socket.emit('login:failed', {message: 'Your account is not whitelisted', steamGuard: false});
                return;
            }
        }

        var token = uuid.v4();
        loginClient = new SteamClient(socket, token, request.username, request.password, request.settings);

        socket['steam'] = loginClient;
        steamClient.List[token] = loginClient;

        loginClient.connect();
    });

    socket.on('logout', function (request) {
        if(socket['steam'] == undefined)
            return;

        socket['steam'].logout();
    });

    socket.on('disconnect', function() {
        if(socket['steam'] == undefined)
            return;

        socket['steam'].timeOut();
    });
}
