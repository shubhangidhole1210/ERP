erpApp		.controller(
				'RMVendorAssociationDialogCtrl',
				function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils,rmOrderAssociation,flag,action,title,dropdownAction,$timeout, $q, $log){
					$scope.isReadOnly = action;
					$scope.flag = flag;
					$scope.rmOrderAssociation = rmOrderAssociation;
					$scope.title = title;
					/*$scope.isRawMaterial = false;
					$scope.isVendor false;*/
					
					
					$scope.isDropDownreadOnly = dropdownAction;
					$scope.hide = function() {
						console.log('hide DialogController');
						$mdDialog.hide();
					};
					

					$scope.cancel = function() {
						$mdDialog.cancel();
					};

					$scope.answer = function(answer) {
						$mdDialog.hide(answer);
					};

					$scope.saveRMOrderAssociation = function() {
						var data = {
								rawmaterial:$scope.rmOrderAssociation.rawmaterial.id,
								vendor:$scope.rmOrderAssociation.vendor.id,
								pricePerUnit:$scope.rawmaterial.pricePerUnit
						};
						var httpparams = {};
						if ($scope.flag == 0) {
							console.log($scope.rmOrderAssociation);
							console.log($scope.data);
							httpparams.method = 'post';
							httpparams.url = SERVER_URL + "rmvendorasso/create";
							httpparams.headers = {
									auth_token : Auth.getAuthToken()
								};
						} else {
							console.log($scope.rmOrderAssociation);
							data.id = $scope.rmOrderAssociation.id;
							httpparams.method = 'put';
							httpparams.url = SERVER_URL + "rmvendorasso/update";
							httpparams.headers = {
									auth_token : Auth.getAuthToken()
								};
						}
						httpparams.data = data;
						$http(httpparams)
								.then(
										function successCallback(data) {
											$mdDialog.hide();
											console.log(data);
											if(data.data.code === 0){
												console.log(data.data.message);
												console.log(data);
												$scope.hide();
												utils.showToast('Something went worng. Please try again later.');
											}else if(data.data.code === 2){
												$scope.hide();
												$rootScope.$emit(
														"saveRMOrderAssociationError", {});
												utils.showToast(data.data.message);
											}
											
											else{
												console.log(data.data.message);
												$scope.displayProgressBar = false;
												utils.showToast('Raw Material Vendor Association Information saved successfully.');
												/*$rootScope.$emit(
														"saveRMOrderAssociationError", {});*/
												utils.hideProgressBar();
												$rootScope.$emit("CallPopulateRMVendorAssociationList",{});
											}
										},
										function errorCallback(data) {
											$rootScope.$emit(
													"saveRMOrderAssociationError", {});
											console.log(data);
											$scope.hide();
											utils.showToast('Something went worng. Please try again later.');
										});
					};

					$scope.submitRMVendorAssociationInformation = function(isvaliduser,$event) {
						if (isvaliduser) {
							$scope.saveRMOrderAssociation();
						} else {
							console.log('its else block');
							utils.showToast('Please fill all required information');
						}
					};
					
					    $scope.getRawMaterials=function(){
					    	var httpparams = {};
							httpparams.method = 'GET';
							httpparams.url = SERVER_URL + "rawmaterial/list";
							httpparams.headers = {
									auth_token : Auth.getAuthToken()
								};
							$http(httpparams).then(function successCallback(response) {
								$scope.rawmaterials = response.data;
								console.log("In get raw materials function $scope.rawmaterials is :",$scope.rawmaterials);
							}, function errorCallback(response) {
								console.log("Error");
							});
					    };
					    
					    
					    $scope.getPrice=function(){
					    	var httpparams = {};
							httpparams.method = 'GET';
							httpparams.url = SERVER_URL + "rawmaterial/" +$scope.rmOrderAssociation.rawmaterial.id;
							httpparams.headers = {
									auth_token : Auth.getAuthToken()
								};
							$http(httpparams).then(function successCallback(response) {
								$scope.rawmaterial = response.data;
								console.log("In get raw materials function $scope.rawmaterials is :",$scope.rawmaterial);
							}, function errorCallback(response) {
								console.log("Error");
							});
					    };
					    
				
					   $scope.getVendors=function(){
						   var httpparams = {};
							httpparams.method = 'GET';
							httpparams.url = SERVER_URL + "vendor/list";
							httpparams.headers = {
									auth_token : Auth.getAuthToken()
								};
							$http(httpparams).then(function successCallback(response) {
								$scope.venodrs = response.data;
								console.log(response);
							}, function errorCallback(response) {
								console.log("Error");
							});
					   };
					   
					  /* $scope.isRawMaterialPresent = function(){
						   $scope.isRawMaterial = $scope.rawmaterials.length === 0 ? true : false;
					   };
					   
					   $scope.isvendorPresent = function(){
						 $scope.isVendor = $scope.venodrs.length ===0? true:false;  
					   };*/
					   
//					   var self = this;

/*					   	$scope.simulateQuery = false;
					    $scope.isDisabled    = false;

					    $scope.states        = loadAll();
					    $scope.querySearch   = $scope.querySearch;
					    $scope.selectedItemChange = selectedItemChange;
					    $scope.searchTextChange   = searchTextChange;

					    $scope.newState = $scope.newState;

					    $scope.newState = function(state) {
					      alert("Sorry! You'll need to create a Constitution for " + state + " first!");
					    }
					    $scope.querySearch = function(query) {
					    	console.log('querySearch : ', query);
					    	
					      var results = query ? $scope.states.filter( createFilterFor(query) ) : $scope.states,
					          deferred;
					      if ($scope.simulateQuery) {
					        deferred = $q.defer();
					        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
					        return deferred.promise;
					      } else {
					        return results;
					      }
					    }

					    function searchTextChange(text) {
					      $log.info('Text changed to ' + text);
					    }

					    function selectedItemChange(item) {
					      $log.info('Item changed to ' + JSON.stringify(item));
					    }

					    function loadAll() {
					    	console.log("in load all function");
					    	
					      var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
					              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
					              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
					              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
					              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
					              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
					              Wisconsin, Wyoming';

					      return allStates.split(/, +/g).map( function (state) {
					        return {
					          value: state.toLowerCase(),
					          display: state
					        };
					      });
					    }

					    
					    
					    function createFilterFor(query) {
					      var lowercaseQuery = angular.lowercase(query);

					      return function filterFn(state) {
					        return (state.value.indexOf(lowercaseQuery) === 0);
					      };

					    }*/
});