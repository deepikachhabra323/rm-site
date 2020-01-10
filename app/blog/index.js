myApp.controller("blogReadController",function($scope,$http,$routeParams){
    $http.get('./data.json').
        then(function(data, status, headers, config) {
        $scope.jsonData = data;
        console.log(data);
    })
    .then(()=>{
        $scope.blogId = $routeParams.topicId;
        $scope.blog = $scope.jsonData.data.blogs[$scope.blogId];
        console.log($scope);
        });
});
myApp.controller("blogController",function($scope,$http){
    $http.get('./data.json').
        then(function(data, status, headers, config) {
        $scope.jsonData = data;
        console.log(data);
    });
});

