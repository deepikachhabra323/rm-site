myApp.controller("loginController",['$scope','$location','$rootScope','$firebaseObject','$timeout',function($scope,$location,$rootScope,$firebaseObject,$timeout){
    $scope.email = "";
    $scope.password="";
    //const rootRef = firebase.database().ref().child('angular');
    //const ref = rootRef.child('object');
    ////var ref = new Firebase();
    //this.object = $firebaseObject(ref);
    const auth = firebase.auth();
    $scope.onLogin=()=>{
        var promise = auth.signInWithEmailAndPassword($scope.email, $scope.password)
        .then(function(user){
            $rootScope.isLoggedIn = true;
            $scope.isLoggedIn = true;
            $location.url('/');
            $timeout(function(){
                $scope.$apply()
            },1);
        })
        .catch(function(error) {$rootScope.isLoggedIn = false;});
    };
}]);