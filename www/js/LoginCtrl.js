var myprogress;
angular.module('opal.controllers.login', [])

.controller('LoginCtrl', function($cordovaSplashscreen, $http, Network, OM, Popup, Progress, $q, $rootScope, $scope, $state, $timeout) {

  console.log("LOGIN COMEPLETELY REFRESHED!!!");
  $rootScope.baseFromState ="";
  $rootScope.baseToState = "";
  $rootScope.fromState ="";
  $rootScope.toState = "";
  $scope.email_login = "";
  $scope.password_login = "";


  var init = function() {
      document.getElementById("email_login").value = "";
      document.getElementById("password_login").value = "";
    Progress.hide();
  };//END init....

  $rootScope.onDeviceReady = function(){
    console.log("onDeviceReady CALLED!");
    device_ready = true;
    //if (isApp()){
    //openDB();
    //}
  };
  $rootScope.$broadcast("onDeviceReady");

$scope.login = function(email, password){
  console.log("loggging in....");
  OM.login(email,password);
}

$scope.forgotPassword = function(email){
   $state.go("forgotPassword", {email:email});
}

$rootScope.logout = function(){
  $state.go('login', {}, {reload:true});
}

$scope.verifyPIN = function(){
  console.log("$rootScope.pin=" + $rootScope.pin + ", $scope.loginAuthpin_input=" + $scope.loginAuth.pin_input);
  if ($rootScope.pin.length === 4 && $rootScope.pin === $scope.loginAuth.pin_input){
    Popup.alert("PIN VERIFIED!", 2);
    $state.go('tab.assigned', {email: $scope.email.split("@")[0]});
  }
}

$rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
  Progress.show("Loading Tab");
  $rootScope.fromState = from.name;
  $rootScope.toState = to.name;
});

$scope.$on('$ionicView.enter', function() {
  init();
});

$scope.test = function(){
};

})
