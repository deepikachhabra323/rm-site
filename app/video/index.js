myApp.controller("videoController",function($scope,$http){
    $http.get('./data.json').
        then(function(data, status, headers, config) {
        $scope.jsonData = data;
        console.log(data);
    });
});

