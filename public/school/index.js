myApp.controller("schoolController",function($scope,$location,$rootScope,$timeout){
  const testimonial = [
    {
        text:'“Rohit is just WOW. He is a very dynamic and captivating personality. I have heard many speakers but Rohit connects with the heart and soul of the audience in such an easy manner that change is inevitable. He made us laugh and delivered what was promised. My students are highly inspired to do their best and yield great results. Thank you for an outstanding session.”',
        img:'https://firebasestorage.googleapis.com/v0/b/rohit-mittal.appspot.com/o/img%2FMeetu%20Sharma%20(home-speaking%2C%20speaking%20and%20schools).JPG?alt=media&token=82d46512-f465-4669-b1f6-3361953f4e16',
        author:'Meetu Sharma',
        designation:'Principal, Blooming Dales International School, Sri Ganganagar'
    },
]
  window.scrollTo(0, 0);
  $(window).resize(function() {
    $scope.windowWidth = $( window ).width();
    $timeout(function(){
        $scope.$apply();
    },1);
});
$scope.windowWidth = $( window ).width();
  $scope.pageTitle = '';
  //$scope.testimonials= testimonial;
  const db = firebase.firestore();
  const storage = firebase.storage().ref();
  var batch = db.batch();
  $scope.book = function(){
      $rootScope.canBook = true;
  }
  $scope.testimonials = [];
    db.collection("testimonials").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var data = doc.data();
            if(doc.data().img){
                storage.child('img/'+doc.data().img).getDownloadURL().then((url)=>{
                    data.img = url;
                    if(data.visibleOn.includes('school'))
                    $scope.testimonials.push({...data,id:doc.id});
                });
            }
            else {
                if(data.visibleOn.includes('school'))
                    $scope.testimonials.push({...data,id:doc.id});
            }
            //$scope.testimonials= testimonial;
            $timeout(function(){
                $scope.$apply();
            },1);
        });
        //$rootScope.testimonials = testimonials;
    });
  $scope.toggleReadMode = (testimonial) => {
    $scope.canRead = !$scope.canRead;
    if(testimonial)
    $scope.testimonial = testimonial;
};
  //editables
  db.collection("schoolPageTitle").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        $scope[doc.id]= doc.data().text;
        $timeout(function(){
                $scope.$apply()
        },1);
        console.log(doc.id, " => ", doc.data());
    });
  });
  $scope.student='';$scope.teacher = '';$scope.parent='';
  $scope.studentM='';$scope.teacherM = '';$scope.parentM='';
  db.collection("schoolTexts").get().then(function(querySnapshot) {
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
    var about = db.collection("schoolPageTitle");
    batch.update(about.doc('pageTitle'),{
        text:$scope.pageTitle,
        uid:sessionStorage.uid || true
    });
    batch.update(about.doc('pageTitleM'),{
      text:$scope.pageTitleM,
      uid:sessionStorage.uid || true
  });
    var texts = db.collection("schoolTexts");
    batch.update(texts.doc('student'),{
        text:$scope.student,
        type:'student',
        uid:sessionStorage.uid || true
    });
    batch.update(texts.doc('teacher'),{
        text:$scope.teacher,
        type:'teacher',
        uid:sessionStorage.uid || true
    });
    batch.update(texts.doc('parent'),{
        text:$scope.parent,
        type:'parent',
        uid:sessionStorage.uid || true
    });
    batch.update(texts.doc('studentM'),{
      text:$scope.studentM,
      type:'studentM',
      uid:sessionStorage.uid || true
  });
  batch.update(texts.doc('teacherM'),{
      text:$scope.teacherM,
      type:'teacher',
      uid:sessionStorage.uid || true
  });
  batch.update(texts.doc('parentM'),{
      text:$scope.parentM,
      type:'parent',
      uid:sessionStorage.uid || true
  });

    batch.commit().then(function () {
      $timeout(function(){
        $scope.$apply()
      },1);
      $location.url("/");
    });
  };
});