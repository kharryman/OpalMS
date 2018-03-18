var headers = null;
var variables = null;

function getIndex(arr,prop,val){
  for (var i=0;i<arr.length;i++) {
    if (arr[i][prop] === val) return i;
  }
  return "FALSE";
}

function getRecord(arr,prop,val){
  if(arr != null){
    if(arr.length>0){
      if(arr[0][prop] != null){
        for (var i=0;i<arr.length;i++) {
          if (String(arr[i][prop]) === String(val)) return arr[i];
        }
        return "FALSE";
      }else{
        return "FALSE";
      }
    }else{
      return "FALSE";
    }
  }
  else{
    return "FALSE";
  }
}


function onPause () {
  console.log("onPause CALLED!");
}
function onResume () {
  console.log("onResume CALLED!");
}

function onDeviceReady () {
  console.log("onDeviceReady CALLED!");
  //var conn = checkConnection();
  //alert("conn=" + conn);
  device_ready = true;
  /*
  if (isApp()){
  openDB();
}
*/
}

function isApp(){
  return (window.cordova ? true : false);
}

function setPopupWidth(width){
  return new Promise(function(resolve,reject){
    var popup_eles1 = document.getElementsByClassName("popup-container");
    var popup_eles2 = document.getElementsByClassName("popup");
    if (popup_eles1 && popup_eles1!==null && popup_eles2 && popup_eles2!==null){
      for (var i=0;i<popup_eles1.length;i++){
        popup_eles1[i].style.width = width + 'px';
      }
      for (var i=0;i<popup_eles2.length;i++){
        popup_eles2[i].style.width = width + 'px';
      }
    }
    resolve(true);
  });
}

function getScreenWidth(screen_width, screen_height){
  return new Promise(function(resolve, reject){
    var width = 0;
    //
    console.log("getScreenWidth window.orientation=" + window.orientation);
    if (Math.abs(window.orientation) === 90){//LANDSCAPE:
      width = screen_width > screen_height ?  screen_width : screen_height;
      console.log("setting screen width as landscape=" + width);
    }else{
      width = screen_width < screen_height ?  screen_width : screen_height;
      console.log("setting screen width as portrait=" + width);
    }
    resolve(width);
  });
}


function isImageOk(img) {
  console.log("img.complete=" + img.complete + ", img.naturalWidth=" + img.naturalWidth);
  if (!img.complete) {
    return false;
  }
  if (img.naturalWidth === 0) {
    return false;
  }
  return true;
}


function initGoogle(){
  console.log("INIT GOOGLE CALLED!");
  isGoogleSet = true;
}
