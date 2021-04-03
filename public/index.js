//import * as data from './../data.json';
//console.log(data);
var config = {
  apiKey: "AIzaSyDyURH-EjyXA2-TItNWjyJSRV4KRr6_9f0",
  authDomain: "rohit-mittal.firebaseapp.com",
  databaseURL: "https://rohit-mittal.firebaseio.com",
  projectId: "rohit-mittal",
  storageBucket: "rohit-mittal.appspot.com",
  messagingSenderId: "101261058346",
  appId: "1:101261058346:web:d4839e32f6f0cfaedc3e53"
};
firebase.initializeApp(config);
var myApp = angular.module('rohitMittal', ['ngRoute','firebase','ngSanitize']);
 
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

function isValidated(vals){
  var flag = true
  vals.map((val,index) =>{
    
      if(typeof val == "string" && val.trim() == ""){
        val = val.trim();
      }
      if(val == "" || val==undefined || val==null || (Array.isArray(val) && val.length == 0) || (typeof val == "object" && Object.keys(val).length==0) || (val.includes && val.includes("--:--"))){
          flag = false;
      }
  });
  console.log(flag,vals);
  if(flag)
  return true;
  return false;
}

myApp.controller("appController",function($scope,$http,$document,$window,$location,$rootScope,$timeout){
    window.scrollTo(0, 0);
    $(window).resize(function() {
        $scope.windowWidth = $( window ).width();
    });
    $scope.pixelsScrolled = true ;
    $scope.isSuccess = false;
    // $scope.loading = false;
    var db = firebase.firestore();
    var user = firebase.auth().currentUser;
    $rootScope.isLoggedIn = false;
    console.log(user)
    $scope.canConnect = false;$scope.canBook = false;
    $scope.confirm = false;$scope.emailSub = '';
    $scope.canScrollTop = false;$scope.didBook  = false;
    $scope.scrollToContent = false;
    $scope.shouldScrollDown = ()=>{
      var ele = document.getElementById('main-content');
      window.scrollTo({
        top: ele.getBoundingClientRect().y-20,
        behavior: 'smooth',
      });
    };
    
    $document.on('scroll', function() {
        $scope.$apply(function() {
            $scope.pixelsScrolled = $window.scrollY<=10 ;
            $scope.canScrollTop = $window.scrollY>=500;
        });
    });
    $scope.isVisible=(path)=>{
        if(path){
            return $location.url()==path;
        }
        return $location.url()!=='/login';
    };
    $rootScope.$watch('confirm', (newVal,oldVal)=>{
        if(newVal!=oldVal){
            $scope.confirm = $rootScope.confirm;
            
        }
    });
    $rootScope.$watch('loading', (newVal,oldVal)=>{
        if(newVal!=oldVal){
            $scope.loading = $rootScope.loading;
            
        }
    });
    $rootScope.$watch('canBook', (newVal,oldVal)=>{
        if(newVal!=oldVal){
            $scope.canBook = $rootScope.canBook;
            console.log('root')
        }
    });
    $scope.scrollToTop = function(){
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      $scope.canScrollTop = false;
    };
    $scope.toggleDidBook = function(){
        $scope.didBook  =!$scope.didBook;
    };
    $scope.redirectToUrl=(path)=>{
        $location.url(path);
        $scope.didSubscribe = false;
    };
    $scope.mailSubscribe = function(){
        $rootScope.sendEmail({email:$scope.emailSub,name:''});
        $scope.didSubscribe = true;
        $scope.emailSub = '';
        // let emails = $scope.emails;
        // let users = $scope.users;
        // if(emails.indexOf($scope.emailSub)<0){
        //     emails.push($scope.emailSub);
        //     users[$scope.emailSub]={email:$scope.emailSub,active:true};
        // db.collection("emailsSubscribes").doc("emails").update({
        //     'emails':emails,
        //     users:users,
        //     uid:sessionStorage.uid || true
        // })
        // .then(function(docRef) {
        //     $scope.emailSub = '';
        //     $scope.didSubscribe = true;
        //     $timeout(function(){
        //         $scope.$apply()
        //     },1);
        // })
        // .catch(function(error) {
        //     console.error("Error adding document: ", error);
        //     $scope.emailSub = '';
        //     $scope.didSubscribe = true;
        //     $timeout(function(){
        //         $scope.$apply()
        //     },1);
        // });
    // }
    }

    //connect
    
    $scope.newConnect = {};$scope.newBook = {};
    
    $scope.toggleBooking = function(){
      $scope.canBook = !$scope.canBook;
      $rootScope.canBook = !$rootScope.canBook;
      $scope.newBook = {};
      $scope.toggleDidBook();
      $timeout(function(){
        $scope.$apply()
    },1);
    };
    $rootScope.toggleConnect=$scope.toggleConnect;
    $scope.updateNewConnect = function(){
    //   if(isValidated([$scope.newConnect.author,$scope.newConnect.occupation,$scope.newConnect.phone,$scope.newConnect.message,$scope.newConnect.city,$scope.newConnect.institute])){
        if(isValidated([$scope.newConnect.author,$scope.newConnect.occupation,$scope.newConnect.phone,$scope.newConnect.message,$scope.newConnect.city])){
        console.log($scope);
        db.collection("connect").add({
        ...$scope.newConnect,
        uid:sessionStorage.uid || true
        })
        .then(function(docRef) {
          $scope.toggleConnect();
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
    $scope.updateNewBooking = function(){
        if(isValidated([$scope.newBook.author,$scope.newBook.email,$scope.newBook.phone,$scope.newBook.message])){
          console.log($scope);
          db.collection(window.location.hash.split('#!/')[1]).add({
          ...$scope.newBook,
          uid:sessionStorage.uid || true,
          date:new Date()
          //page:window.location.hash
          })
          .then(function(docRef) {
            $scope.toggleBooking();
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
      $scope.users = [];$scope.emails=[];
      db.collection("emailsSubscribes").get().then(function(querySnapshot) {
            $scope.users = [];$scope.emails=[];
            querySnapshot.forEach(function(doc) {
                // console.log('email',doc.data())
                $scope.users = doc.data().users;$scope.emails=doc.data().emails;
            });
        });
      $rootScope.sendEmail = function (user) {
        Email.send({
            Username : "Rohit",
            SecureToken:"2064eea0-7018-408a-9823-50add40382b2",
            To : user.email,
            From : "contact@rohitmittal.in",
            Bcc : "contact@rohitmittal.in",
            Subject : "[Important] Congratulations on taking your first steps to success",
            Body : `Hello ${user.name},
            <br/><br/>Thank you for subscribing to my email-list. 
            <br/>
            You will get all the updates regarding my new Video updates, blog updates, workshops etc. via email now.
            <br/>
            If you wish to ask me something or get my guidance, you may mail to contact@rohitmittal.in or just drop a whatsapp message at 759-759-78-78
            <br/>
            Lets together create a happy and successful life for you!
            <br/>
            Love + Respect,
            <br/>
            Rohit Mittal`,
        })
        .then(function(message){
            //alert("mail sent successfully")
            console.log(message,user,$scope)
            let emails = $scope.emails;
            let users = $scope.users;
            console.log(emails.indexOf(user.email)<0 ,message=='OK')
            if(emails.indexOf(user.email)<0 && message=='OK'){
                emails.push(user.email);
                users[user.email]={...user,active:true};
                db.collection("emailsSubscribes").doc("emails").update({
                    emails:emails,
                    users:users,
                    uid:sessionStorage.uid||true
                }).then(function(docRef) {
                    // window.location.reload();
                    $timeout(function(){
                        $scope.$apply()
                    },1);
                    // console.log("Document written with ID: ", docRef.id,docRef);
                })
                .catch(function(error) {
                    console.error("Error adding document: ", error);
                });
            }
            Email.send({
                Username : "Rohit",
                // SecureToken:"0281e989-98c5-423e-9007-ebdf3c2c2e4a",
                SecureToken:"2064eea0-7018-408a-9823-50add40382b2",
                From : "contact@rohitmittal.in",
                To : "contact@rohitmittal.in",
                Subject : "New Email Subscriber (Homepage)",
                Body : `Hello Rohit,
                User Details:<br/>
                Name ${user.name},<br/>
                Email ${user.email},<br/>
                Phone ${user.contact}<br/><br/>
                Thanks.
                `,
            })
            .then(function(message){});
            
        });
    }
    $scope.toSuccess = (val) => {
        $rootScope.isSuccess = val;
        //$rootScope.toSuccess();
    };
    $rootScope.$watch('isSuccess', (newVal,oldVal)=>{
        if(newVal!=oldVal){
            //$scope.isSuccess = !isSuccess;
            if($rootScope.isSuccess === ''){
                $scope.isSuccess = false;
            }
            else if($rootScope.isSuccess=='getSuccess'){
                $scope.isSuccess = true;
            }
            $timeout(function(){
                $scope.$apply()
            },1);
        }
    });
});

myApp.directive('appFilereader', function($q) {
    var slice = Array.prototype.slice;

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
                if (!ngModel) return;

                ngModel.$render = function() {};

                element.bind('change', function(e) {
                    var element = e.target;

                    $q.all(slice.call(element.files, 0).map(readFile))
                        .then(function(values) {
                            if (element.multiple) ngModel.$setViewValue(values);
                            else ngModel.$setViewValue(values.length ? values[0] : null);
                        });

                    function readFile(file) {
                        var deferred = $q.defer();

                        var reader = new FileReader();
                        reader.onload = function(e) {
                            deferred.resolve(e.target.result);
                        };
                        reader.onerror = function(e) {
                            deferred.reject(e);
                        };
                        reader.readAsDataURL(file);

                        return deferred.promise;
                    }

                }); //change

            } //link
    }; //return
});

myApp.config(function($routeProvider){
                $routeProvider
                .when("/",{
                    // templateUrl:"/homepage/index.html",
                    templateUrl:"/comming_soon/index.html",
                    controller:"homeController"
                    })
                .when("/modifyData",{
                    // templateUrl:"/homepage/modify.html",
                    templateUrl:"/comming_soon/index.html",
                    controller:"homeController"
                    })
                .when("/blog/:topicId",{
                    // templateUrl:"/blog/readMode.html",
                    templateUrl:"/comming_soon/index.html",
                    controller:"blogReadController"
                    })
                .when("/blog",{
                    // templateUrl:"/blog/index.html",
                    templateUrl:"/comming_soon/index.html",
                    controller:"blogController"
                    })
                .when("/editBlog",{
                    // templateUrl:"/blog/editBlog.html",
                    templateUrl:"/comming_soon/index.html",
                    controller:"blogEditController"
                    })
                .when("/editBlog/:topicId",{
                    // templateUrl:"/blog/editBlog.html",
                    templateUrl:"/comming_soon/index.html",
                    controller:"blogEditController"
                    })
                .when("/videos",{
                    // templateUrl:"/video/index.html",
                    templateUrl:"/comming_soon/index.html",
                    controller:"videoController"
                    })
                .when("/login",{
                    // templateUrl:"/login/index.html",
                    templateUrl:"/comming_soon/index.html",
                    controller:"loginController"
                    })
                .when("/testimonials",{
                    // templateUrl:"/testimonial/index.html",
                    templateUrl:"/comming_soon/index.html",
                    controller:"testimonialController"
                    })
                .when("/connections",{
                    // templateUrl:"/connect/index.html",
                    templateUrl:"/comming_soon/index.html",
                    controller:"connectController"
                    })
                .when("/connect",{
                    // templateUrl:"/connect/connect.html",
                    templateUrl:"/comming_soon/index.html",
                    controller:"connectionController"
                    })
                .when("/comming_soon",{
                    templateUrl:"/comming_soon/index.html",
                    controller:"appController"
                    })
                .when("/about",{
                    // templateUrl:"/about/index.html",
                    templateUrl:"/comming_soon/index.html",
                    controller:"aboutController"
                    })
                .when("/school",{
                    // templateUrl:"/school/index.html",
                    templateUrl:"/comming_soon/index.html",
                    controller:"schoolController"
                    })
                .when("/personal_mentoring",{
                    // templateUrl:"/mentoring/index.html",
                    templateUrl:"/comming_soon/index.html",
                    controller:"mentoringController"
                    })
                .when("/college",{
                    // templateUrl:"/college/index.html",
                    templateUrl:"/comming_soon/index.html",
                    controller:"collegeController"
                    })
                .when("/coaching",{
                    // templateUrl:"/coaching/index.html",
                    templateUrl:"/comming_soon/index.html",
                    controller:"coachingController"
                    })
                .when("/speaking",{
                    // templateUrl:"/speaking/index.html",
                    templateUrl:"/comming_soon/index.html",
                    controller:"speakingController"
                    })
                .when("/one-on-one",{
                    // templateUrl:"/oneOnOne/index.html",
                    templateUrl:"/comming_soon/index.html",
                    controller:"oneOnOneController"
                    })
                .when("/send_email",{
                    // templateUrl:"/email/index.html",
                    templateUrl:"/comming_soon/index.html",
                    controller:"emailController"
                    })
                .otherwise({
                    redirectTo:'/'
                });
            });

myApp.controller("topnav",function($scope,$location,$rootScope,$timeout){
    window.scrollTo(0, 0);
    $scope.paths = [
                    {
                        title:"Home",
                        path:"/"
                    },
                    {
                        title:"About",
                        path:"/about"
                    },
                    {
                        title:"Blog",
                        path:"/blog"
                    },
                    {
                        title:"Videos",
                        path:"/videos"
                    },
                    // {
                    //     title:"One on One",
                    //     path:"/one-on-one"
                    // },
                    {
                        title:"Speaking",
                        path:"/speaking",
                        // subs:[
                        //       {
                        //           title:"School",
                        //           path:"/school"
                        //       },
                        //       {
                        //           title:"College",
                        //           path:"/college"
                        //       },
                        //       {
                        //           title:"Coaching",
                        //           path:"/coaching"
                        //       },
                        //     ]
                    },
                    {
                       title:"Personal Mentoring",
                       path:"/personal_mentoring"
                    },
                    {
                        title:"Testimonials",
                        path:"/testimonials"
                    },
                    {
                        title:"Contact",
                        path:"/connect"
                    },
                    {
                        title:"Connect Results",
                        path:"/connections",
                    },
                    {
                       title:"Log In",
                       path:"/login",
                    }
                    ];
    $scope.redirectTo=(path)=>{
      if(path.title=='Log Out'){
        $rootScope.isLoggedIn=false;
        delete sessionStorage.uid;
        $location.url(path.path);
      }
      else if(path.path )
        $location.url(path.path);
      //else if(path.title=="Connect"){
      //  $rootScope.toggleConnect();
      //}
      else if(path.title == 'Programs'){
        var ele = document.getElementById('life-events');
        window.scrollTo({
          top: ele.getBoundingClientRect().y-50,
          behavior: 'smooth',
        });
      }
    };
    $scope.redirectToUrl=(path)=>{
        $location.url(path);
    };
    $rootScope.$watch('isLoggedIn', (newVal,oldVal)=>{
        if(newVal!=oldVal){
            $scope.isLoggedIn = $rootScope.isLoggedIn ;
            var paths = $scope.paths;
            if($rootScope.isLoggedIn){
                paths[paths.length-1].title = 'Log Out';
            }
            else{
                paths[paths.length-1].title = 'Log In';
            }
            $scope.paths  =paths
            $timeout(function(){
                $scope.$apply()
            },1);
        }
    });
    console.log($scope,$rootScope)
    $scope.isLoggedIn=$rootScope.isLoggedIn ;

    // console.log = ()=> {}
});

myApp.directive('appFilereader', function($q) {
    var slice = Array.prototype.slice;

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
                if (!ngModel) return;

                //ngModel.$render = function() {};

                element.bind('change', function(e) {
                    var element = e.target;

                    $q.all(slice.call(element.files, 0).map(readFile))
                        .then(function(values) {
                            if (element.multiple) ngModel.$setViewValue(values);
                            else ngModel.$setViewValue(values.length ? values[0] : null);
                        });

                    function readFile(file) {
                        var deferred = $q.defer();

                        var reader = new FileReader();
                        reader.onload = function(e) {
                            deferred.resolve(e.target.result);
                        };
                        reader.onerror = function(e) {
                            deferred.reject(e);
                        };
                        reader.readAsDataURL(file);
                        ngModel.$render()
                        console.log(deferred.promise,file,element,ngModel);
                        return deferred.promise;
                    }

                }); //change

            } //link
    }; //return
});

//secondary help functions
function toggleMenu(){
  var ele = document.getElementsByClassName('rm-menu-items')[0];
  //if(ele.classList.contains('rm-menu-items-active')){
  //  
  //}
  ele.classList.toggle('rm-menu-items-active');
}
