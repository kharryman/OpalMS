angular.module('opal-mobile', ['opal.controllers.login', 'opal.controllers.store-purchase', 'ngCordova', 'opal.factories', 'opal.services', 'ionic'])

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
    url: '/store-purchase/:username',
    templateUrl: 'templates/store-purchase.html',
    controller: 'StorePurchaseCtrl'
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
