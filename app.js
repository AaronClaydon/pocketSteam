var pack = require('./package.json');
var steamClient = require('./steamClient');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var config = require('./config.json');
var winston = require('winston');
winston.add(winston.transports.File, { filename: 'log.txt' });

if(config.loggly != undefined) {
    var Loggly = require('winston-loggly').Loggly;
    winston.add(Loggly, config.loggly);
}

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var connectionManager = require('./socketConnection');

io.on('connection', connectionManager);

// setup middleware
//app.use(favicon(__dirname + '/public/favicon.png'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/info', function(req, res) {
    var info = {};
    info.version = pack.version;
    info.whitelist = (config.whitelist !== undefined);
    info.connected = Object.keys(steamClient.List).length;

    res.json(info);
});

app.all('/*', function(req, res) {
    res.sendFile('index.html', { root: __dirname });
});

winston.info('Server started', config);

server.listen(config.port);
