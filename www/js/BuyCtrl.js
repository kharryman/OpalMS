/* @name AssignedCtrl
*
**/
angular.module('opal.controllers.buy', [])

.controller('BuyCtrl', function($scope, $rootScope, $state, Popup, Progress, $state, $timeout) {
  console.log("INITIATING PARAMETERS?...");
  $scope.buy = {};
  $scope.buy.selected="buy-percussion";
  var init = function() {
    Progress.hide();
  };

  $scope.goBuy = function(state){
    $state.go(state,{user:$rootScope.root.user});
  }


  $scope.$on('$ionicView.enter', function() {
    init();
  });
})
