const myApp = angular.module('messagePost', ['ngRoute']);

myApp.config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'loginController',
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'registrationController',
      })
      .when('/home', {
        templateUrl: 'views/home.html',
      })
      .otherwise({
        redirectTo: '/login',
      });
  },
]);

myApp.controller('loginController', [
  '$scope',
  '$http',
  '$location',
  function ($scope, $http, $location) {
    $scope.isUserLoggedIn = false;

    $http
      .get('http://localhost:9000/login')
      .then((res) => {
        if (res.status === 200) {
          $location.path('home');
        }
      })
      .catch((err) => {
        $scope.isUserLoggedIn = true;
        console.log('Printing error', err);
      });

    $scope.submitLoginForm = () => {
      console.log('Inside the submit form function');

      const config = {
        method: 'POST',
        url: 'http://localhost:9000/login',
        data: JSON.stringify($scope.user),
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      };

      $http(config)
        .then((res) => {
          if (res.status === 200) {
            $location.path('home');
          }
        })
        .catch((err) => console.log(err));
    };
  },
]);

myApp.controller('registrationController', [
  '$scope',
  '$http',
  '$location',
  function ($scope, $http, $location) {
    $scope.submitRegistrationForm = () => {
      console.log('Inside register form submit', $scope.user);

      const config = {
        method: 'POST',
        url: 'http://localhost:9000/register',
        data: JSON.stringify($scope.user),
        headers: {
          'Content-Type': 'application/json',
        },
      };

      $http(config)
        .then((res) => {
          if (res.status === 201) {
            $location.path('home');
          }
        })
        .catch((err) => {
          $scope.errMsg = err.statusText;
          console.log(err);
        });
    };
  },
]);
