var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
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
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('index.html', { root: __dirname });
});

winston.info('Server started', config);

server.listen(config.port);
