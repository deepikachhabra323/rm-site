$(document).ready(function() {
    $('.carousel').carousel({
      interval: 1200
    })
  });

myApp.controller("homeController",function($sce,$scope,$http,$location,$rootScope,$firebaseStorage,$timeout){
    const db = firebase.firestore();
    const storage = firebase.storage().ref();
    var batch = db.batch();
    $scope.videoTitle = "";$scope.blogTitle = "";
    $scope.testimonials = [];$scope.myStory = {};$scope.blogs = [];
    $scope.events = [];$scope.canModifyEvent = false;
    $scope.videos = [];$scope.newEvent = {};$scope.mainHeader = "";
    $scope.subHeader = "";$scope.headerButton = "";$scope.fb = "";$scope.yt = "";
    $scope.courseHeader = "";$scope.courseSubheader = "";$scope.currentLink = '';
    $scope.shouldPlay = false;
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
        querySnapshot.forEach((doc) => {
            var data = doc.data();
            if(doc.data().img){
                storage.child('img/'+doc.data().img).getDownloadURL().then((url)=>{
                    data.img = url;
                    $scope.testimonials.push({...data,id:doc.id});
                });
            }
            else $scope.testimonials.push({...doc.data(),id:doc.id});
            $timeout(function(){
                $scope.$apply()
            },1);
        });
        $rootScope.testimonials = $scope.testimonials;
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
    $scope.saveData = () => {
        var speaker = db.collection("speaker");
        var speakerH = speaker.doc("speakerHeader");
        batch.update(speakerH,{
            text:$scope.speakerHeader,
        });
        var speakerT = speaker.doc("speakerText");
        batch.update(speakerT,{
            text:$scope.speakerText,
        });
        var speakerB = speaker.doc("speakerButton");
        batch.update(speakerB,{
            text:$scope.speakerButton,
        });
        
        
        var story = db.collection("myStoy").doc("quote");
        batch.update(story,{
            quote:$scope.myStory.quote,
        });
        var storyT = db.collection("myStoy").doc("title");
        batch.update(storyT,{
            title:$scope.myStory.title
        });
        var header = db.collection("header-main-page").doc("mainHeader");
        batch.update(header,{
            text:$scope.mainHeader
        });
        var sheader = db.collection("header-main-page").doc("subHeader");
        batch.update(sheader,{
            text:$scope.subHeader
        });
        var headerB = db.collection("header-main-page").doc("headerButton");
        batch.update(headerB,{
            text:$scope.headerButton
        });
        var video = db.collection("titles").doc("videoTitle");
        batch.update(video,{
            text:$scope.videoTitle
        });
        var articles = db.collection("titles").doc("blogTitle");
        batch.update(articles,{
            text:$scope.blogTitle
        });
        var fb = db.collection("media").doc("fb");
        batch.update(fb,{
            text:$scope.fb
        });
        var yt = db.collection("media").doc("yt");
        batch.update(yt,{
            text:$scope.yt
        });
        var courseH = db.collection("course").doc("courseHeader");
        batch.update(courseH,{
            text:$scope.courseHeader
        });
        var courseS = db.collection("course").doc("courseSubheader");
        batch.update(courseS,{
            text:$scope.courseSubheader
        });
        batch.commit().then(function () {
          var str = $scope.speakerImage;
          var fileType = str.substring(str.indexOf('/')+1).replace(str.substring(str.indexOf(';')),"");
          var fileName = uuidv4()+'.'+fileType;
          var ref = storage.child('img/'+fileName);
          console.log(fileName,str,$scope.speakerImage)
          ref.putString(str.substring(str.indexOf(',')+1), 'base64').then(function(snapshot) {
              console.log('Uploaded a base64url string!',snapshot);
              //var speakerI = speaker.doc("speakerImage");
              speaker.doc("speakerImage").update({
                  text:fileName
              })
              .then(function(docRef) {
                  $scope.speakerImage = fileName;
                  console.log("Document written with ID: ", docRef.id,docRef);
                  $timeout(function(){
                    $scope.$apply()
                  },1);
                  $location.url("/");
              })
              .catch(function(error) {
                  console.error("Error adding document: ", error);
              });
              //batch.update(speakerI,{
              //    text:$scope.speakerImage,
              //});
          });
        });
    };
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
                    ...$scope.newEvent
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
                        ...$scope.newEvent
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
            $scope.isLoggedIn = $rootScope.isLoggedIn;
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