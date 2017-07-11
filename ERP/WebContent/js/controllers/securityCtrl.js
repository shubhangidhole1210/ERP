erpApp
		.controller(
				'securityCtrl',
				function($scope, $http, $mdDialog, $mdToast, $rootScope,
						SERVER_URL, $filter, utils, Auth, $location) {
					var date = new Date();
					$scope.createDate = $filter('date')(Date.now(),
							'MM-dd-yyyy');
					$scope.rmMsg = true;
					$scope.isClientselct=true;
					$scope.rmOrderCreationMsg  = false;
					$scope.createDate = new Date($scope.createDate);

					// TODO Setting Default for Testing Later It should be
					// removed
					$scope.driver_Name = "Sanjay";
					$scope.vehicleNo = "MH 12 AB 1212";
					$scope.intime = new Date();
					$scope.outtime = new Date();
					$scope.outtime.setTime($scope.intime.getTime()
							+ (15 * 60 * 1000));

					$scope.getRMInformation = function() {
						var httpparams = {};
						httpparams.method = 'GET';
						httpparams.url = SERVER_URL
								+ "rawmaterialorder/list/securityCheck";
						httpparams.headers = {
							auth_token : Auth.getAuthToken()
						};

						$http(httpparams).then(
								function successCallback(response) {
									$scope.rawMaterialOrders = response.data;
									$scope.rawMaterials = response.data;
									utils.hideProgressBar();
									console.log(response);
								}, function errorCallback(response) {
									console.log("Error");
									utils.hideProgressBar();
								});
						utils.showProgressBar();
					};

					$scope.getRMListForRMOrder = function(index) {
						console.log("Display RM List");
						var httpparams = {};
						httpparams.method = 'GET';
						httpparams.url = SERVER_URL
								+ "rawmaterialorderassociation/getRMForRMOrder/"
								+ $scope.selectedRMOrderId;
						httpparams.headers = {
							auth_token : Auth.getAuthToken()
						};
						$http(httpparams)
								.then(
										function successCallback(response) {
											console
													.log(
															"Raw Material Order  Association : ",
															response);
											$scope.rawMaterialList = response.data.data;
											if (response.data.code == 0) {
												utils
														.showToast(response.data.message);
											}
											console.log($scope.rawMaterialList)
											utils.hideProgressBar();
										}, function errorCallback(response) {
											console.log("Error");
											utils.hideProgressBar();
										});
						utils.showProgressBar();
					};

					$scope.displayStatusInformationList = function(index) {
						var httpparams = {};
						httpparams.method = 'GET';
						httpparams.url = SERVER_URL
								+ "rawmaterialorderinvoice/liststatus/"
								+ $scope.rawmaterialorderinvoice.id;
						httpparams.headers = {
							auth_token : Auth.getAuthToken()
						};
						$http(httpparams)
								.then(
										function successCallback(response) {
											$scope.statusInformationList = response.data;
											utils.hideProgressBar();
											console.log(response);
											console.log($scope.rawMaterialList)
										}, function errorCallback(response) {
											console.log("Error");
											utils.hideProgressBar();
										});
						utils.showProgressBar();
					};

					$scope.submitInformation = function(isvaliduser, $event) {
						if (isvaliduser) {
							$scope.saveSecurityInformation();
						} else {
							console.log('its else block');
							utils
									.showToast('Please fill all required information');
						}
					};

					$scope.saveSecurityInformation = function() {
						console.log('Saving saveSecurityInformation');
						var index = 0;
						var rmorderinvoiceintakquantities = [];
						for (index = 0; index < $scope.rawMaterialList.length; index++) {
							var rmorderinvoiceintakquantity = {};
							rmorderinvoiceintakquantity.rawmaterial = $scope.rawMaterialList[index].rawmaterial.id;
							rmorderinvoiceintakquantity.quantity = $scope.rawMaterialList[index].invoiceQuantity;
							rmorderinvoiceintakquantity.shortquantity = $scope.rawMaterialList[index].remainingQuantity;
							rmorderinvoiceintakquantity.isactive = true;
							rmorderinvoiceintakquantities
									.push(rmorderinvoiceintakquantity);
						}
						console.log('intime : ' + $scope.intime.getTime());
						console.log('out : ' + $scope.outtime.getTime());
						console.log('intime : '
								+ $scope.intime.toLocaleTimeString());
						console.log('out : '
								+ $scope.outtime.toLocaleTimeString());
						if ($scope.intime.getTime() < $scope.outtime.getTime()) {
							console.log('intime is lesser than outtime')
						} else {
							console.log('intime is greater than outtime')
						}
						var data = {
							invoice_No : $scope.invoice_No,
							vendorname : $scope.selectedVendor,
							vehicleNo : $scope.vehicleNo,
							firstName : $scope.firstName,
							lastName : $scope.lastName,
							licence_no : $scope.licence_no,
							description : $scope.description,
							createDate : $scope.createDate,
							intime : $scope.intime.toLocaleTimeString().split(
									" ")[0],
							outtime : $scope.outtime.toLocaleTimeString()
									.split(" ")[0],
							po_No : $scope.selectedRMOrderId,
							rmorderinvoiceintakquantities : rmorderinvoiceintakquantities
						};
						var httpparams = {
							method : 'post',
							url : SERVER_URL
									+ "rawmaterialorderinvoice/securitycheck",
							data : data
						};

						httpparams.headers = {
							auth_token : Auth.getAuthToken()
						};
						$http(httpparams)
								.then(
										function successCallback(data) {
											console.log(data.data.message);
											console.log(data);
											if (data.data.code === 1) {
												utils
														.showToast("Raw Material security check sucessfully !");
												$location.path('/');
											} else {
												utils
														.showToast(data.data.message);
											}
											utils.hideProgressBar();
										},
										function errorCallback(response) {
											console.log("Error");
											utils
													.showToast("Something went wrong. Please try again later.");
											utils.hideProgressBar();
										});
						utils.showProgressBar();
					};

					$scope.toCompareQuantity = function(remainingQuantity,
							invoiceQuantity) {
						console.log(remainingQuantity);
						console.log(invoiceQuantity)
						$scope.errorMsg = "";
						if (remainingQuantity >= invoiceQuantity) {
							console.log("Valid invoice quantity");
						} else {
							console.log("In-Valid invoice quantity");
						}
					};

					$scope.getVendorList = function() {
						var httpparams = {};
						httpparams.method = 'GET';
						httpparams.url = SERVER_URL + "vendor/list";
						httpparams.headers = {
							auth_token : Auth.getAuthToken()
						};
						$http(httpparams).then(
								function successCallback(response) {
									$scope.vendorData = response.data;
									console.log(response);
								}, function errorCallback(response) {
									console.log("Error");
								})
					};

					$scope.getRMOrdersForVendor = function(index) {
						$scope.rmMsg = false;
						$scope.isClientselct=false;
						var httpparams = {};
						httpparams.method = 'GET';
						httpparams.url = SERVER_URL
								+ "rawmaterialorder/getVendorOrder/"
								+ $scope.selectedVendor;
						httpparams.headers = {
							auth_token : Auth.getAuthToken()
						};
						$http(httpparams).then(
								function successCallback(response) {
									$scope.vendorRmList = response.data;
									console.log(response);
									$scope.displayRmOrderCreation();
								}, function errorCallback(response) {
									console.log("Error");
								})
					};
					
					
					$scope.displayRmOrderCreation = function(){
						if($scope.vendorRmList.length == 0){
							$scope.rmOrderCreationMsg  = true;
							$scope.isClientselct=true;
						}else{
							$scope.rmOrderCreationMsg  = false;
							$scope.isClientselct=false;
						}
					}
					

					$scope.restInformation = function() {
						$location.path('/');
					};
				});
