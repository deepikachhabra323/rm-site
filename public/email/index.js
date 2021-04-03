myApp.controller("emailController",function($sce,$scope,$http,$location,$rootScope,$firebaseStorage,$timeout){

    window.scrollTo(0, 0);
    $(window).resize(function() {
        $scope.windowWidth = $( window ).width();
        $timeout(function(){
            $scope.$apply();
        },1);
    });
    $scope.windowWidth = $( window ).width();
    // $rootScope.loading = true;
    const db = firebase.firestore();
    const storage = firebase.storage().ref();
    var batch = db.batch();
    $scope.users = [];$scope.emails=[];
    $scope.subject = '';$scope.body='';
    $scope.image = '';
    // $scope.getBody=(e)=>{
    //     console.log(e,$scope.body)
    // }
    $scope.success=[];$scope.fails=[];
    $scope.emailSent = false;
    $scope.activeMails = [];
    // $scope.img = {img:''};
    // $scope.myNicEditor = ''
    
    
    $scope.sendSubEmail = (isSelf) => {
        $scope.activeMails = [];
        let users  =$scope.users;
        $scope.emails.map((email)=>{
            if($scope.users[email].active==true){
                $scope.activeMails.push(email);
            }
            if(isSelf){
                $scope.activeMails = ['rohitmittal1602@gmail.com'];
                users['rohitmittal1602@gmail.com'] = {active:true}
            }
            console.log(users)
        });
        var str = $scope.image;
        let body = $scope.body,subject = $scope.subject,image = $scope.image;
        body = $scope.myNicEditor?$scope.myNicEditor.nicInstances[0].getContent():''
        console.log(str)
        // debugger
        var fileType = str.substring(str.indexOf('/')+1).replace(str.substring(str.indexOf(';')),"");
        var fileName = uuidv4()+'.'+fileType;
        var ref = storage.child('email/'+fileName);
        if(image!==''){
            ref.putString(str.substring(str.indexOf(',')+1), 'base64').then(function(snapshot) {
                // console.log(snapshot)
                storage.child('email/'+fileName).getDownloadURL().then((url)=>{
                    image = url;
                    console.log(image)
                    let imgData = [];
                    if(image!==''){
                        body = body.split('photu').join('<br/><img style = "max-width:100%;" src = "'+image+'"> <br/>');
                        body = body.split('photu').join('<br/><img style = "max-width:100%;" src = "'+image+'"> <br/>');
                        body = body.split('lalbadshah').join('<br/><img style = "max-width:100px;" src = "https://firebasestorage.googleapis.com/v0/b/rohit-mittal.appspot.com/o/img%2Fmail-image.jpg?alt=media&token=cd6bc719-2d52-4694-9dd8-095fb7a2e914"> <br/>')
                        console.log(body)
                    }
                    $scope.activeMails.map((email)=>{
                        // console.log(email,$scope.users[email].active)
                        $rootScope.loading = true;
                        $timeout(function(){
                            $scope.$apply()
                        },1);
                        // debugger
                        if(users[email].active==true){
                            // console.log(email)
                            Email.send({
                                Username : "Rohit",
                                SecureToken:"2064eea0-7018-408a-9823-50add40382b2",
                                To : email,
                                From : "contact@rohitmittal.in",
                                // Bcc : "contact@rohitmittal.in",
                                Subject : subject,
                                Body : body.split(`\n`).join('<br/>'),
                            })
                            .then(function(message){
                                //alert("mail sent successfully")
                                if(message=='OK'){
                                    $scope.success.push(email);
                                    // $scope.body = '';
                                    // $scope.subject = '';
                                    // $scope.image = '';
                                }
                                else{
                                    $scope.fails.push(email);
                                }
                                if(($scope.fails.length)+($scope.success.length)==$scope.activeMails.length){
                                    $scope.emailSent = true;
                                    $rootScope.loading = false;
                                    $timeout(function(){
                                        $scope.$apply()
                                    },1);
                                }
                            });
                        }
                    });
                });
            });
        }
        else{
            body = body.split('lalbadshah').join('<br/><img style = "max-width:100px;" src = "https://firebasestorage.googleapis.com/v0/b/rohit-mittal.appspot.com/o/img%2Fmail-image.jpg?alt=media&token=cd6bc719-2d52-4694-9dd8-095fb7a2e914"> <br/>')
            $scope.activeMails.map((email)=>{
                // console.log(email,$scope.users[email].active)
                $rootScope.loading = true;
                $timeout(function(){
                    $scope.$apply()
                },1);
                // debugger
                if(users[email].active==true){
                    // console.log(email)
                    Email.send({
                        Username : "Rohit",
                        SecureToken:"2064eea0-7018-408a-9823-50add40382b2",
                        To : email,
                        From : "contact@rohitmittal.in",
                        Bcc : "contact@rohitmittal.in",
                        Subject : subject,
                        Body : body.split(`\n`).join('<br/>'),
                    })
                    .then(function(message){
                        //alert("mail sent successfully")
                        if(message=='OK'){
                            $scope.success.push(email);
                            // $scope.body = '';
                            // $scope.subject = '';
                            // $scope.image = '';
                        }
                        else{
                            $scope.fails.push(email);
                        }
                        if(($scope.fails.length)+($scope.success.length)==$scope.activeMails.length){
                            $scope.emailSent = true;
                            $rootScope.loading = false;
                            $timeout(function(){
                                $scope.$apply()
                            },1);
                        }
                    });
                }
            });
        }
        
        
        
    };
    $scope.toggleReadMode = ()=>{
        $scope.emailSent = false;
        $scope.success=[];$scope.fails=[];
    }
    $scope.row = '';
    
    $scope.changeSuccess = (key,val,type) => {
        console.log(key,val,$rootScope);
        $scope.row=key;$scope.type=type;
        $rootScope.isSuccess='getSuccess';
        $timeout(function(){
            $scope.$apply()
        },1);
    }
    $scope.deleteRow = (email) => {
        let emails = $scope.emails;
        emails.splice(emails.indexOf(email),1)
        console.log(emails);
        $scope.emails = emails;
        db.collection("emailsSubscribes").doc("emails").update({
            emails:emails,
            users:$scope.users,
            uid:sessionStorage.uid||true
        }).then(function(docRef) {
            // window.location.reload();
            $rootScope.isSuccess='no';
            $timeout(function(){
                $scope.$apply()
            },1);
            console.log("Document written with ID: ", docRef.id,docRef);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }
    $scope.Unsubscribe = (email) => {
        let emails = $scope.users;
        emails[email].active = !emails[email].active;
        $scope.users = emails;
        db.collection("emailsSubscribes").doc("emails").update({
            emails:$scope.emails,
            users:emails,
            uid:sessionStorage.uid||true
        }).then(function(docRef) {
            // window.location.reload();
            $rootScope.isSuccess='no';
            $timeout(function(){
                $scope.$apply()
            },1);
            console.log("Document written with ID: ", docRef.id,docRef);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }
    $rootScope.$watch('isSuccess', (newVal,oldVal)=>{
        if(newVal!=oldVal){
            //$scope.isSuccess = !isSuccess;
            console.log($rootScope,$scope)
            if($rootScope.isSuccess === 'yes'){
                if($scope.type=='delete')
                $scope.deleteRow($scope.row);
                else if($scope.type=='active'){
                    $scope.Unsubscribe($scope.row);
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
    
    db.collection("emailsSubscribes").get().then(function(querySnapshot) {
        $scope.users = [];$scope.emails=[];
        querySnapshot.forEach(function(doc) {
            // console.log('email',doc.data())
            $scope.users = doc.data().users;$scope.emails=doc.data().emails;
            $timeout(function(){
                $scope.$apply()
            },1);
        });
    });
    // bkLib.onDomLoaded(function() {
        // $scope.myNicEditor = new nicEditor({iconsPath : './../img/nicEditorIcons.gif',
        // }).panelInstance(
        //     document.getElementById('area1')
        // )
        // $timeout(function(){
        //     $scope.$apply()
        // },1);
    // console.log($scope.myNicEditor)
    // })
    // bkLib.onDomLoaded(function() {
    //     $scope.myNicEditor = new nicEditor({iconsPath : './../img/nicEditorIcons.gif',
    //     }).panelInstance(
    //         document.getElementById('area1')
    //     )
    //     $timeout(function(){
    //         $scope.$apply()
    //     },1);
    // // console.log($scope.myNicEditor)
    // })

    setTimeout(function(){
        // bkLib.onDomLoaded(function() {
        $scope.myNicEditor =   new nicEditor({iconsPath : './../img/nicEditorIcons.gif',
        }).panelInstance(
            document.getElementById('area1')
        )
        $timeout(function(){
            $scope.$apply()
        },1);
        // debugger
    // })
},3000);
});