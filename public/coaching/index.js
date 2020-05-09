myApp.controller("coachingController",function($scope,$location,$rootScope,$timeout){
    const testimonial = [
        {
            text:'“Rohit Sir has been an integral part of JB Classes since its inception. He has led the way to making the institution what it is now. He has a unique personality which enchants the students and inspires them. He is a fine mentor and an exquisite speaker.',
            img:'https://firebasestorage.googleapis.com/v0/b/rohit-mittal.appspot.com/o/img%2Fjayant%20bothra%20(home%20and%20Coaching).jpeg?alt=media&token=1d733c78-1c02-4f3d-89f1-2b77b617d783',
            author:'Jayant Bothara',
            designation:'Founder and Director, JB Classes, Sri Ganganagar'
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
                    if(data.visibleOn.includes('coaching'))
                    $scope.testimonials.push({...data,id:doc.id});
                });
            }
            else {
                if(data.visibleOn.includes('coaching'))
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
    db.collection("coachingPageTitle").get().then(function(querySnapshot) {
        let vals = ['pageTitle','pageTitleM']
        querySnapshot.forEach(function(doc) {
            $scope[doc.id] = doc.data().text;
            console.log(doc,$scope)
            $timeout(function(){
                    $scope.$apply()
            },1);
            console.log(doc.id, " => ", doc.data());
        });
      });

      $scope.teacher='';$scope.student='';$scope.teacherM='';$scope.studentM='';
      db.collection("coachingTexts").get().then(function(querySnapshot) {
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
        var about = db.collection("coachingPageTitle");
        batch.update(about.doc('pageTitle'),{
            text:$scope.pageTitle,
            uid:sessionStorage.uid || true
        });
        batch.update(about.doc('pageTitleM'),{
            text:$scope.pageTitleM,
            uid:sessionStorage.uid || true
        });
        var texts = db.collection("coachingTexts");
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
        batch.update(texts.doc('teacherM'),{
            text:$scope.teacherM,
            type:'teacherM',
            uid:sessionStorage.uid || true
        });
        batch.update(texts.doc('studentM'),{
            text:$scope.studentM,
            type:'studentM',
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