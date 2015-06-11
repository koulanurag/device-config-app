ngDevices.controller('deviceCtrl', ['$scope', '$timeout', 'deviceListFactory', 'sendDeviceConfigFactory',
    function ($scope, $timeout, deviceListFactory, sendDeviceConfigFactory) {


        $scope.showLoadError = false;
        $scope.showLoading = false;

        $scope.transducers=[{"id":1,"enable":false,"name":"","depth":"","recording":false,"view":false,"error":false},
					{"id":2,"enable":false,"name":"","depth":"","recording":false,"view":false,"error":false},
					{"id":3,"enable":false,"name":"","depth":"","recording":false,"view":false,"error":false},
					{"id":4,"enable":false,"name":"","depth":"","recording":false,"view":false,"error":false},
					{"id":5,"enable":false,"name":"","depth":"","recording":false,"view":false,"error":false},
					{"id":6,"enable":false,"name":"","depth":"","recording":false,"view":false,"error":false}
					];
	    $scope.transmitPowers=[12.5,100,200];//units is Watts
	    $scope.selectedTransmitPower=$scope.transmitPowers[0];//initialization
	    $scope.pingModes={"modes":['Sync','Auto'],"selectedMode":"Sync"};
	    $scope.pingInterval ={"min":100,"max":10000,"step":100,"value":100};

		$scope.disableSubmitButton=false;
        $scope.validateTransducerDetail = function(id){
            angular.forEach( $scope.transducers, function(value,key){
                if(value.id == id){
                    if (value.name =="" || value.depth==""){
                        value.enable=false;
                        value.error=true;
                        console.log("fill details..")
                    }
                    else {
                        value.error = false;
                    }

                }
            });
        }

        $scope.selectedTransducers=[];

        $scope.sendDeviceConfig = function(){
            console.log($scope.devices.selectedDevice)
            var selectedTransducers=[]
            var errorFlag=false
            angular.forEach( $scope.transducers, function(value,key){
                if(value.enable == true){
                   if (value.name=="" || value.depth==""){
                       value.error=true
                       errorFlag=true
                   }else{
                       selectedTransducers.push([value.name,value.depth,value.recording])
                       value.error=false
                   }

                }
                else {
                    value.error = false;
                }
            });

            console.log("sendDeviceConfig");
            console.log(selectedTransducers);

            if (!errorFlag) {

                if (selectedTransducers.length !== 0) {

                    $('#goToStatusButton')[0].click();

                    //testing hardcoded data
                    //$scope.deviceConfigStatus = [{
                    //    "transducers": [{ "software_channel": "1", "status": "recording", "hardware_channel": "1", "name": "H200202" },
                    //    { "software_channel": "2", "status": "enabled", "hardware_channel": "2", "name": "H200333" },
                    //    { "software_channel": "3", "status": "disabled", "hardware_channel": "3", "name": "H200612" }],
                    //    "echosounder": "4C:00:00:01"
                    //}];
                    //$scope.deviceConfigStatus = $scope.deviceConfigStatus[0];
                    //ends

                    $scope.showLoading = true;
                    sendDeviceConfigFactory.sendData($scope.devices.selectedDevice,$scope.selectedTransmitPower,$scope.pingModes.selectedMode,$scope.pingInterval,selectedTransducers, function (success) {

                        console.log("test");

                        if (success) {

                            $scope.showLoading = false;
                            $scope.deviceConfigStatus = sendDeviceConfigFactory.getStatus();
                            $scope.deviceConfigStatus = $scope.deviceConfigStatus[0];
                            console.log('success send');

                        } else {

                            $scope.showLoading = false;
                            $scope.showLoadError = true;
                            console.log('There was some error while retriving device config status')

                        }
                        $scope.$apply();//this should be here so, that even error cases get applied
                    });

                }
                else {
                    $scope.transducers[0].error = true;
                    console.log("Please select transducer..");
                }


            }

        }
        $timeout(function () {

            //this code should be uncommented when working with real data
            $scope.showLoading = true;  //shows loading symbol

            deviceListFactory.loadData(function (success) {

                if (success) {

                    $scope.showLoading = false;
                    $scope.deviceList = deviceListFactory.getData();
                    $scope.devices={"names":[],"selectedDevice":""}
                    angular.forEach($scope.deviceList, function(value, key) {
                        $scope.devices.names.push(Object.keys(value)[0]);
                    });
                    $scope.devices.selectedDevice =$scope.devices.names[0]

                } else {

                    $scope.showLoading = false;
                    $scope.showLoadError = true;
                    console.log("There was an error while retrieving device list");


                }
                $scope.$apply();    //this should be here so, that even error cases get applied

            });

                         //deviceListFactory.loadData()
                         //   .then(function (response) {
                         //       $scope.showLoading = false;
                         //       $scope.deviceList = deviceListFactory.getData();
                         //       $scope.devicesName=[]
                         //       angular.forEach($scope.deviceList, function(value, key) {
                         //           $scope.devicesName.push(Object.keys(value)[0]);
                         //       });
                         //       $scope.selectedDevice =$scope.devicesName[0]
                         //   }, function (response) {
                         //       $scope.showLoading = false;
                         //       $scope.showLoadError = true;
                         //       console.log("There was an error while retrieving device list");
                         //   });

            //------------following code just for testing

 /*          $scope.deviceList = [{ "Echosounder1": "4C:00:00:01" }, { "Echosounder2": "4C:00:00:02" }, { "Echosounder3": "4C:00:00:03" }]
            $scope.devicesName = []
            angular.forEach($scope.deviceList, function (value, key) {
                $scope.devicesName.push(Object.keys(value)[0]);
            });
            $scope.selectedDevice = $scope.devicesName[0]
            //-------------------*/
        });

    }]);