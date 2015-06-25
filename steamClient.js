var Steam = require('steam');
var fs = require('fs');
var winston = require('winston');

function SteamClient(socket, token, username, password, steamGuard, settings) {
    this.socket = socket;
    this.token = token;
    this.username = username;
    this.password = password;
    this.steamGuard = steamGuard;
    this.settings = parseSettings(settings);
    this.client = new Steam.SteamClient();

    this.friends = {};
}

function parseSettings(userSettings) {
    var settings = {};
    var defaults = {"persistent": false, "timeout": 10000, "platform": "web", "pushToken": ""};

    for (var key in defaults) {
        var val = userSettings[key] || defaults[key];

        settings[key] = val;
    }

    return settings;
}

function generateAvatarURL(hashBuffer) {
    var hash = hashBuffer.toString('hex');
    return "http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/" + hash.substr(0, 2) + "/" + hash + "_full.jpg";
}

SteamClient.prototype.connect = function() {
    var tfa = false; //2fa auth

    if(this.steamGuard === undefined || this.steamGuard === '') {
        tfa = fs.existsSync('sentry/' + this.username);

        this.client.logOn({
    		accountName: this.username,
    		password: this.password,
            shaSentryfile: (tfa ? fs.readFileSync('sentry/' + this.username) : undefined)
    	});
    } else {
        this.client.logOn({
    		accountName: this.username,
    		password: this.password,
            authCode: this.steamGuard
    	});

        tfa = true;
    }

    //Steam client handling
    this.client.on('loggedOn', (function() {
        this.socket.emit('login:success', this.token);
        winston.info('Login success', {username: this.username, steamguard: tfa, settings: this.settings})

    	this.client.setPersonaState(Steam.EPersonaState.Online);
    }).bind(this));

    this.client.on('user', (function(friend) {
        if(this.socket === undefined) {
            return;
        }

        friend.avatarURL = generateAvatarURL(friend.avatarHash);

        if(this.client.steamID === friend.friendid) {
            this.socket.emit('me', friend);
        } else {
            this.socket.emit('friend', friend);
        }

        this.friends[friend.friendid] = friend;

    }).bind(this));

    this.client.on('friendMsg', (function(steamid, message, type) {
        if(this.socket !== undefined) {
            this.socket.emit('friendMessage', {steamid: steamid, type: type, message: message});
        }
    }).bind(this));

    this.client.on('error', (function(e) {
    	var errorReason = 'unknown error code: ' + e.eresult;
        var steamGuard = false;

    	if(e.eresult === Steam.EResult.InvalidPassword) {
    		errorReason = 'Invalid username and/or password';
    	} else if(e.eresult === Steam.EResult.AlreadyLoggedInElsewhere) {
    		errorReason = 'Already logged in elsewhere';
        } else if(e.eresult === Steam.EResult.AccountLogonDenied) {
            errorReason = 'Please enter your Steam Guard key';
            steamGuard = true;
        }

        this.socket.emit('login:failed', {message: errorReason, steamGuard: steamGuard});
        winston.info('Login failed', {username: this.username, reason: errorReason})

        delete module.exports.List[this.token];
    }).bind(this));

    this.client.on('sentry', (function(sentry) {
        var wstream = fs.createWriteStream('sentry/' + this.username);
        wstream.write(sentry);
        wstream.end();

        winston.info('Sentry file saved', {username: this.username})
    }).bind(this));
};

SteamClient.prototype.requestFriends = function() {
    for(var id in this.friends) {
        var friend = this.friends[id];

        if(this.client.steamID === friend.friendid) {
            this.socket.emit('me', friend);
        } else {
            this.socket.emit('friend', friend);
        }
    }
}

SteamClient.prototype.logout = function() {
    this.client.logOff();
    delete module.exports.List[this.token];
}

SteamClient.prototype.timeOut = function() {
    this.socket = undefined;

    if(!this.settings['persistent']) {
        //check if they've reconnected
        setTimeout((function() {
            if(module.exports.List[this.token] === undefined) {
                return;
            }

            if(module.exports.List[this.token].socket === undefined) {
                this.logout();
            }
        }).bind(this), this.settings['timeout']);
    }
}

module.exports.Client = SteamClient;
module.exports.List = {};
