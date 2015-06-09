# pocketSteam
A web based Steam chat client. Runs on NodeJS and provides a Web Client as well as an API for mobile clients

## Features
 * Steam login
 * Session resuming
    * You have X amount of time to resume connection before log out
 * Chat to your friends

## TODO
 * Push notifications for mobile app
 * Profile viewing
    * Bio
    * Steam level
    * Games owned
    * Friends
 * Trading
 * Steam guard support
    * Allow users to enter code
    * Save guard SHA hash

## Install
Requires NodeJS.

Run `npm install`

Create config.json file

```
{
    "port": 80 //Port the application will run on
}
```

Run `node app.js`
