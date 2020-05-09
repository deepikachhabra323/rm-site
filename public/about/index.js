myApp.controller("aboutController",function($scope,$location,$rootScope,$timeout){
  window.scrollTo(0, 0);
  $(window).resize(function() {
    $scope.windowWidth = $( window ).width();
    $timeout(function(){
        $scope.$apply();
    },1);
});
$scope.windowWidth = $( window ).width();
  $scope.top='';
  $scope.givingBack='';
  $scope.newConnect={};
  const db = firebase.firestore();
  var batch = db.batch();
  const storage = firebase.storage().ref();
  $scope.testimonials = [];
  db.collection("testimonials").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        var data = doc.data();
        if(doc.data().img){
            storage.child('img/'+doc.data().img).getDownloadURL().then((url)=>{
                data.img = url;
                if(data.visibleOn.includes('about'))
                $scope.testimonials.push({...data,id:doc.id});
            });
        }
        else {
            if(data.visibleOn.includes('about'))
                $scope.testimonials.push({...data,id:doc.id});
        }
        //$scope.testimonials= testimonial;
        $timeout(function(){
            $scope.$apply();
        },1);
    });
    //$rootScope.testimonials = testimonials;
  });
  $scope.collaborate = function(){

  };
  $scope.book = function(){
    if(isValidated([$scope.newConnect.author,$scope.newConnect.email,$scope.newConnect.phone,$scope.newConnect.message,$scope.newConnect.city])){
      console.log($scope);
      db.collection('aboutCollaborate').add({
      ...$scope.newConnect,
      uid:sessionStorage.uid || true,
      date:new Date()
      //page:window.location.hash
      })
      .then(function(docRef) {
        // $scope.book();
        $scope.toggleDidBook();
        $scope.newConnect={};
        $timeout(function(){
              $scope.$apply()
          },1);
          console.log("Document written with ID: ", docRef.id,docRef);
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
    }
    else{
        $('#toast').toast('show');
    }
  }
  db.collection("aboutPageTitle").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        $scope[doc.id] = doc.data().text;
        console.log(doc,$scope)
        $timeout(function(){
          $scope.$apply()
        },1);
        console.log(doc.id, " => ", doc.data());
    });
  });
  $scope.saveData = () => {
    var about = db.collection("aboutPageTitle");
    batch.update(about.doc('top'),{
        text:$scope.top,
        uid:sessionStorage.uid || true
    });
    batch.update(about.doc('givingBack'),{
      text:$scope.givingBack,
      uid:sessionStorage.uid || true
    });
    batch.update(about.doc('topM'),{
      text:$scope.topM,
      uid:sessionStorage.uid || true
    });
    batch.update(about.doc('givingBackM'),{
      text:$scope.givingBackM,
      uid:sessionStorage.uid || true
    });

    batch.commit().then(function () {
      $timeout(function(){
        $scope.$apply()
      },1);
      $location.url("/");
    });
  };
  $scope.didBook = false;
    $scope.toggleDidBook = () =>{
        $scope.didBook = ! $scope.didBook;
    }
});