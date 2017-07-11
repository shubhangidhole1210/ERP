	erpApp
		.controller(
				'stroresCtrl',
				function($scope, $http, $mdDialog, $mdToast, $rootScope,
						SERVER_URL, utils, Auth, $location) {
					
					$scope.ischeckBoxDisabled = true;
					$scope.isRawMaterial = false;
					$scope.isInvoicereadOnlye = false;
					document.getElementById('invoiceNumber').focus();
					
					$scope.getRMOrderInvoiceInformation = function(){
						console.log("in getRmOrderInformation function");
						var httpparams = {};
						httpparams.method = 'GET';
						httpparams.url = SERVER_URL
								+ "rawmaterialorderinvoice/quality-check-invoices";
						httpparams.headers = {
							auth_token : Auth.getAuthToken()
						};
						$http(httpparams).then(
								function successCallback(response) {
									$scope.invoiceList = response.data;
									$scope.rmInvoicePresent(); 
									console.log(response);
									utils.hideProgressBar();
								}, function errorCallback(response) {
									console.log("Error");
									utils.hideProgressBar();
								});
						utils.showProgressBar();
					};

					$scope.rmInvoicePresent = function(){
						if($scope.invoiceList.length ===0){
							$scope.isRawMaterial = true;
							$scope.isInvoicereadOnlye = true;
						}else{
							$scope.isRawMaterial = false;
							$scope.isInvoicereadOnlye = false;
						}
							
					};
					
					
					$scope.invoiceRawMaterialList = function(index) {
						var httpparams = {};
						httpparams.method = 'GET';
						httpparams.url = SERVER_URL
								+ "qualitycheckrawmaterial/listrmGoodQuantity/"
								+ $scope.invoiceList.id;
						httpparams.headers = {
							auth_token : Auth.getAuthToken()
						};
						$http(httpparams).then(
								function successCallback(response) {
									$scope.rmInvoiceList = response.data;
									console.log($scope.rmInvoiceList)
									console.log(response);
									utils.hideProgressBar();
								}, function errorCallback(response) {
									console.log("Error");
									utils.hideProgressBar();
								});
						utils.showProgressBar();
					};

					$scope.submitInformation = function(isvaliduser, $event) {
						if (isvaliduser) {
							$scope.saveQualityinspectionInformation();
						} else {
							console.log('its else block');
							utils.showToast('Please fill all required information');
						}
					};

					$scope.resetQualityInspection = function() {
						$location.path('/');
					};
					
					$scope.saveQualityinspectionInformation = function() {
						console.log('its save function');
						var index = 0;
						for (index = 0; index < $scope.rmInvoiceList.length; index++) {
							$scope.rmInvoiceList[index].intakeQuantity = $scope.rmInvoiceList[index].quantity;
						}
						var data = {
							description : $scope.description,
							id : $scope.invoiceList.id,
							qualitycheckrawmaterials : $scope.rmInvoiceList
						};
						var httpparams = {};
						httpparams.method = 'post';
						httpparams.url = SERVER_URL
								+ "qualitycheckrawmaterial/qualityCheckInReadyStore";
						httpparams.headers = {
							auth_token : Auth.getAuthToken()
						};
						httpparams.data = data;
						$http(httpparams)
								.then(
										function successCallback(data) {
											if (data.data.code === 1) {
												console.log(data.data.message);
												console.log(data);
												
												utils
														.showToast('Raw Material information store sucessfully!');
												/*utils.hideProgressBar();*/
											} else {
												console.log(data);
												utils
														.showToast('something went wrong please try again')
												/*utils.hideProgressBar();*/
											}
										},
										function errorCallback(response) {
											console.log("Error");
											utils.hideProgressBar();
											utils
													.showToast('something went wrong please try again')
										});
					/*	utils.showProgressBar();*/
						utils.showConfirm();
					};
				
					
				});
