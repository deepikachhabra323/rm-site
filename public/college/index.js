myApp.controller("collegeController",function($scope,$location,$rootScope,$timeout){
    $scope.book = function(){
        $rootScope.canBook = true;
    }
});