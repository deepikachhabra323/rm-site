const testimonial = [
    {
        text:'“I found you when I was struggling to move forward. You have helped me in my weakest moments. You have given me the strength to keep fighting for my dream and I am grateful to have you in my life. It is only because of you that I have achieved the little success I have in my life.”',
        img:'https://firebasestorage.googleapis.com/v0/b/rohit-mittal.appspot.com/o/img%2FNikhil%20Gupta%20(home%20and%20personal%20mentoring).jpeg?alt=media&token=f17af993-231e-4ab0-bc09-b1771129a9c4',
        author:'Nikhil Gupta',
        designation:'Auditor, CAG'
    },
    {
        text:'“Rohit Sir has been an integral part of JB Classes since its inception. He has led the way to making the institution what it is now. He has a unique personality which enchants the students and inspires them. He is a fine mentor and an exquisite speaker.',
        img:'https://firebasestorage.googleapis.com/v0/b/rohit-mittal.appspot.com/o/img%2Fjayant%20bothra%20(home%20and%20Coaching).jpeg?alt=media&token=1d733c78-1c02-4f3d-89f1-2b77b617d783',
        author:'Jayant Bothara',
        designation:'Founder and Director, JB Classes, Sri Ganganagar'
    },
    {
        text:'I truly appreciate Rohit Sir for guiding me. I had lost all my confidence but he was the one who motivated me and made me think that I can crack a government job exam. I don’t know where I would have been were it not for Rohit Sir.',
        img:'https://firebasestorage.googleapis.com/v0/b/rohit-mittal.appspot.com/o/img%2FRakesh%20Verma%20(home).jpeg?alt=media&token=ad5f8268-3b1f-40b0-b042-c792b9957069',
        author:'Rakesh Verma',
        designation:'Junior Associate, SBI'
    }
]
myApp.controller("homeController",function($sce,$scope,$http,$location,$rootScope,$firebaseStorage,$timeout){
    $(document).ready(function() {
        $('.carousel-home').carousel({
          interval: 4200
        })
      });
    window.scrollTo(0, 0);
    $(window).resize(function() {
        $scope.windowWidth = $( window ).width();
        $timeout(function(){
            $scope.$apply();
        },1);
    });
    $scope.windowWidth = $( window ).width();
    const db = firebase.firestore();
    const storage = firebase.storage().ref();
    var batch = db.batch();
    $scope.videoTitle = "";$scope.blogTitle = "";
    $scope.testimonials = [];$scope.myStory = {};$scope.blogs = [];
    $scope.events = [];$scope.canModifyEvent = false;
    $scope.videos = [];$scope.newEvent = {};$scope.mainHeader = "";
    $scope.subHeader = "";$scope.headerButton = "";$scope.fb = "";$scope.yt = "";
    $scope.courseHeader = "";$scope.courseSubheader = "";$scope.currentLink = '';
    $scope.shouldPlay = false;$scope.canRead = false;
    $scope.speakerHeader = "";$scope.speakerText = "";$scope.speakerButton="";$scope.speakerImage="";
    db.collection("blogs").get().then(function(querySnapshot) {
        $scope.blogs = [];
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            var data = doc.data();
            if(data.imgUrl){
                storage.child('img/'+data.imgUrl).getDownloadURL().then((url)=>{
                    data.imgUrl = url;
                    $scope.blogs.push({...data,id:doc.id});
                    $timeout(function(){
                        $scope.$apply()
                    },1);
                });
            }
            else $scope.blogs.push({...data,id:doc.id});
            $timeout(function(){
                    $scope.$apply()
            },1);
            console.log(doc.id, " => ", doc.data());
        });
    });
    db.collection("videos").get().then(function(querySnapshot) {
        $scope.videos = [];
        querySnapshot.forEach(function(doc) {
            $http.get('https://www.googleapis.com/youtube/v3/videos?id='+getVideoId(doc.data().url)+'&key=AIzaSyDyURH-EjyXA2-TItNWjyJSRV4KRr6_9f0&part=snippet').then(function(res){
                console.log(res);
                var resp = res.data.items[0].snippet;
                if(doc.data().isEnabled)
                $scope.videos.push({...doc.data(),id:doc.id,title:resp.title,thumbnail:resp.thumbnails.medium});
                console.log($scope.videos);
                $timeout(function(){
                    $scope.$apply();
                },1);
            });// doc.data() is never undefined for query doc snapshots
            //$scope.videos.push({...doc.data(),id:doc.id,title:title.title});
            console.log(doc.id, " => ", {...doc.data(),id:doc.id,});
        });
        $timeout(function(){
            $scope.$apply()
        },1);
    });

    db.collection("testimonials").get().then((querySnapshot) => {
        let testimonials = []
        querySnapshot.forEach((doc) => {
            var data = doc.data();
            if(doc.data().img){
                storage.child('img/'+doc.data().img).getDownloadURL().then((url)=>{
                    data.img = url;
                    testimonials.push({...data,id:doc.id});
                    if(data.visibleOn.includes('homepage'))
                    $scope.testimonials.push({...data,id:doc.id});
                });
            }
            else {
                testimonials.push({...doc.data(),id:doc.id});
                if(data.visibleOn.includes('homepage'))
                    $scope.testimonials.push({...data,id:doc.id});
            }
            //$scope.testimonials= testimonial;
            $timeout(function(){
                $scope.$apply();
            },1);
        });
        $rootScope.testimonials = testimonials;
    });
    //db.collection("events").get().then((querySnapshot) => {
    //    querySnapshot.forEach((doc) => {
    //        var data = doc.data();
    //        if(doc.data().img){
    //            //console.log(storage.child('img/'+doc.data().img));
    //            storage.child('img/'+doc.data().img).getDownloadURL().then((url)=>{
    //                data.img = url;
    //                if(doc.data().date.toDate){
    //                    $scope.events.push({...data,id:doc.id,date:doc.data().date.toDate()});
    //                }
    //                else
    //                $scope.events.push({...data,id:doc.id});
    //            });
    //        }
    //        else{
    //            if(doc.data().date.toDate){
    //                $scope.events.push({...data,id:doc.id,date:doc.data().date.toDate()});
    //            }
    //            else
    //            $scope.events.push({...data,id:doc.id});
    //        }
    //        $timeout(function(){
    //            $scope.$apply()
    //        },1);
    //    });
    //});
    db.collection("myStoy").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            $scope.myStory[doc.id] = doc.data()[doc.id];
            $timeout(function(){
                $scope.$apply()
            },1);
        });
    });
    db.collection("speaker").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            $scope[doc.id] = doc.data().text;
            $timeout(function(){
                $scope.$apply()
            },1);
        });
    });
    //db.collection("myStoy").doc("quote").get().then((doc) => {
    //    $scope.myStory.title = doc.data().quote;
    //    $timeout(function(){
    //        $scope.$apply()
    //    },1);
    //});
    
    $scope.getDate = (d) => {
        return new Date(d).toLocaleDateString('en-GB');
    }
    $scope.toggleReadMode = (testimonial) => {
        $scope.canRead = !$scope.canRead;
        if(testimonial)
        $scope.testimonial = testimonial;
    };
    $scope.getUrl = (index) => {
        var key  = getVideoId($scope.videos[index].url);
        return $sce.trustAsResourceUrl('//www.youtube.com/embed/' + key);
    };
    
    db.collection("header-main-page").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            $scope[doc.id] = doc.data().text;
            $timeout(function(){
                $scope.$apply()
            },1);
        });
    });
    db.collection("titles").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            $scope[doc.id] = doc.data().text;
        });
        $timeout(function(){
            $scope.$apply()
        },1);
    });
    db.collection("media").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            $scope[doc.id] = doc.data().text;
        });
        $timeout(function(){
            $scope.$apply()
        },1);
    });
    db.collection("course").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            $scope[doc.id] = doc.data().text;
        });
        $timeout(function(){
            $scope.$apply()
        },1);
    });
    $scope.playVideo = function(link){
        $scope.currentLink = link;
        $scope.shouldPlay = true;
    }
    $scope.toggleViewMode = function(){
        $scope.shouldPlay = false;
    }
    $scope.imgBook={img:''};
    db.collection("bookImage").doc('book').get().then(function(doc) {
        storage.child('img/'+doc.data().imgUrl).getDownloadURL().then((url)=>{
            $scope.imgBook.img = url;

            $timeout(function(){
                $scope.$apply();
            },1);
        });
    });
    $scope.saveBook = () => {
        var str = $scope.imgBook.img;
        console.log(str)
        var fileType = str.substring(str.indexOf('/')+1).replace(str.substring(str.indexOf(';')),"");
        var fileName = uuidv4()+'.'+fileType;
        var ref = storage.child('img/'+fileName);
        ref.putString(str.substring(str.indexOf(',')+1), 'base64').then(function(snapshot) {
            db.collection("bookImage").doc("book").update({
                imgUrl: fileName,
                uid:sessionStorage.uid||true
            })
            .then(function(docRef) {
                //$location.url("/blog");
                window.location.reload();
                $timeout(function(){
                    $scope.$apply()
                },1);
                console.log("Document written with ID: ", docRef);
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
        });
    }    
    $scope.saveData = () => {
        var speaker = db.collection("speaker");
        var speakerH = speaker.doc("speakerHeader");
        batch.update(speakerH,{
            text:$scope.speakerHeader,
            uid:sessionStorage.uid || true
        });
        var speakerT = speaker.doc("speakerText");
        batch.update(speakerT,{
            text:$scope.speakerText,
            uid:sessionStorage.uid || true
        });
        var speakerB = speaker.doc("speakerButton");
        batch.update(speakerB,{
            text:$scope.speakerButton,
            uid:sessionStorage.uid || true
        });
        
        
        var story = db.collection("myStoy").doc("quote");
        batch.update(story,{
            quote:$scope.myStory.quote,
            uid:sessionStorage.uid || true
        });
        var story = db.collection("myStoy").doc("quoteM");
        batch.update(story,{
            quoteM:$scope.myStory.quoteM,
            uid:sessionStorage.uid || true
        });
        var storyT = db.collection("myStoy").doc("title");
        batch.update(storyT,{
            title:$scope.myStory.title,
            uid:sessionStorage.uid || true
        });
        var header = db.collection("header-main-page").doc("mainHeader");
        batch.update(header,{
            text:$scope.mainHeader,
            uid:sessionStorage.uid || true
        });
        var sheader = db.collection("header-main-page").doc("subHeader");
        batch.update(sheader,{
            text:$scope.subHeader,
            uid:sessionStorage.uid || true
        });
        var headerB = db.collection("header-main-page").doc("headerButton");
        batch.update(headerB,{
            text:$scope.headerButton,
            uid:sessionStorage.uid || true
        });
        var video = db.collection("titles").doc("videoTitle");
        batch.update(video,{
            text:$scope.videoTitle,
            uid:sessionStorage.uid || true
        });
        var articles = db.collection("titles").doc("blogTitle");
        batch.update(articles,{
            text:$scope.blogTitle,
            uid:sessionStorage.uid || true
        });
        var fb = db.collection("media").doc("fb");
        batch.update(fb,{
            text:$scope.fb,
            uid:sessionStorage.uid || true
        });
        var yt = db.collection("media").doc("yt");
        batch.update(yt,{
            text:$scope.yt,
            uid:sessionStorage.uid || true
        });
        var courseH = db.collection("course").doc("courseHeader");
        batch.update(courseH,{
            text:$scope.courseHeader,
            uid:sessionStorage.uid || true
        });
        var courseS = db.collection("course").doc("courseSubheader");
        batch.update(courseS,{
            text:$scope.courseSubheader,
            uid:sessionStorage.uid || true
        });
        batch.commit().then(function () {
          var str = $scope.speakerImage;
          var fileType = str.substring(str.indexOf('/')+1).replace(str.substring(str.indexOf(';')),"");
          var fileName = uuidv4()+'.'+fileType;
          var ref = storage.child('img/'+fileName);
        //   console.log(fileName,str,$scope.speakerImage)
          $location.url("/");
        //   ref.putString(str.substring(str.indexOf(',')+1), 'base64').then(function(snapshot) {
        //       console.log('Uploaded a base64url string!',snapshot);
        //       //var speakerI = speaker.doc("speakerImage");
        //       speaker.doc("speakerImage").update({
        //           text:fileName,
        //           uid:sessionStorage.uid || true
        //       })
        //       .then(function(docRef) {
        //           $scope.speakerImage = fileName;
        //           console.log("Document written with ID: ", docRef.id,docRef);
        //           $timeout(function(){
        //             $scope.$apply()
        //           },1);
        //           $location.url("/");
        //       })
        //       .catch(function(error) {
        //           console.error("Error adding document: ", error);
        //       });
        //       //batch.update(speakerI,{
        //       //    text:$scope.speakerImage,
        //       //});
        //   });
        });
    };
    $scope.sendEmail = $rootScope.sendEmail;
    $scope.addFileUrl = (e) => {
        //console.log(e);
    };
    $scope.modifyEvent = () => {
        $scope.canModifyEvent = !$scope.canModifyEvent;
        $scope.newEvent = {};
    };
    $scope.editEvent = (event,index) => {
        $scope.newEvent = event;
        $scope.modifyEvent();
    };
    $scope.deleteEvent = (index) => {
         db.collection("events").doc($scope.events[index].id).delete().then(function() {
            $scope.events.splice(index,1);
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    };
    $scope.updateEvent = () => {
        if(isValidated([$scope.newEvent.title,$scope.newEvent.description,$scope.newEvent.date,$scope.newEvent.venue])){
            if($scope.newEvent.id){
                db.collection("events").doc($scope.newEvent.id).update({
                    ...$scope.newEvent,
                    uid:sessionStorage.uid || true
                })
                .then(function() {
                    //$scope.events.push({...$scope.newEvent});
                    $scope.events.forEach((item,index)=>{
                        if($scope.newEvent.id==item.id){
                            $scope.events[index] = $scope.newEvent;
                        }
                    });
                    $scope.newEvent = {};
                    $scope.modifyEvent();
                    console.log("Document updated.");
                })
                .catch(function(error) {
                    console.error("Error adding document: ", error);
                });
            }
            else{
                //console.log($scope.newEvent.img.substring($scope.newEvent.img.indexOf('image/')),$scope.newEvent.img.substring($scope.newEvent.img.indexOf(';')))
                var str = $scope.newEvent.img;
                var fileType = str.substring(str.indexOf('/')+1).replace(str.substring(str.indexOf(';')),"");
                var fileName = uuidv4()+'.'+fileType;
                var ref = storage.child('img/'+fileName);
                ref.putString(str.substring(str.indexOf(',')+1), 'base64').then(function(snapshot) {
                    console.log('Uploaded a base64url string!',snapshot);
                    $scope.newEvent.img = fileName;
                    db.collection("events").add({
                        ...$scope.newEvent,
                        uid:sessionStorage.uid || true
                    })
                    .then(function(docRef) {
                        $scope.events.push({...$scope.newEvent,id:docRef.id});
                        $scope.newEvent = {};
                        $scope.modifyEvent();
                        console.log("Document written with ID: ", docRef.id,docRef);
                    })
                    .catch(function(error) {
                        console.error("Error adding document: ", error);
                    });
                });
                
            }
        }
        else{
            $('#toast').toast('show');
        }
    };
    $scope.$watch('testimonials', (newVal,oldVal)=>{
        if(newVal!=oldVal){
            $rootScope.testimonials = $scope.testimonials;
        }
    });
    $rootScope.$watch('isLoggedIn', (newVal,oldVal)=>{
        if(newVal!=oldVal){
            $scope.isLoggedIn = $rootScope.isLoggedIn || sessionStorage.uid!==undefined;
            $timeout(function(){
                $scope.$apply()
            },1);
        }
    });
});

function getVideoId(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return 'error';
    }
}