# pocketSteam
A web based Steam chat client. Runs on NodeJS and provides a Web Client as well as an API for mobile clients

## Features
 * Steam login
 * Session resuming
    * You have X amount of time to resume connection before log out
 * Chat to your friends
 * Steam guard support
    * Allow users to enter code
    * Save guard SHA hash
 * Settings autoreload (not port - that requires app restart)

## TODO
 * Push notifications for mobile app
 * Profile viewing
    * Bio
    * Steam level
    * Games owned
    * Friends
 * Trading
 * Console commands
    * Modify whitelist
    * Send alerts
    * Disconnect users

## Install
Requires NodeJS.

Run `npm install`

Create config.json file - spec is below

Create `sentry` folder in app root

Run `node app.js`

## Config
`port` the port the web server runs on

`whitelist` *(optional)* array of usernames that are allowed to use it. If not set then anyone can login

`offlineMessage` *(optional)* if set then no new logins/session resumes are accepted and this error string is displayed

`loggly` *(optional)* authentication config for logging to loggly (passwords are **not** logged)

## Console commands

`config` display current config

`connected` display table of currently connected users

`version` display version

`setstate [state] [message]` changes online state to value [state] (TRUE/FALSE) and if false then offline message set to [message] (STRING)

`quit` stop the server
