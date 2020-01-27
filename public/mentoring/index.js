myApp.controller("mentoringController",function($scope,$location,$rootScope,$timeout){
    $scope.book = function(){
        $rootScope.canBook = true;
    }
});