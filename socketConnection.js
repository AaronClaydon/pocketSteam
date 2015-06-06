var SteamClient = require('./steamClient');
var clients = [];

module.exports = function (socket) {
    socket.on('resume', function (request) {
        clients.forEach(function(value) {
            if(value.username == request.username) { //obv needs to be more secure than this
                value.socket = socket;

                socket.emit('steamid', value.client.steamID);
                //socket.emit('friends', client.client.friends); //client.client :)
                //client.client.requestFriendData(["76561198008014218"]);
                value.requestFriends();
            }
        });
    });

    socket.on('login', function (request) {
        client = new SteamClient(socket, request.username, request.password);
        client.connect();
        clients.push(client);
    });
}
