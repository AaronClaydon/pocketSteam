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
    $rootScope.title = 'USERNAME';

    $scope.steamid = "";
    $scope.friends = {};
    $scope.user = {};

    $scope.formatStatus = function(user) {
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

    Steam.on('steamid', function(data) {
        console.log('steamid', data);
        $scope.steamid = data;
    });

    Steam.on('friend', function(friend) {
        console.log('friend', friend);

        $scope.friends[friend.friendid] = friend;
    });
    Steam.on('me', function(friend) {
        console.log('me', friend);

        $scope.user = friend;

        $rootScope.title = $scope.user.playerName;
    });

    Steam.on('friendMessage', function(data) {
        console.log('msg', data);
    });
});
