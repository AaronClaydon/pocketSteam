var steamClient = require('./steamClient');
var SteamClient = steamClient.Client;
var uuid = require('uuid');
var config = require('./config');

module.exports = function (socket) {
    //tell them straight away that we're offline
    if(config.current.offlineMessage !== undefined) {
        socket.emit('login:failed', {message: config.current.offlineMessage, steamGuard: false});
        return;
    }

    socket.on('resume', function (request) {
        var value = steamClient.List[request.token];

        if(value === undefined) {
            socket.emit('resume:failed');
            return;
        }
        if(config.current.offlineMessage !== undefined) {
            socket.emit('login:failed', {message: config.current.offlineMessage, steamGuard: false});
            return;
        }

        value.socket = socket;
        value.requestFriends();

        socket['steam'] = value;
    });

    socket.on('friend:message', function (request) {
        if(socket['steam'] === undefined) {
            return;
        }

        socket['steam'].client.sendMessage(request.steamid, request.message);
    });

    socket.on('login', function (request) {
        if(request.username === undefined || request.password === undefined || request.username === '' || request.password === '') {
            socket.emit('login:failed', {message: 'Please fill in all fields', steamGuard: false});
            return;
        }

        if(config.current.offlineMessage !== undefined) {
            socket.emit('login:failed', {message: config.current.offlineMessage, steamGuard: false});
            return;
        }

        if(config.current.whitelist !== undefined) { //whitelist is enabled
            if(config.current.whitelist.indexOf(request.username) === -1) {
                socket.emit('login:failed', {message: 'Your account is not whitelisted', steamGuard: false});
                return;
            }
        }

        var token = uuid.v4();
        var loginClient = new SteamClient(socket, token, request.username, request.password, request.steamGuard, request.settings);

        socket['steam'] = loginClient;
        steamClient.List[token] = loginClient;

        loginClient.connect();
    });

    socket.on('logout', function () {
        if(socket['steam'] === undefined) {
            return;
        }

        socket['steam'].logout();
    });

    socket.on('disconnect', function () {
        if(socket['steam'] === undefined) {
            return;
        }

        socket['steam'].timeOut();
    });
}
