myApp.controller("connectController",function($scope,$rootScope,$timeout){
    window.scrollTo(0, 0);
    $(window).resize(function() {
        $scope.windowWidth = $( window ).width();
        $timeout(function(){
            $scope.$apply();
        },1);
    });
    $scope.windowWidth = $( window ).width();
    console.log($scope)
    var db = firebase.firestore();
    $scope.result = [];$scope.bookings = [];$scope.askData = [];$scope.aCollaborate = [];
    $scope.readable = ['school','speaking','college','personal_mentoring','coaching','about'];
    $scope.data = {'school':[],'speaking':[],'college':[],'personal_mentoring':[],'coaching':[],'about':[]};
    $scope.changeSuccess = (key,val,type) => {
        
        console.log(key,val,$rootScope);
        $scope.row=key;$scope.collection = val;$scope.type=type;
        $rootScope.isSuccess='getSuccess';
        $timeout(function(){
            $scope.$apply()
        },1);
    }
    $rootScope.$watch('isSuccess', (newVal,oldVal)=>{
        if(newVal!=oldVal){
            //$scope.isSuccess = !isSuccess;
            console.log($rootScope,$scope)
            if($rootScope.isSuccess === 'yes'){
                if($scope.type=='delete')
                $scope.deleteRow($scope.row);
                else if($scope.type=='resolved'){
                    $scope.markResolved();
                }
                
            }
            else if($rootScope.isSuccess=='no'){
                $rootScope.isSuccess = '';
                window.location.reload();
            }
            
            $timeout(function(){
                $scope.$apply()
            },1);
        }
    });
    $scope.deleteRow = () => {
        db.collection($scope.collection).doc($scope.row.id).delete().then(function() {
            // $scope.blogs.splice(index,1);
            window.location.reload();
            $timeout(function(){
                $scope.$apply();
                //$rootScope.isSuccess = '';
            },1);
            
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    }
    $scope.markResolved = () => {
        db.collection($scope.collection).doc($scope.row.id).update({
            //...$scope.row,
            resolved:!$scope.row.resolved
        }).then(function() {
            // $scope.blogs.splice(index,1);
            window.location.reload();
            $timeout(function(){
                $scope.$apply();
                //$rootScope.isSuccess = '';
            },1);
            
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    }
    db.collection("connect").get().then((querySnapshot) => {
        $scope.result = []
        querySnapshot.forEach((doc) => {
            console.log(doc.data())
            let date = doc.data().date?new Date(doc.data().date.seconds*1000).toDateString():null;
            $scope.result.push({...doc.data(),id:doc.id,date:date,ts:doc.data().date?doc.data().date.seconds:0});
            console.log($scope.result)
        });
        $timeout(function(){
            $scope.$apply()
        },1);
    });
    $scope.readable.forEach(page => {
        db.collection(page).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // $scope.data[page].push({...doc.data(),id:doc.id});
                let date = doc.data().date?new Date(doc.data().date.seconds*1000).toDateString():null;
                $scope.data[page].push({...doc.data(),id:doc.id,date:date,ts:doc.data().date?doc.data().date.seconds:0});
            });
            $timeout(function(){
                $scope.$apply()
            },1);
        });
    });
    db.collection("mail-subscription").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            $scope.bookings.push({...doc.data(),id:doc.id});
        });
        $timeout(function(){
            $scope.$apply()
        },1);
    });
    db.collection("aboutCollaborate").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let date = doc.data().date?new Date(doc.data().date.seconds*1000).toDateString():null;
            $scope.aCollaborate.push({...doc.data(),id:doc.id,date:date,ts:doc.data().date?doc.data().date.seconds:0});
        });
        $timeout(function(){
            $scope.$apply()
        },1);
    });
    db.collection("mentoring_ask").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // $scope.askData.push({...doc.data(),id:doc.id});
            let date = doc.data().date?new Date(doc.data().date.seconds*1000).toDateString():null;
            $scope.askData.push({...doc.data(),id:doc.id,date:date,ts:doc.data().date?doc.data().date.seconds:0});
        });
        $timeout(function(){
            $scope.$apply()
        },1);
    });
});

myApp.controller("connectionController",function($scope,$rootScope,$timeout,$location){
    window.scrollTo(0, 0);
    $(window).resize(function() {
        $scope.windowWidth = $( window ).width();
        $timeout(function(){
            $scope.$apply();
        },1);
    });
    $scope.windowWidth = $( window ).width();
    console.log($scope)
    var db = firebase.firestore();
    $scope.newConnect = {};
    $scope.didBook = false;
    $scope.toggleDidBook = () =>{
        $scope.didBook = ! $scope.didBook;
    }
    $scope.updateNewConnect = function(){
        if(isValidated([$scope.newConnect.author,$scope.newConnect.preparing,$scope.newConnect.phone,$scope.newConnect.message, $scope.newConnect.location])){
          console.log($scope);
          db.collection("connect").add({
          ...$scope.newConnect,
          uid:sessionStorage.uid || true,
          //page:"connect",
          date:new Date()
          })
          .then(function(docRef) {
            $scope.toggleDidBook();
            $scope.newConnect = {};
            $timeout(function(){
                  $scope.$apply()
              },1);
              console.log("Document written with ID: ", docRef.id,docRef);
              //$location.url("/");
          })
          .catch(function(error) {
              console.error("Error adding document: ", error);
          });
        }
        else{
            $('#toast').toast('show');
        }
      };
});