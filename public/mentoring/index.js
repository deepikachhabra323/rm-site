
myApp.controller("mentoringController",function($scope,$location,$rootScope,$timeout){
    $(document).ready(function() {
        $('.carousel-mentoring').carousel({
          interval: 4200
        })
      });
    const testimonial = [
        {
            text:'“I found you when I was struggling to move forward. You have helped me in my weakest moments. You have given me the strength to keep fighting for my dream and I am grateful to have you in my life. It is only because of you that I have achieved the little success I have in my life.”',
            img:'https://firebasestorage.googleapis.com/v0/b/rohit-mittal.appspot.com/o/img%2FNikhil%20Gupta%20(home%20and%20personal%20mentoring).jpeg?alt=media&token=f17af993-231e-4ab0-bc09-b1771129a9c4',
            author:'Nikhil Gupta',
            designation:'Auditor, CAG'
        },
        {
            text:"“I would really like to thank Rohit Mittal Sir for guiding me during my preparation. I lost a bit of confidence and got a phobia of interviews after my first interview went bad. He was the one who motivated me and made me think that I've officers like qualities and I can do it. He was the one who showed me the right path during my journey from a lot of failures to becoming a probationary officer in SBI.",
            img:'https://firebasestorage.googleapis.com/v0/b/rohit-mittal.appspot.com/o/img%2FArpit%20Sharma%20(home-mentoring%20and%20personal%20mentoring%20page)%20.JPG?alt=media&token=9e918a71-beb0-4a22-8e35-a7b0f72ae787',
            author:'Arpit Sharma',
            designation:'Probationary Officer, SBI'
        },
        {
            text:'I have been at a point in my life where I kept studying and studying but nothing was happening. I was really working hard but it was of no use. Then, Rohit sir made me realise the mistakes I was making and how I needed to understand and handle my mind better to score and release all the stress. I was an average student, I never even thought I could pass but I did. All thanks to Rohit Sir.',
            img:'https://firebasestorage.googleapis.com/v0/b/rohit-mittal.appspot.com/o/img%2FAnkit%20Monga%20(personal%20mentoring).jpeg?alt=media&token=acb145b9-2e1e-4535-a6a9-c33239315eca',
            author:'Ankit Monga',
            designation:'Junior Associate, SBI'
        }
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
    $scope.newBook = {};
    //$scope.testimonials= testimonial;
    const db = firebase.firestore();
    const storage = firebase.storage().ref();
    var batch = db.batch();
    $scope.book = function(toBook){
        console.log(toBook)
        if(toBook){
            $scope.canBook = true;
        }
        else {$rootScope.canBook = true;}
    }
    $scope.testimonials = [];
    db.collection("testimonials").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var data = doc.data();
            if(doc.data().img){
                storage.child('img/'+doc.data().img).getDownloadURL().then((url)=>{
                    data.img = url;
                    if(data.visibleOn.includes('personal'))
                    $scope.testimonials.push({...data,id:doc.id});
                });
            }
            else {
                if(data.visibleOn.includes('personal'))
                    $scope.testimonials.push({...data,id:doc.id});
            }
            //$scope.testimonials= testimonial;
            $timeout(function(){
                $scope.$apply();
            },1);
        });
        //$rootScope.testimonials = testimonials;
    });
    $scope.toggleAskBooking = function(toBook){
        $scope.canBook = false;
        $scope.newBook = {};
        $scope.toggleDidAsk();
    }
    $scope.updateAskBooking = function(){
        if(isValidated([$scope.newBook.author,$scope.newBook.email,$scope.newBook.phone,$scope.newBook.message,$scope.newBook.city])){
          db.collection('mentoring_ask').add({
          ...$scope.newBook,
          uid:sessionStorage.uid || true,
          date:new Date(),
          //page:window.location.hash
          })
          .then(function(docRef) {
            $scope.toggleAskBooking();
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
      };
    $scope.redirectTo=(path)=>{
        $location.url(path);
    };
    $scope.toggleReadMode = (testimonial) => {
        $scope.canRead = !$scope.canRead;
        if(testimonial)
        $scope.testimonial = testimonial;
    };
    $scope.didAsk  = false;
    $scope.toggleDidAsk = function(){
        $scope.didAsk  =!$scope.didAsk;
    };
    //editables
    db.collection("mentoringPageTitle").get().then(function(querySnapshot) {
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
        var about = db.collection("mentoringPageTitle");
        batch.update(about.doc('pageTitle'),{
            text:$scope.pageTitle,
            uid:sessionStorage.uid || true
        });
        batch.update(about.doc('pageTitleM'),{
            text:$scope.pageTitleM,
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