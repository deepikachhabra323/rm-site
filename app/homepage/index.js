myApp.controller("homeController",function($scope,$http,$location,$rootScope,$sce){
    $http.get('./data.json').
        then(function(data, status, headers, config) {
        $scope.jsonData = data;
    });
        console.log($rootScope);
    $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
    };
    $scope.getUrl = (index) => {
        var key  = getVideoId($scope.jsonData.data.videos[index].link);
        console.log(key,index);
        return '//www.youtube.com/embed/' + key;
    };
});

function getVideoId(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return 'error';
    }
}