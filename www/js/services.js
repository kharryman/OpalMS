angular.module('opal.services', [])


.service('OM', function($http, Network, Popup, $q, $state, Variables) {
  var BASE_API_URL = 'http://api.staging.centralvalleyautotrans.com';
  var BASE_API_URL2 = '/CVAT_API';
  var BASE_LFQ_URL = 'http://learnfactsquick.com';
  var BASE_LFQ_URL2 = '/LFQ';

  function buildUrlString(params) {
    var ret = [];
    for (var p in params)
    ret.push(encodeURIComponent(p) + '=' + encodeURIComponent(params[p]));
    return ret.join('&');
  }

  return {
    checkApiResult: function(message, res){
      //console.log("calling checkApiResult.");
      if (res && res.status && res.status < 400){
        return true;
      }
      else if (res && res.status && res.status >= 400 && res.data && (typeof res.data === "string" || res.data instanceof String)) {
        //THE res.data SHOULD BE AN ERROR IN HTML FORMAT(replace newlines with breaks):
        Popup.errorAPI(message + " API ERROR:", res.data.replace('\\n','<br />'));
        return false;
      }
      else if (res && res.status && res.status >= 400){
        Popup.errorAPI(message + " API ERROR", "STATUS: " + res.status);
        console.log(message + " API ERROR res=" + JSON.stringify(res));
        return false;
      }
      else if (res && res === 'offline'){
        console.log("offline.");
      }
      else if (typeof res === 'undefined'){
        console.log("checkApiResult res=undefined.");
        return false;
      }else{
        //The res OR res.status IS NULL:
        Popup.errorAPI(message + " API ERROR:", "NO RESULT.");
        return false;
      }
    },
    email: function(email, subject, message) {
      if (Network.checkNetwork()){
        var params = {email:email, subject:subject, message:message};
        var url = "/cvat/email.php";
        return $http({
          method: "POST",
          url: BASE_LFQ_URL + url,
          headers: headers,
          data: params,
          withCredentials: true,
        }).then(function(success){
          return success;
        },function(error){
          return $http.post(BASE_LFQ_URL2 + url, params).then(function(success){
            return success;
          },function(error){
            return error;
          });
        });
      }else{
        return Promise.resolve("offline");
      }
    },
    login: function(email, password){
        if (email=== "" && password == ""){
          console.log("going to store-purchase....");
          $state.go("store-purchase", {username:email.split("@")[0]});
        }
    },
    updateCustomer: function(id, params) {
      if (Network.checkNetwork()){
        var url = '/drivers/' + id + '?' + buildUrlString(params);
        console.log("updateDriver url=" + url);

        return $http.put(BASE_API_URL + url, {"headers":headers}).then( function(success){
          console.log("SUCCESS 1ST TRY!=" + JSON.stringify(success));
          return success;
        },function(error){
          return $http.put(BASE_API_URL2 + url, {"headers":headers}).then(function(success){
            return success;
          },function(error){
            return error;
          });
        });
      }else{
        return Promise.resolve("offline");
      }
    },
    upload: function(file, vehicleId) {
      if (Network.checkNetwork()){
        return $cordovaFileTransfer.upload(BASE_API_URL + "/vehicles/" + vehicleId + "/upload", file).then(function(success){
          return success;
        },function(error){
          return $cordovaFileTransfer.upload(BASE_API_URL2 + "/vehicles/" + vehicleId + "/upload", file).then(function(success){
            return success;
          },function(error){
            return error;
          });
        });
      }else{
        return Promise.resolve("offline");
      }
    }
  }
})


.service('Network', function($cordovaNetwork, Popup, Progress) {
  return {
    checkNetwork: function(){
      var ret = true;
      //      console.log("checkNetwork called");
      if (window.cordova) {//IF USING MOBILE DEVICE...
        try{
          if (this.isOffline()){
            ret = false;
            Popup.alert("NOT ONLINE", 3);
            Progress.hide();
          }else{
            if (navigator){
              if (navigator.onLine){
                ret = true;
              }
            }else{
              ret = false;
              Popup.alert("NOT ONLINE", 3);
              Progress.hide();
            }
          }
        }catch(e){
          ret = false;
          Popup.alert("NOT ONLINE", 3);
          Progress.hide();
        }
      }
      return ret;
    },
    getNetwork: function(){
      return $cordovaNetwork.getNetwork();
      //return "";
    },
    isOffline: function(){
      return $cordovaNetwork.isOffline();
      //return false;
    },
    isOnline: function(){
      return $cordovaNetwork.isOnline();
      //return true;
    }
  };
})
.service('Popup', function($ionicPopup, $timeout, $rootScope){
  return {
    alert : function(message,seconds) {
      var alertPopup = $ionicPopup.alert({
        title: 'ALERT',
        template: message
      });
      $timeout(function() {
        console.log("TIMING OUT....");
        alertPopup.close();
      }, seconds * 1000);
    },
    confirm: function(myTitle, myMessage){
      var confirm = $ionicPopup.confirm({
        title: myTitle,
        template: myMessage
      });
      return confirm;
    },
    confirmPlus: function(myTitle, subTitle, myMessage){
      var confirm = $ionicPopup.confirm({
        title: myTitle,
        subTitle: subTitle,
        template: myMessage
      });
      return confirm;
    },
    error: function(message) {
      $ionicPopup.alert({
        title: 'An Error has Occured',
        template: message
      });
    },
    errorAPI: function(title, errorHtml) {
      $ionicPopup.alert({
        title: title,
        template: errorHtml
      });
    },
    popup2: function(myTitle, mySubtitle, myMessage, option) {
      //FOR CUSTOM POPUPS:
      return $ionicPopup.show({
        title: myTitle,
        subTitle: mySubtitle,
        template: myMessage,
        buttons: [
          {text: 'Cancel'},
          {
            text: option,
            type: 'button-positive',
            onTap: function(e) {
              return true;
            }
          }
        ]
      });
    },
    popup: function(myTitle, mySubtitle, myMessage, option1, option2) {
      //FOR CUSTOM POPUPS:
      return $ionicPopup.show({
        title: myTitle,
        subTitle: mySubtitle,
        template: myMessage,
        buttons: [
          {
            text: 'Cancel',
            onTap: function(e) {
              return 0;
            }
          },
          {
            text: option1,
            type: 'button-positive',
            onTap: function(e) {
              return 1;
            }
          },
          {
            text: option2,
            type: 'button-positive',
            onTap: function(e) {
              return 2;
            }
          }
        ]
      });
    }
  };
})

.service('Progress', function($ionicLoading, $q, $timeout){
  return{
    alert: function(message, seconds){
      var deferred = $q.defer();
      $ionicLoading.show({
        template: '<img src="spinner.gif"></img><br />' + message
      });
      $timeout(function() {
        console.log("TIMING OUT....");
        $ionicLoading.hide();
        deferred.resolve(null);
      }, seconds * 1000);
      return deferred.promise;
    },
    hide: function(){
      $ionicLoading.hide();
    },
    show: function(message){
      var deferred = $q.defer();
      $ionicLoading.show({
        template: '<img src="spinner.gif"></img><br />' + message
      });
      $timeout(function() {
        //console.log("PROGRESS TIMING OUT....");
        $ionicLoading.hide();
        deferred.resolve(null);
      }, 10000);
      return deferred.promise;
    }
  };
})
