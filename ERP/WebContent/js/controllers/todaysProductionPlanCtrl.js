erpApp
		.controller(
				'todaysPlanCtrl',
				function($scope, $http, $mdDialog, $mdToast, $rootScope,
						SERVER_URL, Auth, utils, $location) {
					
					$scope.isTodaysProductionPlanPresent=false;
					$scope.isButton = false;
					$scope.currentDate = utils.getCurrentDate();
					
					$scope.getTodaysProductionPlan = function() {
						utils.showProgressBar();
						var httpparams = {};
						httpparams.method = 'GET';
						httpparams.url = SERVER_URL
								+ "productionplanning/getProductionPlanReadyListByDate/"
								+ $scope.currentDate;
						httpparams.headers = {
							auth_token : Auth.getAuthToken()
						};
						$http(httpparams).then(
								function successCallback(response) {
									utils.hideProgressBar();
									$scope.productList = response.data.data;
									if(response.data.code === 101){
										$scope.message = response.data.message;
									}
									console.log(response);
									$scope.isProductionPlanInformation();
								}, function errorCallback(response) {
									console.log("Error");
									utils.hideProgressBar();
								});
					};

					$scope.submitInformation = function(isvaliduser, $event) {
						if (isvaliduser) {
							$scope.saveTodaysProductionPlan();
						} else {
							console.log('its else block');
							utils.showToast('Please fill all required information');
						}
					};
					
					$scope.isProductionPlanInformation = function(){
						$scope.isTodaysProductionPlanPresent = $scope.productList.length === 0 ? true : false;
						$scope.isButton = $scope.productList.length === 0 ? false : true;
						console.log("$scope.productList: " ,$scope.productList);
					}
					
					$scope.saveTodaysProductionPlan = function() {
						var index = 0;
						var productinPlanDTOs = [];
						for (index = 0; index < $scope.productList.length; index++) {
							var product = {};
							product.productId = $scope.productList[index].product.id;
							product.targetQuantity = $scope.productList[index].targetQuantity;
							product.achivedQuantity = $scope.productList[index].achived;
							product.remark = $scope.productList[index].remark;
							product.failQuantity = $scope.productList[index].failQuantity;
							product.qualityPendingQuantity = $scope.productList[index].qualityPendingQuantity;
							product.productionPlanId = $scope.productList[index].id;
							productinPlanDTOs.push(product);
						}
						var data = {
							createDate : $scope.currentDate,
							productinPlanDTOs : productinPlanDTOs
						};
						var httpparams = {
							method : 'post',
							url : SERVER_URL
									+ "dailyproduction/dailyproductionSave",
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
														.showToast("Todays production Plan Update sucessfully!");
												$location.path('/');
											} else {
												utils
														.showToast("Something went wrong. Please try again later.");
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
					
					
					$scope.validateTargetQuantity = function(targetQuantity,achivedQuantity,failQuantity,qualityPendingQuantity,$index){
						console.log("targetQuantity :" ,targetQuantity);
						console.log("achivedQuantity :" ,achivedQuantity)
						console.log("failQuantity :" ,failQuantity)
						console.log("qualityPendingQuantity :" ,qualityPendingQuantity);
					}
					
					
					$scope.cancelTodaysProductionPlan=function(){
						$location.path('/');
					};
				});