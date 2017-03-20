erpApp.controller('rmOrderDialogCtrl', function($scope,$http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,flag,action,title,rmOrder,utils){
	$scope.isReadOnly = action;
	$scope.flag = flag;
	$scope.rmOrder = rmOrder;
	$scope.title = title;
	$scope.rmOrder.expectedDeliveryDate = new Date($scope.rmOrder.expectedDeliveryDate);
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

	$scope.saveRMOrder = function(ev) {
		
		
		var data = {
				rawmaterialorderassociations:$scope.orderRawMaterials,
				name:$scope.rmOrder.name,
				description:$scope.rmOrder.description,
				quantity:$scope.rmOrder.quantity,
				expectedDeliveryDate:$scope.rmOrder.expectedDeliveryDate,
				vendor:$scope.selectedVendor,
				totalprice:$scope.rmOrder.totalprice,
				tax:$scope.rmOrder.tax,
				otherCharges:$scope.rmOrder.otherCharges,
				actualPrice:$scope.rmOrder.actualPrice
		};
		var httpparams = {};
		if ($scope.flag == 0) {
			console.log($scope.rmOrder);
			console.log($scope.data);
			httpparams.method = 'post';
			httpparams.url = SERVER_URL + "rawmaterialorder/createmultiple";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
		} else {
			console.log($scope.rmOrder);
			data.id = $scope.rmOrder.id;
			httpparams.method = 'put';
			httpparams.url = SERVER_URL + "rawmaterialorder/update";
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
								$rootScope.$emit(
										"saveRMOrderError", {});
								console.log(data);
								$scope.hide();
								utils.showToast('Something went worng. Please try again later.');
								
							}else{
								$scope.displayProgressBar = false;
								/*$scope.message = 'Raw Material Order Created successfully.';
								$scope.showToast();*/
								utils.showToast('Raw Material Order Created successfully.');
								$rootScope.$emit("CallPopulateRMOrderList",{});
							}
						},
						function errorCallback(data) {
							$rootScope.$emit(
									"saveRMOrderError", {});
							console.log(data);
							$scope.hide();
							utils.showToast('Something went worng. Please try again later.');
						});

	}

	$scope.submitRMOrderInformation = function(isvaliduser,$event) {
		if (isvaliduser) {
			/*utils.showProgressBar();*/
			$scope.saveRMOrder();
			
		} else {
			console.log('its else block');
		}

	}

	
	
	
	$scope.vendorRmList=function(index)
	{
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "rawmaterial/getRMaterial/"+$scope.selectedVendor;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		
		$http(httpparams).then(function successCallback(response) {
			$scope.vendorRmList = response.data;

			console.log(response);

		}, function errorCallback(response) {
			console.log("Error");

		})
	};
	
	$scope.displayVendorId=function()
	{
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "vendor/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		
		$http(httpparams).then(function successCallback(response) {
			$scope.vendorData = response.data;

			console.log(response);

		}, function errorCallback(response) {
			console.log("Error");

		})
	};
	
	
	 $scope.orderRawMaterials=[];
	    $scope.orderRawMaterial={isActive : true};
	    $scope.addOrderRawMaterial=function(){
	    	if(!angular.equals($scope.orderRawMaterial,{})){
				   $scope.orderRawMaterials.push($scope.orderRawMaterial);	
				   $scope.orderRawMaterial = {isActive : true};
				   console.log($scope.orderRawMaterials);
			}
	    	/*$scope.isDuplicateRM();*/
	    };
	
	$scope.isDuplicateRM=function()
	{
		  console.log($scope.orderRawMaterials)
		var i;
		var j;
						for (i = 0; i < $scope.orderRawMaterials.length; i++) {
							for (j = 0; i < $scope.orderRawMaterials.length; j++) {
								if (i != j) {
									if ($scope.orderRawMaterials[i].id == $scope.orderRawMaterials[j].id) {
										$scope.orderRawMaterials = $scope.orderRawMaterials.splice(j,1);
										return true;
									}
								}
							}
						}
						return false;
	}
	    
	    $scope.deleteRM=function(index)
	    {
	    	console.log('in delete RM'+ $scope.orderRawMaterials)
	    	var lastItem = $scope.orderRawMaterials.length;
		    $scope.orderRawMaterials.splice(index,1);
	    }
});