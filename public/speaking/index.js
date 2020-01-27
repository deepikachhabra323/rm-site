myApp.controller("speakingController",function($scope,$location,$rootScope,$timeout){
    $scope.book = function(){
        $rootScope.canBook = true;
    }
});