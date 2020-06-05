

var blogCats = ['All','Productivity','Mind Management','Relationships','Miscellaneous'];
myApp.controller("blogReadController",function($scope,$http,$routeParams,$timeout,$location){
    window.scrollTo(0, 0);
    var db = firebase.firestore();
    var storage = firebase.storage().ref();
    $scope.blogs = [{"imgUrl":"./img/blog.jpg","text":"Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.","title":"1Lorem Ipsum is simply dummy text of the printing and typesetting industry."}];
    var container = document.getElementById('editor-view');
    //container.onload = function(){
        
    var options = {
        debug: 'info',
        modules: {
          toolbar: '#toolbar'
        },
        placeholder: '',
        readOnly: true,
        theme: 'snow'
    };
    $scope.shareUrl = (type) => {
        console.log(type)
        if(type=='LinkedIn')
        return window.location.href = 'https://www.linkedin.com/shareArticle?mini=true&url='+window.location.href;
        else if(type=='Facebook')
        return window.location.href = 'https://www.facebook.com/sharer/sharer.php?u='+'https%3A%2F%2Frohit-mittal.firebaseapp.com%2F#!%2Fblog%2FaeFlmc6sewG0FCaDBsHV';
        else if(type=="Twitter"){
            return window.location.href = "https://twitter.com/share?url="+window.location.href;
        }
        else if(type=='Copy'){
            $scope.shareLink = true;
        }
    }
    var editor = new Quill(container,options);
    db.collection("blogs").doc($routeParams.topicId).get().then(function(doc) {
        
        $scope.blogId = $routeParams.topicId;
        $scope.blog =doc.data();
        if(typeof $scope.blog.text == 'string'){
            $scope.blog.text = [{insert:$scope.blog.text}];
        }
        editor.setContents($scope.blog.text);
        if($scope.blog.imgUrl){
            storage.child('img/'+$scope.blog.imgUrl).getDownloadURL().then((url)=>{
                $scope.blog.imgUrl = url;
                $timeout(function(){
                    $scope.$apply();
                },1);
            });
        }
        $timeout(function(){
            $scope.$apply();
        },1);
    });
});


myApp.controller("blogEditController",function($scope,$http,$routeParams,$location,$timeout,$rootScope){
    window.scrollTo(0, 0);
    $scope.title="";$scope.text="";$scope.imgUrl={img:""};$scope.isEnabled=false;$scope.textString="";
    $scope.blogCats = blogCats;$scope.categ = blogCats[0];
    var db = firebase.firestore();
    var storage = firebase.storage().ref();
    var container = document.getElementById('editor');
    //container.onload = function(){
        
    var options = {
        debug: 'info',
        //modules: {
        //  toolbar: '#toolbar'
        //},
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['blockquote', 'code-block','image','link'],
              
                [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                [{ 'direction': 'rtl' }],                         // text direction
              
                [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              
                [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                [{ 'font': [] }],
                [{ 'align': [] }],
              
                ['clean']                                         // remove formatting button
              ]
        },
        placeholder: 'Compose an epic...',
        //readOnly: true,
        theme: 'snow'
    };
    var editor = new Quill(container,options);
    editor.on('text-change', function(delta, oldDelta, source) {
       $scope.text = editor.getContents().ops;
       console.log(editor.getText())
    });
    //$scope.text = editor.getContents().ops;
    if($routeParams.topicId!=undefined){
        db.collection("blogs").doc($routeParams.topicId).get().then((doc) => {
            var obj = doc.data();
            console.log(obj,editor)
            
            $scope.id = doc.id;
            $scope.title = obj.title;
            $scope.text = obj.text;
            $scope.categ = obj.categ;
            $scope.imgUrl = {img:obj.imgUrl};
            editor.setContents($scope.text);
            $timeout(function(){
                $scope.$apply();
            },1);
        });
    }
    $scope.toggleEnable = () => {
        //$scope.isEnabled = !$scope.isEnabled;
    }
    
    $scope.saveBlog = (toggleEnable) => {
        if(isValidated([$scope.title,$scope.text,$scope.categ,$scope.categ!=='All'])){
            // Add a new document with a generated id.
            $scope.textString = editor.getText();
            if($routeParams.topicId!=undefined){
                db.collection("blogs").doc($routeParams.topicId).update({
                    title: $scope.title,
                    text: $scope.text,
                    textString:$scope.textString,
                    categ:$scope.categ,
                    imgUrl: $scope.imgUrl.img,
                    isEnabled:$scope.isEnabled?$scope.isEnabled:false,
                    date:new Date(),
                    uid:sessionStorage.uid||true
                }).then(function(docRef) {
                    $location.url("/blog");
                    window.location.reload();
                    $timeout(function(){
                        $scope.$apply()
                    },1);
                    console.log("Document written with ID: ", docRef.id,docRef);
                })
                .catch(function(error) {
                    console.error("Error adding document: ", error);
                });
            }
            else {
                var str = $scope.imgUrl.img;
                var fileType = str.substring(str.indexOf('/')+1).replace(str.substring(str.indexOf(';')),"");
                //console.log(fileType,str);
                var fileName = uuidv4()+'.'+fileType;
                var ref = storage.child('img/'+fileName);
                console.log($scope.imgUrl,$scope);
                ref.putString(str.substring(str.indexOf(',')+1), 'base64').then(function(snapshot) {
                    console.log('Uploaded a base64url string!',snapshot);
                    //$scope.imgUrl.img = fileName;
                    db.collection("blogs").add({
                        title: $scope.title,
                        text: $scope.text,
                        textString:$scope.textString,
                        imgUrl: fileName,
                        categ:$scope.categ,
                        date:new Date(),
                        isEnabled:$scope.isEnabled?$scope.isEnabled:false,
                        uid:sessionStorage.uid||true
                    })
                    .then(function(docRef) {
                        $location.url("/blog");
                        window.location.reload();
                        $timeout(function(){
                            $scope.$apply()
                        },1);
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
    //$http.get('./data.json').
    //    then(function(data, status, headers, config) {
    //    $scope.jsonData = data;
    //    console.log(data);
    //})
    //.then(()=>{
    //    $scope.blogId = $routeParams.topicId;
    //    $scope.blog = $scope.jsonData.data.blogs[$scope.blogId];
    //    console.log($scope);
    //});
});


myApp.controller("blogController",['$scope','$http','$firebaseObject','$firebaseArray','$location','$timeout','$rootScope',function($scope,$http,$firebaseObject,$firebaseArray,$location,$timeout,$rootScope){
    window.scrollTo(0, 0);
    $(window).resize(function() {
        $scope.windowWidth = $( window ).width();
        $timeout(function(){
            $scope.$apply();
        },1);
    });
    $scope.windowWidth = $( window ).width();
    $rootScope.loading = true;
    var db = firebase.firestore();
    var batch = db.batch();
    var storage = firebase.storage().ref();
    $scope.blogs = [{"imgUrl":"./img/blog.jpg","text":"Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.","title":"1Lorem Ipsum is simply dummy text of the printing and typesetting industry."}];
    $scope.blogCats = blogCats;$scope.loadedBlogs=[];$scope.pageTitle='';
    $scope.filteredBlogs = {All:[]};$scope.catFilter = 'All';
    $scope.isLoggedIn = $rootScope.isLoggedIn ;
    db.collection("blogs").get().then(function(querySnapshot) {
        $scope.blogs = []; $scope.filteredBlogs = {All:[]};
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            var data = doc.data();
            if(doc.data().imgUrl){
                console.log(doc.data());
                storage.child('img/'+doc.data().imgUrl).getDownloadURL().then((url)=>{
                    data.imgUrl = url;
                    $scope.blogs.push({...data,id:doc.id});
                    let date = doc.data().date?new Date(doc.data().date.seconds*1000).toDateString():null;
                    $scope.filteredBlogs['All'].push({...data,id:doc.id,date:date,ts:data.date && data.date.seconds?data.date.seconds:0});
                    if($scope.filteredBlogs[data.categ]==undefined && data.categ!==undefined){
                        $scope.filteredBlogs[data.categ] = [];
                        // console.log(1);
                    }
                    if(data.categ!==undefined && data.categ!=='All'){
                        $scope.filteredBlogs[data.categ].push({...data,id:doc.id,date:date,ts:data.date && data.date.seconds?data.date.seconds:0});
                        console.log(data.date && data.date.seconds?data.date.seconds:0);
                    }
                    $scope.loadedBlogs = $scope.filteredBlogs[$scope.catFilter].slice(0,6);
                    console.log($scope.loadedBlogs,$scope.blogs,$scope.filteredBlogs);
                    $rootScope.loading = false;
                    $timeout(function(){
                        $scope.$apply();
                    },1);
                });
            }
            else{
                $scope.blogs.push({...data,id:doc.id});
                $scope.filteredBlogs['All'].push({...data,id:doc.id});
                if($scope.filteredBlogs[data.categ]==undefined && data.categ!==undefined){
                    $scope.filteredBlogs[data.categ] = [];
                }
                if(data.categ!==undefined){
                    $scope.filteredBlogs[data.categ].push({...data,id:doc.id,ts:data.date?data.date.seconds:0});
                }
                $scope.loadedBlogs = $scope.filteredBlogs[$scope.catFilter].slice(0,6);
                console.log($scope.loadedBlogs,$scope.blogs,$scope.filteredBlogs);
                $timeout(function(){
                    $scope.$apply()
                },1);
            }
            
            console.log(doc.id, " => ", doc.id);
            
        });
        //$scope.loadedBlogs = $scope.blogs.slice(0,6);
        // $scope.loadedBlogs = $scope.filteredBlogs[cat].slice(0,6);
        // console.log($scope.loadedBlogs,$scope.blogs);
        $timeout(function(){
            $scope.$apply();
            
        },1);
    });
    $scope.deleteBlog = (index) =>{
        db.collection("blogs").doc(index).delete().then(function() {
            $scope.blogs.splice(index,1);
            window.location.reload();
            $timeout(function(){
                $scope.$apply()
                //$rootScope.isSuccess = '';
            },1);
            
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    };
    $scope.key='',$scope.val = '';
    $scope.changeSuccess = (key,val) => {
        
        console.log(key,val,$rootScope);
        $scope.key=key,$scope.val = val;
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
                //$rootScope.isSuccess = false;
                //$scope.saveBlog();
                if($scope.key === 'delete'){
                    $scope.deleteBlog($scope.val)
                }
                else if($scope.key === 'edit'){
                    $scope.editBlog($scope.val)
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
    $scope.editBlog = (index) => {
        if(index)
        $location.url('/editBlog/'+index)
        else
        $location.url('/editBlog/')
        $rootScope.isSuccess = '';
    };
    $scope.loadBlogs = () => {
        if($scope.loadedBlogs.length<$scope.filteredBlogs[$scope.catFilter].length){
            var loadedBlogs = $scope.loadedBlogs;
            $scope.loadedBlogs = loadedBlogs.concat($scope.filteredBlogs[$scope.catFilter].slice($scope.loadedBlogs.length,($scope.loadedBlogs.length+6)));
            $timeout(function(){
                $scope.$apply();
                console.log($scope.loadedBlogs,$scope.blogs,$scope.filteredBlogs[$scope.catFilter].slice($scope.loadedBlogs.length,($scope.loadedBlogs.length+6)));
            },1);
        }
    };
    $scope.getFilteredBlogs = (cat) => {
        console.log(cat,$scope)
        $scope.blogs = $scope.filteredBlogs[cat];
        $scope.catFilter = cat;
        $scope.loadedBlogs = $scope.filteredBlogs[cat]?$scope.filteredBlogs[cat].slice(0,6):[];
        console.log($scope);
        $timeout(function(){
            $scope.$apply()
        },1);
    };
    $rootScope.$watch('isLoggedIn', (newVal,oldVal)=>{
        if(newVal!=oldVal){
            $scope.isLoggedIn = $rootScope.isLoggedIn;
            $timeout(function(){
                $scope.$apply()
            },1);
        }
    });


    //editables
    db.collection("blogPageTitle").get().then(function(querySnapshot) {
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
        var about = db.collection("blogPageTitle");
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
}]);

