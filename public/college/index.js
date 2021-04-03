myApp.controller("collegeController",function($scope,$location,$rootScope,$timeout){
    const testimonial = [
        {
            text:'“Rohit did an exceptional job inspiring our students. His style and humour are flawless. I was most impressed by the passion and fire in him to make a lasting change in his audience. He left it all on the stage. It was exhilarating to watch him speak. Never before have I experienced so many goose bumps in a workshop. Thank you for an extraordinary hour with you.',
            img:'https://firebasestorage.googleapis.com/v0/b/rohit-mittal.appspot.com/o/img%2Fpawan%20pareekh%20(college).jpeg?alt=media&token=0c61af2e-6f27-4227-98c4-46c42668e658',
            author:'Dr. Pawan Pareekh',
            designation:'Vice Principal & Director (Academics), Surendra Group of Institutions'
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
    $scope.pageTitle = '';$scope.pageTitleM = ''
    //$scope.testimonials= testimonial;
    const db = firebase.firestore();
    const storage = firebase.storage().ref();
    var batch = db.batch();
    $scope.book = function(){
        $rootScope.canBook = true;
    }
    $scope.testimonials = [];
    if(window.location.hash=="#!/college")
    db.collection("testimonials").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var data = doc.data();
            if(doc.data().img){
                storage.child('img/'+doc.data().img).getDownloadURL().then((url)=>{
                    data.img = url;
                    if(data.visibleOn.includes('college'))
                    $scope.testimonials.push({...data,id:doc.id});
                });
            }
            else {
                if(data.visibleOn.includes('college'))
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
    db.collection("collegePageTitle").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            $scope[doc.id] = doc.data().text;
            console.log(doc,$scope)
            $timeout(function(){
                    $scope.$apply()
            },1);
            console.log(doc.id, " => ", doc.data());
        });
      });
    $scope.teacher='';$scope.student='';
    $scope.teacherM='';$scope.studentM='';
      db.collection("collegeTexts").get().then(function(querySnapshot) {
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
        var about = db.collection("collegePageTitle");
        batch.update(about.doc('pageTitle'),{
            text:$scope.pageTitle,
            uid:sessionStorage.uid || true
        });
        batch.update(about.doc('pageTitleM'),{
            text:$scope.pageTitleM,
            uid:sessionStorage.uid || true
        });
        var texts = db.collection("collegeTexts");
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
        batch.update(texts.doc('studentM'),{
            text:$scope.studentM,
            type:'student',
            uid:sessionStorage.uid || true
        });
        batch.update(texts.doc('teacherM'),{
            text:$scope.teacherM,
            type:'teacher',
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