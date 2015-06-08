var steamClient = require('./steamClient');
var SteamClient = steamClient.Client;
var uuid = require('uuid');

module.exports = function (socket) {
    socket.on('resume', function (request) {
        var value = steamClient.List[request.token];

        if(value == undefined) {
            socket.emit('resume:failed');
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
        var token = uuid.v4();
        loginClient = new SteamClient(socket, token, request.username, request.password);

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
