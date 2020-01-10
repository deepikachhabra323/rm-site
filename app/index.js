//import * as data from './../data.json';
//console.log(data);
var myApp = angular.module('rohitMittal', ['ngRoute']);

myApp.controller("appController",function($scope,$http,$document,$window,$location){
    $scope.pixelsScrolled = true ;
    $document.on('scroll', function() {
        $scope.$apply(function() {
            $scope.pixelsScrolled = $window.scrollY<=10 ;
        });
    });
    $scope.isVisible=(path)=>{
        if(path){
            return $location.url()==path;
        }
        return $location.url()!=='/login';
    };
});

myApp.config(function($routeProvider){
                $routeProvider
                .when("/",{
                    templateUrl:"/homepage/index.html",
                    controller:"homeController"
                    })
                .when("/blog/:topicId",{
                    templateUrl:"/blog/readMode.html",
                    controller:"blogReadController"
                    })
                .when("/blog",{
                    templateUrl:"/blog/index.html",
                    controller:"blogController"
                    })
                .when("/videos",{
                    templateUrl:"/video/index.html",
                    controller:"videoController"
                    })
                .when("/login",{
                    templateUrl:"/login/index.html",
                    controller:"loginController"
                    })
                .otherwise({
                    redirectTo:'/'
                });
            });

myApp.controller("topnav",function($scope,$location,$rootScope){
    $scope.paths = [
                    {
                        title:"Home",
                        path:"/"
                    },
                    {
                        title:"Blog",
                        path:"/blog"
                    },
                    {
                        title:"Videos",
                        path:"/videos"
                    },
                    {
                        title:"Programs",
                        path:"/events"
                    },
                    {
                        title:"Testimonials",
                        path:"/testimonials"
                    },
                    {
                        title:"Connect",
                        path:"/connect"
                    },
                    {
                        title:"Log In",
                        path:"/login"
                    }
                    ];
    $scope.redirectTo=(path)=>{
        $location.url(path.path);
    };
    $rootScope.$watch('isLoggedIn', (newVal,oldVal)=>{
        if(newVal!=oldVal){
            $scope.isLoggedIn = $rootScope.isLoggedIn;
            var paths = $scope.paths;
            if($rootScope.isLoggedIn){
                paths[paths.length-1].title = 'Log Out';
            }
            else{
                paths[paths.length-1].title = 'Log In';
            }
        }
    });
    $scope.isLoggedIn=$rootScope.isLoggedIn;
});