angular.module('opal.factories', [])
.filter('formattedTime', function() {
  return function(x) {
    return moment(x).utcOffset(timeZoneMins).format("MM/DD/YYYY h:mm:ss A");
  };
})
.filter('phonenumber', function() {
  /*
  Format phonenumber as: c (xxx) xxx-xxxx
  or as close as possible if phonenumber length is not 10
  if c is not '1' (country code not USA), does not use country code
  */

  return function (number) {
    /*
    @param {Number | String} number - Number that will be formatted as telephone number
    Returns formatted number: (###) ###-####
    if number.length < 4: ###
    else if number.length < 7: (###) ###

    Does not handle country codes that are not '1' (USA)
    */
    if (!number) { return ''; }

    number = String(number);

    // Will return formattedNumber.
    // If phonenumber isn't longer than an area code, just show number
    var formattedNumber = number;

    // if the first character is '1', strip it out and add it back
    var c = (number[0] == '1') ? '1 ' : '';
    number = number[0] == '1' ? number.slice(1) : number;

    // # (###) ###-#### as c (area) front-end
    var area = number.substring(0,3);
    var front = number.substring(3, 6);
    var end = number.substring(6, 10);

    if (front) {
      formattedNumber = (c + "(" + area + ") " + front);
    }
    if (end) {
      formattedNumber += ("-" + end);
    }
    return formattedNumber;
  };
})
.factory('Bol', function($rootScope, $window, Popup, CVATApi) {
  var bol = {};
  function declineVehicle(bol, vehicle) {
    return new Promise(function(resolve, reject) {
      Popup.confirm('Decline Vehicle', 'Are you sure you want to decline vehicle VIN# ' + vehicle.vin)
      .then(function(res) {
        if (res) {
          var params = {bol_id: bol.id, vehicle_id: vehicle.id};
          CVATApi.removeVehicleFromBol(params).then(function(res) {
            if (CVATApi.checkApiResult("Remove Vehicle", res)){
              return resolve({status: 'removed'})
            }else{
              return reject();
            }
          })
        } else {
          return reject();
        }
      });
    });
  }
  function filterDeclinedBols(bol) {
    console.log("bol.date_deleted=" + bol.date_deleted);
    return bol.date_deleted === null || bol.date_deleted === undefined;
  }
  function get() {
    if (Object.keys(bol).length === 0) {
      return $window.localStorage.getItem('bol');
    } else {
      return bol;
    }
  }
  function set(data) {
    console.log('Inside set');
    bol = data;
    $window.localStorage.setItem('bol', JSON.stringify(bol));

    if ($rootScope.hasOwnProperty('bols')) {
      $rootScope.bols.push(bol);
    } else {
      $rootScope.bols = [];
      $rootScope.bols.push(bol);
    }
    console.log('Finishing setting BOL');
  }
  return {
    set: set,
    get: get,
    declineVehicle: declineVehicle,
    filterDeclinedBols: filterDeclinedBols
  }
})

.factory('Driver', function($rootScope,$window) {
  var driver_locations = [];
  if ($window.localStorage.getItem('driver_locations') == null){
    $window.localStorage.setItem('driver_locations', JSON.stringify(driver_locations));
  }else{
    driver_locations = JSON.parse($window.localStorage.getItem('driver_locations'));
  }
  function get() {
    $rootScope.driver = JSON.parse($window.localStorage.getItem('driver'));
    return $rootScope.driver;
  }
  function getLocation() {
    console.log('Getting coordinates');
    var location = JSON.parse($window.localStorage.getItem('driver_location'));
    $rootScope.driver.coordinates = location.coordinates;
    $rootScope.driver.address = location.address;
    console.log("get location = " + JSON.stringify(location));
    return location;
  }
  function logout() {
    this.set(null);
    $window.localStorage.removeItem('driver');
  }
  function set(data) {
    $window.localStorage.setItem('driver', JSON.stringify(data));
  }
  function setLocation(location) {
    if (typeof $rootScope.driver !== 'undefined'){
      $rootScope.driver.location_found = location.location_found;
      $rootScope.driver.address = location.address;
      $rootScope.driver.coordinates = location.coordinates;
      $window.localStorage.setItem('driver_location', JSON.stringify(location));
    }
  }
  function pushLocation(location) {
    driver_locations.push(location);
    console.log("#driver_locations=" + driver_locations.length);
    $window.localStorage.setItem('driver_locations', JSON.stringify(driver_locations));
  }
  return {
    get: get,
    logout: logout,
    set: set,
    setLocation: setLocation,
    getLocation: getLocation,
    pushLocation: pushLocation
  }
})

.factory('$ImageCacheFactory', function($q) {
    return {
        Cache: function(urls) {
            if (!(urls instanceof Array))
                return $q.reject('Input is not an array');

            var promises = [];

            for (var i = 0; i < urls.length; i++) {
                var deferred = $q.defer();
                var img = new Image();

                img.onload = (function(deferred) {
                    return function(){
                        deferred.resolve();
                    }
                })(deferred);

                img.onerror = (function(deferred,url) {
                    return function(){
                        deferred.reject(url);
                    }
                })(deferred,urls[i]);

                promises.push(deferred.promise);
                img.src = urls[i];
            }

            return $q.all(promises);
        }
    }
})


.factory('Location', function() {
  var Location = function(location) {
    this.name = "",
    this.street_address = "",
    this.city = "",
    this.state = "",
    this.zip = "",
    this.non_us_address = "",
    this.country = 'United States',
    this.countries = ['United States', 'Mexico', 'Canda', 'Europe'];
    this.type = 'Business';
    this.types = ['Business', 'Residence'];
    this.residence = "",
    this.contact = "",
    this.phone = "",
    this.altphone = "",
    this.cell = "",
    this.fax = "",
    this.email = "",
    this.addl_info_1 = "",
    this.addl_info_2 = "",
    this.preferences = {}
  };
  return {
    getLocation: function() {
      return new Location(location);
    },
    getNewLocation: function() {
      return new Location();
    }
  }
})

.factory('Variables', function($window) {
  //$window.localStorage.removeItem('variables');
  variables = JSON.parse($window.localStorage.getItem('variables'));
  if (variables == null){
    $window.localStorage.setItem('variables', JSON.stringify([]));
    variables = [];
  }else{
    console.log("variables=" + JSON.stringify(variables));
    var bad_index1 = getIndex(variables, "key", "undefined_VERIFIED");
    if ( bad_index1 !== "FALSE"){
      variables.splice(bad_index1,1);
    }
  }
  return{
    delete: function(key){
      var index = getIndex(variables,"key",key);
      if (index!=="FALSE"){
        variables.splice(index, 1);
        $window.localStorage.setItem('variables', JSON.stringify(variables));
      }
      else{
        console.log("VARIABLES KEY," + key + ", DOES NOT EXIST.");
      }
    },
    get: function(key){
      var index = getIndex(variables,"key",key);
      if (index!=="FALSE"){
        return variables[index].variable;
      }
      else{
        return null;
      }
    },
    set: function(key,variable){
      var index = getIndex(variables,"key",key);
      if (index==="FALSE"){
        variables.push({key:key,variable:variable});
      }
      else{
        variables[index].variable = variable;
      }
      $window.localStorage.setItem('variables', JSON.stringify(variables));
    }
  };
})

.factory('Vehicle', function() {
  var Vehicle = function(params) {
    if (params === undefined) { params = {};}
    this.vin = params.vin || "",
    this.year = params.year || "",
    this.make = params.make || "",
    this.model = params.model || "",
    this.notes = "",
    this.verified = false,
    this.move_type =  "",
    this.important =  'NO';
    this.important_choices = ['NO', 'YES'];
    this.move_reason = 'OTHER_TO_OTHER';
    this.move_types = ['GENERAL', 'OTHER_TO_OTHER', 'STORE_TO_STORE', 'STORE_TO_OTHER', 'OTHER_TO_STORE'];
    this.promised_date = params.promised_date || null;
  };
  return {
    getNewVehicle: function(params) {
      return new Vehicle(params);
    }
  }
})


//FOR SETTING AND GETTING VEHICLES SCANNED...
.factory('VehiclesPictures', function($q, $window) {
  var pic_arr = [];
  var pic_arr_str = "";
  var currentUrl = "";
  $window.localStorage.setItem("vehicles_before_pictures",null);
  $window.localStorage.setItem("vehicles_after_pictures",null);
  return {
    deletePicture: function(is_before,vin,urlIndex){
      var self = this;
      var deferred = $q.defer();
      pic_arr_str = (is_before ? 'vehicles_before_pictures' : 'vehicles_after_pictures');
      db.executeSql("DELETE FROM " + pic_arr_str + " WHERE vin=? AND urlIndex=?",[vin,urlIndex],
      function(rs){
        console.log(rs.rowsAffected + " PICTURES DELETED.");
        self.getPictures(is_before,vin).then(function(pics){
          deferred.resolve(pics);
        });
      },function(error){
        console.log("DELETE ERROR " + error.message);
        deferred.resolve(null);
      }
    );
    return deferred.promise;
  },
  getPictures: function(is_before,vin) {
    var deferred = $q.defer();
    pic_arr_str = (is_before ? 'vehicles_before_pictures' : 'vehicles_after_pictures');
    console.log("getPictures called., is_before=" + is_before + ", pic_arr_str=" + pic_arr_str + ", vin=" + vin);
    urls_arr = [];
    var sql_str = "SELECT * FROM " + pic_arr_str + " WHERE vin=?";
    if (db !== null){
      db.executeSql(sql_str, [vin],
        function(rs) {
          console.log("SELECT " + pic_arr_str + " PICTURES SUCCESSFUL!")
          for (var i=0;i<rs.rows.length;i++){
            console.log('Got result: urlIndex(' + i + ')=' + rs.rows.item(i).urlIndex);
            urls_arr.push({urlIndex: rs.rows.item(i).urlIndex, url:rs.rows.item(i).url, currentUrl:rs.rows.item(i).currentUrl});
          }
          console.log("urls_arr length=" + urls_arr.length);

          deferred.resolve(urls_arr);
        },function(error){
          console.log("SELECT PICTURES ERROR: " + error.message);
          deferred.resolve([]);
        }
      );
    }
    else{
      deferred.resolve([]);
    }
    return deferred.promise;
  },
  insert: function(is_before,vin,url,nextUrlIndex) {
    var deferred = $q.defer();
    var self = this;
    pic_arr_str = (is_before ? 'vehicles_before_pictures' : 'vehicles_after_pictures');
    db.executeSql("INSERT INTO " + pic_arr_str + "(urlIndex, vin, url, currentUrl) VALUES (?,?,?,?)", [nextUrlIndex, vin, encodeURI(url), encodeURI(url)],
    function(resultSet){
      console.log("INSERT SUCCESSFUL! #rows afected=" + resultSet.rowsAffected);
      self.getPictures(is_before,vin).then(function(pics){
        deferred.resolve(pics);
      });
    },
    function(error) {
      console.log('INSERT PICTURE ERROR: ' + error.message);
      deferred.resolve(null);
    }
  );
  return deferred.promise;
},
save: function(is_before,vin,currentUrl,currentUrlIndex) {
  pic_arr_str = (is_before ? 'vehicles_before_pictures' : 'vehicles_after_pictures');
  db.executeSql("UPDATE " + pic_arr_str + " SET currentUrl=? WHERE vin=? AND urlIndex=?", [encodeURI(currentUrl), vin, currentUrlIndex],
  function(resultSet){
    console.log("UPDATE SUCCESSFUL! #rows afected=" + resultSet.rowsAffected);
  },
  function(error) {
    console.log('UPDATE PICTURE ERROR: ' + error.message);
  });
}
};
})

//FOR SETTING AND GETTING VEHICLES SCANNED...
.factory('VehiclesScanned', function() {
  var vehicles_scanned = [];
  return {
    isScanned: function(vin) {
      //console.log("getNotes called, vin=" + vin);
      if (getIndex(vehicles_scanned,"vin",vin)!=="FALSE"){
        console.log("get scanned=true");
        return true;
      }
      else{
        //console.log("get scanned=false");
        return false;
      }
    },
    remove: function(vin) {
      if (getIndex(vehicles_scanned,"vin",vin)!=="FALSE"){
        console.log("Removing Vehicle Scanned vin=" + vin);
        var index = getIndex(vehicles_scanned,"vin",vin);
        vehicles_scanned.splice(index,1);
      }
    },
    setVehicleScanned: function(vehicle_scanned) {
      if (getIndex(vehicles_scanned,"vin",vehicle_scanned.vin)==="FALSE"){
        vehicles_scanned.push(vehicle_scanned);
        console.log("pushing vehicles_scanned");
      }
    }
  }
})
