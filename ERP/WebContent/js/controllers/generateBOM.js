erpApp.controller('generateBomCtrl',function($scope, $mdDialog, $location,$rootScope,SERVER_URL,Auth,$http,utils){
	$scope.getProductList = function() {
		console.log($scope.rawMaterials);
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "productRMAsso/getProductList";
		httpparams.headers = {
			auth_token : Auth.getAuthToken()
		};
		$http(httpparams).then(
				function successCallback(response) {
					$scope.products = response.data.data;
					console.log(response);
					utils.hideProgressBar();
					if( response.data.code === 0){
						utils.showToast(response.data.message);
					}
				}, function errorCallback(response) {
					console.log("Error");
					utils.hideProgressBar();
				});
		utils.showProgressBar();
	};

	$scope.getRawMaterials = function() {
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL
				+ "productRMAsso/productRMAssoList/"
				+ $scope.product.id;
		httpparams.headers = {
			auth_token : Auth.getAuthToken()
		};
		$http(httpparams)
				.then(
						function successCallback(response) {
							$scope.data = response.data;
							$scope.productRMList = response.data.data;
							console.log(response);
							utils.hideProgressBar();
						}, function errorCallback(response) {
							console.log("Error");
							utils.hideProgressBar();
						});
		utils.showProgressBar();
	};

	$scope.getVenodrList = function(index,id) {
		console.log($scope.rawMaterials);
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL
				+ "rmvendorasso/rmVendorList/" + id;
		httpparams.headers = {
			auth_token : Auth.getAuthToken()
		};
		$http(httpparams).then(
				function successCallback(response) {
					$scope.productRMList[index].vendorList = response.data;
					console.log("$scope.vendorList",
							$scope.vendorList)
					console.log(response);
					utils.hideProgressBar();
				}, function errorCallback(response) {
					console.log("Error");
					utils.hideProgressBar();
				});
		utils.showProgressBar();
	};

	$scope.submitBomInformation = function(isvaliduser, $event) {
		console.log('submitBomInformation');
		if (isvaliduser) {
			$scope.saveBomData();
		} else {
			console.log('its else block');
			utils
					.showToast('Please fill all required information');
		}
	};

	$scope.caluculatePrice = function(vendorId,quantity1,$index) {
		console.log("in caluclate function")
		console.log("vendorId :" ,vendorId);
		console.log("quantity1 : " ,quantity1);
		console.log("$index : " ,$index);
			console.log('$scope.vendorList', $scope.vendorList)
			if(vendorId === vendorId){
				console.log("if condition")
				for (var i = 0; i < $scope.vendorList.length; i++) {
				$scope.data.data[$index].pricePerUnit = $scope.vendorList[i].pricePerUnit * quantity1;
			}
			}
	};

	$scope.duplicateRM = function(rawMaterialVendorList) {
		console.log("in duplicate RM function");
		console.log("$scope.rawMaterialVendorList",
				$scope.rawMaterialVendorList);
		for (var i = 0; i < $scope.rawMaterialVendorList.length; i++) {
			if ($scope.rawMaterialVendorList[i].rawmaterial === rawMaterialVendorList.rawmaterial) {
				return true;
			}
		}
		return false;
	};

	$scope.saveBomData = function() {
		console.log("in saveBomData function")
		console.log($scope.data.data);
		var index = 0;
		var rmVendorList = [];
		for (index = 0; index < $scope.productRMList.length; index++) {
			var rmVendor = {};
			rmVendor.rawmaterial = $scope.productRMList[index].rawmaterial.id;
			rmVendor.pricePerUnit = $scope.productRMList[index].price;
			rmVendor.quantity = $scope.productRMList[index].quantity;
			rmVendor.vendor = $scope.productRMList[index].vendor.vendor.id;
			rmVendorList.push(rmVendor)
		}
		var data = {
			product : $scope.product.id,
		/*	bomId : $scope.bomId,*/
			bomModelParts : rmVendorList
		};
		var httpparams = {
			method : 'post',
			url : SERVER_URL + "bom/createmultiple",
			data : data
		};
		httpparams.headers = {
			auth_token : Auth.getAuthToken()
		};
		$http(httpparams).then(
			function successCallback(data) {
				console.log(data);
				if (data.data.code === 1) {
					utils.showToast(data.data.message);
					showConfirm();
				} else {
					utils.showToast(data.data.message);
					showConfirm();
				}
			},
			function errorCallback(response) {
				console.log("Error",response);
				utils.showToast("Something went wrong. Please try again later.");
			});
		
	};
	
	function showConfirm(ev){
		var confirm = $mdDialog.confirm().title('You want to download PDF for generating BOM')
		.ariaLabel('').targetEvent(ev).ok('YES' ).cancel('NO');

$mdDialog.show(confirm)
		.then(function() {
			$location.path('/getPdf');
		}, function() {});
	};
	
	$scope.onRawMaterialQuantityChange = function(index, quantity, pricePerUnit){
		console.log('onRawMaterialQuantityChange : ');
		$scope.productRMList[index].price = pricePerUnit * quantity;
		console.log('Price : ', $scope.productRMList[index].price);
	};
	
	$scope.cancelBomForm = function(){
		$location.path('/home');
	};
	
});