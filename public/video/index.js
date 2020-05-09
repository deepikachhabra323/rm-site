myApp.controller("videoController",['$sce','$scope','$http','$location','$timeout','$rootScope',function($sce,$scope,$http,$location,$timeout,$rootScope){
    window.scrollTo(0, 0);
    $(window).resize(function() {
        $scope.windowWidth = $( window ).width();
        $timeout(function(){
            $scope.$apply();
        },1);
    });
    $scope.windowWidth = $( window ).width();
    var db = firebase.firestore();
    var batch = db.batch();
    $scope.videos = [];$scope.addNew = false;$scope.newUrl = {};$scope.pageTitle='';
    $scope.visibleTab = "videos";$scope.addNewPlaylist = false;
    $scope.newPlaylist = {};$scope.currentPlaylist = {};
    $scope.shouldPlay = false;$scope.showPlaylist = true;
    db.collection("videos").get().then(function(querySnapshot) {
        $scope.videos = [];
        videos = [];
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log("here")
            $http.get('https://www.googleapis.com/youtube/v3/videos?id='+getVideoId(doc.data().url)+'&key=AIzaSyDyURH-EjyXA2-TItNWjyJSRV4KRr6_9f0&part=snippet').then(function(res){
                console.log(res);
                var resp = res.data.items[0].snippet;
                $scope.videos.push({...doc.data(),id:doc.id,title:resp.title,thumbnail:resp.thumbnails.medium});
                console.log($scope.videos);
                $timeout(function(){
                    $scope.$apply();
                },1);
            });
            $timeout(function(){
                $scope.$apply();
            },1);
        });
        $timeout(function(){
            $scope.$apply();
        },1);
    });
    $scope.getPL = () => {
        db.collection("playlists").get().then(function(querySnapshot) {
            $scope.playlists = [];
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.data().url)
                $http.get('https://www.googleapis.com/youtube/v3/playlists?id='+youtube_playlist_parser(doc.data().url)+'&key=AIzaSyDyURH-EjyXA2-TItNWjyJSRV4KRr6_9f0&part=snippet&maxResults=50').then(function(res){
                //$http.get('https://www.googleapis.com/youtube/v3/playlistItems?playlistId=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj&key=AIzaSyDyURH-EjyXA2-TItNWjyJSRV4KRr6_9f0&part=snippet&maxResults=50').then(function(res){
                    console.log(res,doc.data());
                    $scope.playlists.push({...doc.data(),id:doc.id,pName:res.data.items[0].snippet.title,thumbnail:res.data.items[0].snippet.thumbnails.medium.url});
                });
                
            });
            $timeout(function(){
                $scope.$apply();
            },1);
        });
    } 
    $scope.getPL();
    $scope.deleteVideo = (index) =>{
        db.collection("videos").doc($scope.videos[index].id).delete().then(function() {
            $scope.videos.splice(index,1);
            $timeout(function(){
                $scope.$apply()
            },1);
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    };
    $scope.ytSubscribe = () => {
        document.getElementById('subscribe-youtube').click();
        //console.log(document.getElementById('subscribe-youtube'));
    };
    $scope.deletePlaylist = (index) =>{
        db.collection("playlists").doc($scope.playlists[index].id).delete().then(function() {
            $scope.playlists.splice(index,1);
            $timeout(function(){
                $scope.$apply()
            },1);
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    };
    $scope.playVideo=function(link,index){
        $scope.currentLink = link;
        $scope.shouldPlay = true;
        var ele = document.getElementById('rm-video-player');
        // if(index+1%3==0){

        // }
        var ind = index+(index+1)%3-1;
        if(index==0){
            ind = 2;
        }
        else if((index+1)%3==0){
            ind = index;
        }
        else if(index%3==0){
            ind = index-1;
        }
        var toAdd = document.getElementById('ytvideo'+ind);
        $scope.ind = ind;
        if(ele){
            ele.parentNode.removeChild(ele);
        }
        ele = toAdd.insertAdjacentHTML('afterend','<div class="rm-video-player" style="width:100%;" id="rm-video-player"><iframe width="100%" height="600px" src="'+link+'" allowfullscreen></iframe></div>')
        console.log(toAdd,toAdd.getBoundingClientRect());
        window.scrollTo({
          //top: toAdd.getBoundingClientRect().y+toAdd.getBoundingClientRect().height+50,
          top:toAdd.offsetTop+toAdd.offsetHeight,
          behavior: 'smooth',
        });
    };
    $scope.editVideo = (item,index,toggleEnable) => {
        //$location.url('/editBlog/'+$scope.blogs[index].id)
        if(toggleEnable){
            item.isEnabled = !item.isEnabled;
        }
        db.collection("videos").doc(item.id).update({
            url : item.url,
            date:new Date(),
            isEnabled:item.isEnabled?item.isEnabled:false,
            uid:sessionStorage.uid || true,
            }).then(function() {
            $scope.videos[index] = item;
            $timeout(function(){
                $scope.$apply()
            },1);
            console.log("Document successfully updated!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    };
    $scope.editPlaylist = (item,index) => {
        //$location.url('/editBlog/'+$scope.blogs[index].id)
        db.collection("playlists").doc(item.id).update({
            url : item.url,
            date:new Date(),
            uid:sessionStorage.uid || true
            }).then(function() {
            $scope.playlists[index] = item;
            $timeout(function(){
                $scope.$apply()
            },1);
            console.log("Document successfully updated!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    };
    $scope.getUrl = (index) => {
        var key  = getVideoId($scope.videos[index].url);
        return $sce.trustAsResourceUrl('//www.youtube.com/embed/' + key);
    };
    $scope.getPlaylistVideoUrl = (index) => {
        //var key  = getVideoId($scope.videos[index].url);
        return $sce.trustAsResourceUrl('//www.youtube.com/embed/' + index);
    };
    $scope.canAddNew = () => {
        $scope.addNew = !$scope.addNew;
        $scope.newUrl = {};
        $timeout(function(){
            $scope.$apply()
        },1);
    };
    $scope.canAddNewPlaylist = () => {
        $scope.addNewPlaylist = !$scope.addNewPlaylist;
        $scope.newUrl = {};
        $timeout(function(){
            $scope.$apply()
        },1);
    };
    $scope.changeTab = (visible) =>{
        $scope.visibleTab = visible;
        $scope.shouldPlay = false;
        $timeout(function(){
            $scope.$apply()
        },1);
    };
    $scope.updateNewUrl = function() {
        if(isValidated([$scope.newUrl.url])){
            db.collection("videos").add({
                url: $scope.newUrl.url,
                date:new Date(),
                uid:sessionStorage.uid || true
            })
            .then(function(docRef) {
                $scope.videos.push({url:$scope.newUrl.url,id:docRef.id});
                $scope.canAddNew();
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
    $scope.updateNewPlaylist = function() {
        if(isValidated([$scope.newPlaylist.url,$scope.newPlaylist.name])){
            db.collection("playlists").add({
                name : $scope.newPlaylist.name,
                url: $scope.newPlaylist.url,
                date:new Date(),
                uid:sessionStorage.uid || true
            })
            .then(function(docRef) {
                //$scope.videos.push({url:$scope.newUrl.url,id:docRef.id});
                $scope.canAddNewPlaylist();
                $scope.getPL();
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
    $scope.togglePlaylistVideos = function(playlist){
        $scope.currentPlaylist = playlist;
        console.log(playlist)
        $http.get('https://www.googleapis.com/youtube/v3/playlistItems?playlistId='+youtube_playlist_parser(playlist.url)+'&key=AIzaSyDyURH-EjyXA2-TItNWjyJSRV4KRr6_9f0&part=snippet&maxResults=50').then(function(res){
            console.log(res)
            $scope.showPlaylist = false;
            $scope.currentPlaylist.videos = res.data.items;
        });
    };
    $scope.togglePlaylistVisibility = () => {
        $scope.showPlaylist = true;
        $scope.shouldPlay = false;
    }
    $rootScope.$watch('isLoggedIn', (newVal,oldVal)=>{
        if(newVal!=oldVal){
            $scope.isLoggedIn = $rootScope.isLoggedIn || sessionStorage.uid!==undefined;
            $timeout(function(){
                $scope.$apply()
            },1);
        }
    });

    //editables
    db.collection("videoPageTitle").get().then(function(querySnapshot) {
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
        var about = db.collection("videoPageTitle");
        batch.update(about.doc('pageTitle'),{
            text:$scope.pageTitle,
            uid:sessionStorage.uid || true
        });
        batch.update(about.doc('pageTitle'),{
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
}]);

function youtube_validate(url) {

        var regExp = /^(?:https?:\/\/)?(?:www\.)?youtube\.com(?:\S+)?$/;
        return url.match(regExp)&&url.match(regExp).length>0;

    }

function youtube_playlist_parser(url){

        var reg = new RegExp("[&?]list=([a-z0-9_-]+)","i");
        var match = reg.exec(url);
        console.log(url)
        if (match&&match[1].length>0&&youtube_validate(url)){
            return match[1];
        }else{
            return "nope";
        }

    } 