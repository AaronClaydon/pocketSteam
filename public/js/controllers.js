var controllers = angular.module('pocketSteamControllers', []);

controllers.controller('HomeController', function($scope, $rootScope) {
    $rootScope.title = 'Home';
});

controllers.controller('LoginController', function($scope, $rootScope, $location, Steam) {
    $scope.username = 'azzytest';
    $scope.password = 'password';

    $scope.login = function() {
        $scope.error = "";
        Steam.emit('login', {username: $scope.username, password: $scope.password});
        return false;
    };

    Steam.on('login:success', function(data) {
        $location.path('/app');
    });
    Steam.on('login:failed', function(data) {
        console.log("failed", data);
        $scope.error = data.message;
    });

    $rootScope.title = 'Login';
});

controllers.controller('AppController', function($scope, $rootScope, Steam) {
    function scrollMessagesToBottom() {
        var $target = $('.messages');
        $target.animate({scrollTop: $target.height()}, 600);
    }

    $rootScope.title = 'USERNAME';

    $scope.steamid = "";
    $scope.friends = {};
    $scope.user = {};
    $scope.messages = [];
    $scope.currentFriend = "";

    //test data
    $scope.currentFriend = 1;
    $scope.user = {playerName: "AmazingAzzy", gamePlayedAppId: 0, personaState: 1, avatarURL: "http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/f0/f0bf2e17b6c1221bda42328df1c5bcecdbc95be9_full.jpg"};
    $scope.friends = {
        1: {friendid: 1, playerName: "Test One", gamePlayedAppId: 0, personaState: 1, avatarURL: "http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/f0/f0bf2e17b6c1221bda42328df1c5bcecdbc95be9_full.jpg"},
        2: {friendid: 2, playerName: "Test Two", gamePlayedAppId: 0, personaState: 1, avatarURL: "http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/f0/f0bf2e17b6c1221bda42328df1c5bcecdbc95be9_full.jpg"},
        3: {friendid: 3, playerName: "Test Three", gamePlayedAppId: 0, personaState: 1, avatarURL: "http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/f0/f0bf2e17b6c1221bda42328df1c5bcecdbc95be9_full.jpg"},
        4: {friendid: 4, playerName: "Test Four", gamePlayedAppId: 0, personaState: 1, avatarURL: "http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/f0/f0bf2e17b6c1221bda42328df1c5bcecdbc95be9_full.jpg"}
        }

    $scope.formatStatus = function(user) {
        if(user == undefined)
            return;

        var status = "Unknown";

        switch (user.personaState) {
            case 0:
                status = "Offline";
                break;
            case 1:
                status = "Online";
                break;
            case 2:
                status = "Busy";
                break;
            case 3:
                status = "Away";
                break;
            case 4:
                status = "Snooze";
                break;
            case 5:
                status = "Looking to Trade";
                break;
            case 6:
                status = "Looking to Play";
                break;
        }

        if(user.gamePlayedAppId != 0) {
            status = user.gameName;
        }

        return status;
    }

    $scope.resume = function() {
        Steam.emit('resume', {username: 'azzytest'});
    }

    $scope.selectFriend = function(friend) {
        $scope.currentFriend = friend.friendid;
        $("#nav-trigger").prop( "checked", false );

        console.log($scope.currentFriend);
    }

    $scope.sendMessage = function() {
        $scope.messages[$scope.currentFriend].push({message: $scope.newMessage, sender: true});
        Steam.emit('friend:message', {steamid: $scope.currentFriend, message: $scope.newMessage});

        $scope.newMessage = "";
        scrollMessagesToBottom();
        return false;
    }

    Steam.on('steamid', function(data) {
        console.log('steamid', data);
        $scope.steamid = data;
    });

    Steam.on('friend', function(friend) {
        console.log('friend', friend);

        $scope.friends[friend.friendid] = friend;
        if($scope.messages[friend.friendid] == undefined) {
            $scope.messages[friend.friendid] = [];
        }
    });
    Steam.on('me', function(friend) {
        console.log('me', friend);

        $scope.user = friend;

        $rootScope.title = $scope.user.playerName;
    });

    Steam.on('friendMessage', function(data) {
        console.log('msg', data);

        if(data.type == 1) {
            data.sender = false;
            $scope.messages[data.steamid].push(data);

            console.log($scope.messages);

            scrollMessagesToBottom();
        }
    });
});
