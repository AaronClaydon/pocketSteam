var SteamClient = require('./steamClient');
var clients = [];

module.exports = function (socket) {
    socket.on('resume', function (request) {
        clients.forEach(function(value) {
            if(value.username == request.username) { //obv needs to be more secure than this
                value.socket = socket;

                socket.emit('steamid', value.client.steamID);
                value.requestFriends();

                socket['steam'] = value;
            }
        });
    });

    socket.on('friend:message', function (request) {
        socket['steam'].client.sendMessage(request.steamid, request.message);
    });

    socket.on('login', function (request) {
        loginClient = new SteamClient(socket, request.username, request.password);

        socket['steam'] = loginClient;
        clients.push(loginClient);

        loginClient.connect();
    });
}
