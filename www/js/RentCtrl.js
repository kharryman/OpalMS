/* @name AssignedCtrl
*
**/
angular.module('opal.controllers.rent', [])

.controller('RentCtrl', function($scope, $rootScope, $state, Popup, Progress, $state, $timeout) {
  console.log("INITIATING PARAMETERS?...");
  $scope.rent = {};
  $scope.rent.selected="rent-percussion";
  var init = function() {
    Progress.hide();
  };

  $scope.goRent = function(state){
    $state.go(state,{user:$rootScope.root.user});
  }

  $scope.$on('$ionicView.enter', function() {
    init();
  });
})
