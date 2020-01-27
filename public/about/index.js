myApp.controller("aboutController",function($scope,$location,$rootScope,$timeout){
  $scope.collaborate = function(){

  };
  $scope.book = function(){
    $rootScope.canBook = true;
}
});