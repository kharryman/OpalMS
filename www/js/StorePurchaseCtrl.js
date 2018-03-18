/* @name AssignedCtrl
*
**/
angular.module('opal.controllers.store-purchase', [])

.controller('StorePurchaseCtrl', function($scope, $rootScope, $state, Popup, Progress, $state, $timeout) {
  console.log("INITIATING PARAMETERS?...");
  $scope.store = {};
  $scope.store.reason="buy";
  var init = function() {
    Progress.hide();
  };

  $scope.logout = function(){
   $state.go("login", {});
  }

  $scope.goState = function(state){
   $state.go(state, {});
  }

  $scope.$on('$ionicView.enter', function() {
    init();
  });
})
