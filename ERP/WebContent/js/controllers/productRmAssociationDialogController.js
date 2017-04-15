erpApp.controller('productRmAssociationDialogController', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils,flag,action,information,productRmAsso) {
	  $scope.productRmAsso = productRmAsso;
	  $scope.orderRawMaterials = [];
	  $scope.orderRawMaterial = {};
	  $scope.flag = flag;
	  $scope.isReadOnly = action;
	  $scope.information = information;
	  $scope.hide = function() {
	      $mdDialog.hide();
	  };

	  $scope.cancel = function() {
	      $mdDialog.cancel();
	  };

	  $scope.answer = function(answer) {
	      $mdDialog.hide(answer);
	  };
	    
	  $scope.saveProductRMAssociationInfo = function() {
    	var data = {
    		product : $scope.productRmAsso.product.data.productId,
    		productRMAssociationModelParts: $scope.orderRawMaterials
		};
    	 
    	var httpparams = {};
    	if($scope.flag === 0){
    		httpparams.method = 'post';
 			httpparams.url = SERVER_URL + "productRMAsso/createmultiple";
 			httpparams.headers = {
 					auth_token : Auth.getAuthToken()
 			};
    	}else{
    		data.id=$scope.productRmAsso.id,
    		httpparams.method='put',
    		httpparams.url=SERVER_URL + "productRMAsso/update"
    		httpparams.headers = {
					auth_token : Auth.getAuthToken()
			};
    	}
    	 
    	httpparams.data = data;
    	
    	$http(httpparams).then(
			function successCallback(data) {
				$mdDialog.hide();
				console.log(data);
				if(data.data.code === 0){
					console.log(data.data.message);
					$rootScope.$emit(
							"saveVendorError", {});
					console.log(data);
					$scope.hide();
					utils.showToast('Something went worng. Please try again later.');
				}
				
				else{
					$scope.displayProgressBar = false;
					utils.showToast('Product RM Association Information saved successfully.');
					$rootScope.$emit("callPopulateProductRmAssociationList",{});
				}
			},
			function errorCallback(data) {
				$rootScope.$emit("saveVendorError", {});
				console.log(data);
				$scope.hide();
				utils.showToast('Something went worng. Please try again later.');
			});
    	 
    	};
	    
	    $scope.submitProductRMAssociationInformation = function(isvaliduser,$event) {
			if (isvaliduser) {
				$scope.saveProductRMAssociationInfo();
			} else {
				console.log('its else block');
			}

		};
	    
	   
	    $scope.deleteRM = function(index){
	    	console.log('in delete RM'+ $scope.orderRawMaterials)
	    	var lastItem = $scope.orderRawMaterials.length;
		    $scope.orderRawMaterials.splice(index,1);
	    };
		
		$scope.rawMaterialId = function(){
			
			var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL + "rawmaterial/list";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
			};
			$http(httpparams).then(function successCallback(response) {
				$scope.RMData = response.data;
				console.log(response);
			}, function errorCallback(response) {
				console.log("Error");
			})
			
		};
		 
	    $scope.addOrderRawMaterial = function(){
	    	console.log('Adding RM : ', $scope.orderRawMaterial);
	    	if( !angular.equals($scope.orderRawMaterial,{}) ){
	    		if(!$scope.isDuplicateRM($scope.orderRawMaterial)){
				   $scope.orderRawMaterials.push($scope.orderRawMaterial);	
				   $scope.orderRawMaterial = {};
				   $scope.productRMAssociationInformation.rawmaterial.$setValidity("message", true);
	    		}else{
	    			$scope.message = 'Already added this Rawmaterial';
					$scope.productRMAssociationInformation.rawmaterial.$setValidity("message", false);
	    		}
			}
	    };
		
		$scope.getProducts = function() {
			 var httpparams = {};
				httpparams.method = 'GET';
				httpparams.url = SERVER_URL + "product/list/newProductRMAssociation";
				httpparams.headers = {
						auth_token : Auth.getAuthToken()
				};
			 $http(httpparams).then(function successCallback(response) {
					$scope.data = response.data;
					$scope.products = response.data.data;
					console.log(response);
				}, function errorCallback(response) {
					console.log("Error");
				});
		};
		    
		$scope.addQuantity = function(quantity) {
			if (quantity <= 0) {
				console.log('if condition')
				$scope.message = 'quantity should be greater than 0';
				$scope.productRMAssociationInformation.quantity.$setValidity("message", false);
			} else {
				$scope.productRMAssociationInformation.quantity.$setValidity("message", true);
			}
		};
		
		$scope.isDuplicateRM = function(orderRawMaterial) {
			for (var i = 0; i < $scope.orderRawMaterials.length; i++) {
				if ($scope.orderRawMaterials[i].rawmaterial.id === orderRawMaterial.rawmaterial.id) {
					return true;
				}
			}
			return false;
		};
								
});