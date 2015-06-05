var controllers = angular.module('pocketSteamControllers', []);

controllers.controller('HomeController', function($scope, $rootScope) {
    $rootScope.title = 'Home';
});

controllers.controller('LoginController', function($scope, $rootScope, Steam) {
    $rootScope.title = 'Login';
    Steam.emit('my other event', 'twat');
});

controllers.controller('AppController', function($scope) {

});
