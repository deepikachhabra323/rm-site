myApp.controller("loginController",['$scope','$location','$rootScope','$firebaseObject','$timeout',function($scope,$location,$rootScope,$firebaseObject,$timeout){
    window.scrollTo(0, 0);
    $scope.email = "";
    $scope.password="";
    //const rootRef = firebase.database().ref().child('angular');
    //const ref = rootRef.child('object');
    ////var ref = new Firebase();
    //this.object = $firebaseObject(ref);
    const auth = firebase.auth();
    $scope.onLogin=()=>{
        console.log('login2')
        var promise = auth.signInWithEmailAndPassword($scope.email, $scope.password)
        .then(function(user){
            $rootScope.isLoggedIn = true;
            $scope.isLoggedIn = true;
            $rootScope.user = user.user;
            sessionStorage.uid = $rootScope.user.uid;
            console.log('login1',user,auth.currentUser)
            $location.url('/');
            ti = setTimeout(()=>{
                $rootScope.user = null;
                delete sessionStorage.uid;
            },100000)
            $timeout(function(){
                $scope.$apply()
            },1);
        })
        .catch(function(error) {$rootScope.isLoggedIn = false; delete  sessionStorage.uid});
    };
}]);

var ti = setTimeout(()=>{
    //delete sessionStorage.uid;
},10000)