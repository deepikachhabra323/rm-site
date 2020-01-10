myApp.controller("testimonialController",['$scope','$http','$location','rootScope',function($scope,$http,$location,$rootScope){
    var db = firebase.firestore();
    $scope.testimonials = [];
    if($rootScope.testimonials==undefined){
            db.collection("testimonials").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                $scope.testimonials.push({...doc.data(),id:doc.id});
            });
            $rootScope.testimonials = $scope.testimonials;
        });
    }
    else{
        $scope.testimonials = $rootScope.testimonials;
    }
}]);