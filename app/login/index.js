myApp.controller("loginController",function($scope,$location,$rootScope){
    $scope.email = "";
    $scope.password="";
    $scope.onLogin=()=>{
        firebase.auth().signInWithEmailAndPassword($scope.email, $scope.password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
        });
        //if($scope.email == "admin@admin.com" && $scope.password == "password"){
        //    $rootScope.isLoggedIn = true;
        //    $location.url('/');
        //}
        //else{
        //    $rootScope.isLoggedIn = false;
        //}
    };
});