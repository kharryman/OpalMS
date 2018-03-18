/* @name AssignedCtrl
*
**/
angular.module('opal.controllers.classes', [])

.controller('ClassesCtrl', function($scope, $rootScope, $state, Popup, Progress, $state, $timeout) {
  console.log("INITIATING PARAMETERS?...");
  $scope.classes = {};
  var init = function() {
    Progress.hide();
  };

  $scope.$on('$ionicView.enter', function() {
    init();
  });
})
