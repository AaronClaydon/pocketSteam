var controllers = angular.module('pocketSteamControllers', []);

controllers.controller('HomeController', function($scope, $rootScope) {
    $rootScope.title = 'Home';
});

controllers.controller('FAQController', function($scope, $rootScope) {
    $rootScope.title = 'FAQ';
});

controllers.controller('LoginController', function($scope, $rootScope, $location, Steam) {
    $scope.username = '';
    $scope.password = '';
    $scope.steamGuard = '';

    $scope.login = function() {
        $scope.error = "";
        Steam.emit('login', {username: $scope.username, password: $scope.password, steamGuard: $scope.steamGuard, settings: {"persistent": false, "timeout": 10000, "platform": "web"}}); //production
        //Steam.emit('login', {username: $scope.username, password: $scope.password, steamGuard: $scope.steamGuard, settings: {"persistent": true, "timeout": 10000, "platform": "web"}}); //testing
        return false;
    };

    Steam.on('login:success', function(data) {
        localStorage.setItem('token', data);
        $location.path('/app');
    });
    Steam.on('login:failed', function(data) {
        console.log("failed", data);
        $scope.error = data.message;
        $scope.steamguardReq = data.steamGuard;
    });

    $rootScope.title = 'Login';
});

controllers.controller('AppController', function($scope, $rootScope, $location, Steam) {
    function scrollMessagesToBottom() {
        var $target = $('.messages');
        $target.animate({scrollTop: $target.height()}, 600);
    }

    setTimeout(function() {
        Steam.emit('resume', {token: localStorage.getItem('token')}); //production
        //Steam.emit('resume', {token: '454195e2-bb0d-487b-867a-a2373b276313'}); //testing
    }, 500);

    $rootScope.title = 'USERNAME';

    $scope.steamid = "";
    $scope.friends = {};
    $scope.user = {};
    $scope.messages = [];
    $scope.currentFriend = "";

    //test data
    // $scope.currentFriend = 1;
    // $scope.user = {playerName: "AmazingAzzy", gamePlayedAppId: 0, personaState: 1, avatarURL: "http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/f0/f0bf2e17b6c1221bda42328df1c5bcecdbc95be9_full.jpg"};
    // $scope.friends = {
    //     1: {friendid: 1, playerName: "Test One", gamePlayedAppId: 0, personaState: 1, avatarURL: "http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/f0/f0bf2e17b6c1221bda42328df1c5bcecdbc95be9_full.jpg"},
    //     2: {friendid: 2, playerName: "Test Two", gamePlayedAppId: 0, personaState: 1, avatarURL: "http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/f0/f0bf2e17b6c1221bda42328df1c5bcecdbc95be9_full.jpg"},
    //     3: {friendid: 3, playerName: "Test Three", gamePlayedAppId: 0, personaState: 1, avatarURL: "http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/f0/f0bf2e17b6c1221bda42328df1c5bcecdbc95be9_full.jpg"},
    //     4: {friendid: 4, playerName: "Test Four", gamePlayedAppId: 0, personaState: 1, avatarURL: "http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/f0/f0bf2e17b6c1221bda42328df1c5bcecdbc95be9_full.jpg"}
    //     }

    $scope.formatStatus = function(user) {
        if(user === undefined) {
            return;
        }

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

        if(user.gamePlayedAppId !== 0) {
            status = user.gameName;
        }

        return status;
    }

    $scope.selectFriend = function(friend) {
        $scope.currentFriend = friend.friendid;
        $("#nav-trigger").prop( "checked", false );

        $scope.friends[$scope.currentFriend].unread = 0;
    }

    $scope.sendMessage = function() {
        $scope.messages[$scope.currentFriend].push({message: $scope.newMessage, sender: true});
        Steam.emit('friend:message', {steamid: $scope.currentFriend, message: $scope.newMessage});

        $scope.newMessage = "";
        scrollMessagesToBottom();
        return false;
    }

    $scope.logout = function() {
        Steam.emit('logout');
        $location.path('/login');
    }

    $scope.viewProfile = function(id) {
        Steam.emit('friend:profile', {friend: id});
    }

    Steam.on('resume:failed', function() {
        $location.path('/login');
    });

    Steam.on('friend', function(friend) {
        console.log('friend', friend);

        if($scope.friends[friend.friendid] === undefined) {
            friend.unread = 0;
        } else {
            friend.unread = $scope.friends[friend.friendid].unread;
        }

        $scope.friends[friend.friendid] = friend;

        if($scope.messages[friend.friendid] === undefined) {
            $scope.messages[friend.friendid] = [];
        }
    });
    Steam.on('me', function(friend) {
        console.log('me', friend);

        $scope.user = friend;

        $rootScope.title = $scope.user.playerName;
    });

    Steam.on('friend:profile', function(data) {
        console.log(data);
    });

    Steam.on('friendMessage', function(data) {
        console.log('msg', data);

        if(data.type === 1) {
            data.sender = false;
            $scope.messages[data.steamid].push(data);

            if($scope.currentFriend !== data.steamid) {
                $scope.friends[data.steamid].unread++;
            }

            scrollMessagesToBottom();
        }
    });
});
