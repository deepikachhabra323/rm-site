myApp.controller("connectController",function($scope,$rootScope,$timeout){
    var db = firebase.firestore();
    $scope.result = [];
    db.collection("connect").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            $scope.result.push({...doc.data(),id:doc.id});
        });
        $timeout(function(){
            $scope.$apply()
        },1);
    });
});

myApp.controller("connectionController",function($scope,$rootScope,$timeout){
});