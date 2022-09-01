const myApp = angular.module('messagePost', ['ngRoute']);

myApp.config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'views/login.html',
      })
      .when('/register', {
        templateUrl: 'views/register.html',
      })
      .otherwise({
        redirectTo: '/login',
      });
  },
]);
