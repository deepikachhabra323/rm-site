myApp.controller("testimonialController",['$scope','$http','$location','$rootScope','$timeout',function($scope,$http,$location,$rootScope,$timeout){
    window.scrollTo(0, 0);
    var db = firebase.firestore();
    var storage = firebase.storage().ref();
    $scope.testimonials = [];$scope.addNew = false;
    $scope.newTestimonial = {};$scope.canRead = false;
    $scope.visibleOn = [];
    // if($rootScope.testimonials==undefined){
            db.collection("testimonials").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var data = doc.data();
                if(doc.data().img){
                    storage.child('img/'+doc.data().img).getDownloadURL().then((url)=>{
                        //data.img = url;
                        $scope.testimonials.push({...data,id:doc.id,image:url});
                    });
                }
                else $scope.testimonials.push({...doc.data(),id:doc.id});
            });
            $rootScope.testimonials = $scope.testimonials;
            $timeout(function(){
                $scope.$apply()
            },1);
        });
    // }
    // else{
    //     $scope.testimonials = $rootScope.testimonials;
    //     $timeout(function(){
    //         $scope.$apply()
    //     },1);
    // }
    $scope.visiblity = {};
    var arr =['homepage','testimonial','college','coaching','school','speaking','personal','about']
    arr.forEach(ele =>{
        $scope.visiblity[ele]  =false;
    });
    $scope.toggleEnable = ($event) => {
        
        
        var array = $scope.visibleOn;
        arr.forEach(ele =>{
            var index = array.indexOf(ele);
            if($scope.visiblity[ele]){
                

                if (index === -1) {
                    array.push(ele);
                } 
                console.log(array,$scope,index)
            }
            else if(index>=0){
                array.splice(index, 1);
            }
        })
        
        $scope.visibleOn = array;
        console.log(array,$scope)
        $timeout(function(){
            $scope.$apply()
        },1);
    };
    $scope.canAddNew = (item) => {
        $scope.addNew = !$scope.addNew;
        $scope.newTestimonial = {};
        $scope.visibleOn = [];
        console.log(item)
        if(item){
            $scope.newTestimonial = item;
            // $scope.visibility = item.visibleOn;
            var arr =['homepage','testimonial','college','coaching','school','speaking','personal','about']
            arr.forEach(ele =>{
                $scope.visiblity[ele]  =false;
            });
            item.visibleOn.forEach(ele =>{
                $scope.visiblity[ele]  =true;
            });
        }
    };
    $scope.toggleReadMode = (testimonial) => {
        $scope.canRead = !$scope.canRead;
        if(testimonial)
        $scope.testimonial = testimonial;
    };
    $scope.updateNewTestimonial = () => {
        var isValid = isValidated([$scope.newTestimonial.text,$scope.newTestimonial.author]);
        if(isValid){
            if($scope.newTestimonial.id){
                db.collection("testimonials").doc($scope.newTestimonial.id).update({
                    ...$scope.newTestimonial,
                    visibleOn : $scope.visibleOn,
                    uid:sessionStorage.uid
                })
                .then(function() {
                    //$scope.events.push({...$scope.newEvent});
                    $scope.testimonials.forEach((item,index)=>{
                        if($scope.newTestimonial.id==item.id){
                            $scope.testimonials[index] = $scope.newTestimonial;
                        }
                    });
                    $scope.newTestimonial = {};
                    $scope.canAddNew();
                    $timeout(function(){
                        $scope.$apply()
                    },1);
                    console.log("Document updated.");
                })
                .catch(function(error) {
                    console.error("Error adding document: ", error);
                });
            }
            else{
                var str = $scope.newTestimonial.img;
                var fileType = str.substring(str.indexOf('/')+1).replace(str.substring(str.indexOf(';')),"");
                var fileName = uuidv4()+'.'+fileType;
                var ref = storage.child('img/'+fileName);
                ref.putString(str.substring(str.indexOf(',')+1), 'base64').then(function(snapshot) {
                    console.log('Uploaded a base64url string!',snapshot);
                    $scope.newTestimonial.img = fileName;
                    db.collection("testimonials").add({
                        ...$scope.newTestimonial,
                        visibleOn : $scope.visibleOn,
                        uid:sessionStorage.uid || true
                    })
                    .then(function(docRef) {
                        $scope.testimonials.push({...$scope.newTestimonial,id:docRef.id});
                        $scope.newTestimonial = {};
                        $scope.canAddNew();
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
    $scope.deleteTestimonial = (index) =>{
        db.collection("testimonials").doc($scope.testimonials[index].id).delete().then(function() {
            $scope.testimonials.splice(index,1);
            $timeout(function(){
                $scope.$apply()
            },1);
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    };
    $scope.getConfirmation = () => {
        $rootScope.confirm = true;
    };
    $rootScope.$watch('isLoggedIn', (newVal,oldVal)=>{
        if(newVal!=oldVal){
            $scope.isLoggedIn = $rootScope.isLoggedIn || sessionStorage.uid!==undefined;
            $timeout(function(){
                $scope.$apply()
            },1);
        }
    });
}]);