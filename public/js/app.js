var pocketSteamApp = angular.module('pocketSteamApp', [
    'ngRoute',
    'btford.socket-io',

    'pocketSteamControllers'
]);

pocketSteamApp.factory('Steam', function (socketFactory) {
    var socket = socketFactory({prefix: 'steam:',});
    socket.forward('error');
    return socket;
});

pocketSteamApp.config(function($routeProvider, $locationProvider) {
    $routeProvider.
    when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeController'
    }).
    when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController'
    }).
    when('/app', {
        templateUrl: 'views/app.html',
        controller: 'AppController'
    }).
    otherwise({
        redirectTo: '/home'
    });

    $locationProvider.html5Mode(true);
});
