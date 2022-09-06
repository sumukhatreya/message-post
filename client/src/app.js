const myApp = angular.module('messagePost', ['ngRoute']);

myApp.config([
  '$routeProvider',
  '$locationProvider',
  function ($routeProvider, $locationProvider) {
    // $locationProvider.html5Mode(true);
    $routeProvider
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'loginController',
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'registrationController',
      })
      .when('/posts', {
        templateUrl: 'views/posts.html',
        controller: 'postController',
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

    // const jwtToken = sessionStorage.getItem('jwt');

    const configGet = {
      method: 'GET',
      url: 'http://localhost:9000/login',
      headers: {
        jwt: sessionStorage.getItem('jwt'),
      },
    };

    $http(configGet)
      .then((res) => {
        console.log('Going home');
        $location.path('posts');
      })
      .catch((err) => {
        $scope.isUserLoggedIn = true;
        console.log('Printing error', err);
      });

    $scope.submitLoginForm = () => {
      console.log('Inside the submit form function');

      const configPost = {
        method: 'POST',
        url: 'http://localhost:9000/login',
        data: JSON.stringify($scope.user),
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      };

      $http(configPost)
        .then((res) => {
          if (res.status === 200) {
            sessionStorage.setItem('jwt', res.headers('jwt'));
            $location.path('posts');
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
            sessionStorage.setItem('jwt', res.headers('jwt'));
            $location.path('posts');
          }
        })
        .catch((err) => {
          $scope.errMsg = err.statusText;
          console.log(err);
        });
    };
  },
]);

myApp.controller('postController', [
  '$scope',
  '$http',
  '$location',
  function ($scope, $http, $location) {
    if (!sessionStorage.getItem('jwt')) {
      $location.path('login');
    }
    $scope.posts = [];

    const configGet = {
      method: 'GET',
      url: 'http://localhost:9000/posts',
      headers: {
        'Content-Type': 'application/json',
        jwt: sessionStorage.getItem('jwt'),
      },
    };

    $http(configGet)
      .then((res) => {
        console.log('Hello from the postController GET', res.data.posts);
        $scope.posts = res.data.posts.reverse();
      })
      .catch((err) => console.log(err));

    $scope.submitPostForm = () => {
      const config = {
        method: 'POST',
        url: 'http://localhost:9000/posts',
        data: JSON.stringify($scope.post),
        headers: {
          'Content-Type': 'application/json',
          jwt: sessionStorage.getItem('jwt'),
        },
      };
      $http(config)
        .then((res) => {
          console.log(res);
          $scope.posts.unshift(res.data);
          $scope.post.title = '';
          $scope.post.message = '';
        })
        .catch((err) => console.log(err));
    };

    $scope.logoutUser = () => {
      sessionStorage.clear();
      $location.path('/login');
    };
  },
]);
