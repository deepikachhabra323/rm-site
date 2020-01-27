

var blogCats = ['All','Productivity','Mind Management','Relationships','Miscellaneous'];
myApp.controller("blogReadController",function($scope,$http,$routeParams,$timeout){
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
            });
        }
        $timeout(function(){
            $scope.$apply();
        },1);
    });
});


myApp.controller("blogEditController",function($scope,$http,$routeParams,$location,$timeout){
    $scope.title="";$scope.text="";$scope.imgUrl={img:""};
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
    });
    if($routeParams.topicId!=undefined){
        db.collection("blogs").doc($routeParams.topicId).get().then((doc) => {
            var obj = doc.data();
            $scope.id = doc.id;
            $scope.title = obj.title;
            $scope.text = obj.text;
            $scope.categ = obj.categ;
            $scope.imgUrl = {img:obj.imgUrl};
            $timeout(function(){
                $scope.$apply();
            },1);
        });
    }
    
    $scope.saveBlog = () => {
        if(isValidated([$scope.title,$scope.text,$scope.categ,$scope.categ!=='All'])){
            // Add a new document with a generated id.
            if($routeParams.topicId!=undefined){
                db.collection("blogs").doc($routeParams.topicId).update({
                    title: $scope.title,
                    text: $scope.text,
                    categ:$scope.categ,
                    imgUrl: $scope.imgUrl.img
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
                        imgUrl: fileName,
                        categ:$scope.categ
                    })
                    .then(function(docRef) {
                        $location.url("/blog");
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
    var db = firebase.firestore();
    var storage = firebase.storage().ref();
    $scope.blogs = [{"imgUrl":"./img/blog.jpg","text":"Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.","title":"1Lorem Ipsum is simply dummy text of the printing and typesetting industry."}];
    $scope.blogCats = blogCats;$scope.loadedBlogs=[];
    $scope.filteredBlogs = {All:[]};$scope.catFilter = 'All';
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
                    $scope.filteredBlogs['All'].push({...data,id:doc.id});
                    if($scope.filteredBlogs[data.categ]==undefined && data.categ!==undefined){
                        $scope.filteredBlogs[data.categ] = [];
                        console.log(1);
                    }
                    if(data.categ!==undefined && data.categ!=='All'){
                        $scope.filteredBlogs[data.categ].push({...data,id:doc.id});
                        console.log("filtered",$scope.filteredBlogs);
                    }
                    $scope.loadedBlogs = $scope.filteredBlogs[$scope.catFilter].slice(0,6);
                    console.log($scope.loadedBlogs,$scope.blogs,$scope.filteredBlogs);
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
                    $scope.filteredBlogs[data.categ].push({...data,id:doc.id});
                }
                $scope.loadedBlogs = $scope.filteredBlogs[$scope.catFilter].slice(0,6);
                console.log($scope.loadedBlogs,$scope.blogs,$scope.filteredBlogs);
                $timeout(function(){
                    $scope.$apply()
                },1);
            }
            
            console.log(doc.id, " => ", doc.data());
            
        });
        //$scope.loadedBlogs = $scope.blogs.slice(0,6);
        // $scope.loadedBlogs = $scope.filteredBlogs[cat].slice(0,6);
        // console.log($scope.loadedBlogs,$scope.blogs);
        $timeout(function(){
            $scope.$apply();
            
        },1);
    });
    $scope.deleteBlog = (index) =>{
        db.collection("blogs").doc($scope.blogs[index].id).delete().then(function() {
            $scope.blogs.splice(index,1);
            $timeout(function(){
                $scope.$apply()
            },1);
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    };
    
    $scope.editBlog = (index) => {
        if(index)
        $location.url('/editBlog/'+$scope.blogs[index].id)
        else
        $location.url('/editBlog/')
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
        $scope.blogs = $scope.filteredBlogs[cat];
        $scope.catFilter = cat;
        $scope.loadedBlogs = $scope.filteredBlogs[cat].slice(0,6);
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
}]);

