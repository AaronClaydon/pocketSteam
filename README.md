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

## TODO
 * Push notifications for mobile app
 * Profile viewing
    * Bio
    * Steam level
    * Games owned
    * Friends
 * Trading
 * Settings reload
 * Console commands
    * View connected
    * Modify whitelist
    * Set offline
    * Send alerts
    * Disconnect users
    * Shutdown

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
