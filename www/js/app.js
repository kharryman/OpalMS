angular.module('opal-mobile', ['opal.controllers.login', 'opal.controllers.store-purchase', 'opal.controllers.buy', 'opal.controllers.rent', 'opal.controllers.classes', 'ngCordova', 'opal.factories', 'opal.services', 'ionic'])

.run(function($cordovaNetwork, $ionicPlatform, $rootScope, $state){
  if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    cordova.plugins.Keyboard.disableScroll(true);
  }
  if (window.StatusBar) {
    // org.apache.cordova.statusbar required
    StatusBar.styleDefault();
  }

  document.addEventListener("pause", onPause, false);
  document.addEventListener("resume", onResume, false);

  if (isApp()){
    //document.addEventListener("deviceready", $rootScope.onDeviceReady, false);
  }else{
    //$rootScope.onDeviceReady();
  }

  $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
    var onlineState = networkState.toUpperCase();

  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  .state('store-purchase', {
    url: '/store-purchase/:user',
    templateUrl: 'templates/store-purchase.html',
    controller: 'StorePurchaseCtrl'
  })
  .state('buy-instruments', {
    url: '/buy-instruments/:user',
    templateUrl: 'templates/buy-instruments.html',
    controller: 'BuyCtrl'
  })
  .state('rent-instruments', {
    url: '/rent-instruments/:user',
    templateUrl: 'templates/rent-instruments.html',
    controller: 'RentCtrl'
  })
  .state('take-classes', {
    url: '/take-classes/:user',
    templateUrl: 'templates/take-classes.html',
    controller: 'ClassesCtrl'
  })
  .state('buy-percussion', {
    url: '/buy-percussion/:user',
    templateUrl: 'templates/buy-percussion.html',
    controller: 'BuyCtrl'
  })
  .state('buy-string', {
    url: '/buy-string/:user',
    templateUrl: 'templates/buy-string.html',
    controller: 'BuyCtrl'
  })
  .state('buy-wind', {
    url: '/buy-wind/:user',
    templateUrl: 'templates/buy-wind.html',
    controller: 'BuyCtrl'
  })
  .state('buy-brass', {
    url: '/buy-brass/:user',
    templateUrl: 'templates/buy-brass.html',
    controller: 'BuyCtrl'
  })
  .state('rent-percussion', {
    url: '/rent-percussion/:user',
    templateUrl: 'templates/rent-percussion.html',
    controller: 'RentCtrl'
  })
  .state('rent-string', {
    url: '/rent-string/:user',
    templateUrl: 'templates/rent-string.html',
    controller: 'RentCtrl'
  })
  .state('rent-wind', {
    url: '/rent-wind/:user',
    templateUrl: 'templates/rent-wind.html',
    controller: 'RentCtrl'
  })
  .state('rent-brass', {
    url: '/rent-brass/:user',
    templateUrl: 'templates/rent-brass.html',
    controller: 'RentCtrl'
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
