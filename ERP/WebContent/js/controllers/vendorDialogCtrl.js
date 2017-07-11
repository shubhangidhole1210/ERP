erpApp.controller('DialogVendorController', function($scope,$http, $mdDialog,vendorUser,flag,action,$rootScope,$mdToast,information,Auth,utils,SERVER_URL) {
	  $scope.vendorUser=vendorUser;
	    $scope.flag=flag;
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
	    
	    $scope.saveVendorInfo=function(ev){
	    	 console.log($scope.data)
	    	 var data = {
	    		 companyName : $scope.vendorUser.companyName,
	    		 email: $scope.vendorUser.email,
	    		 firstName : $scope.vendorUser.firstName ,
	    		 lastName : $scope.vendorUser.lastName,
	    		 address : $scope.vendorUser.address, 
	    		 contactNumberMobile : $scope.vendorUser.contactNumberMobile,
	    		 contactNumberOffice: $scope.vendorUser.contactNumberOffice,
	    		 city : $scope.vendorUser.city,
	    		 state : $scope.vendorUser.state,
	    		 postalcode : $scope.vendorUser.postalcode,
	    		 description: $scope.vendorUser.description,
	    		 commisionerate: $scope.vendorUser.commisionerate,
	    		 cst: $scope.vendorUser.cst,
	    		 customerEccNumber: $scope.vendorUser.customerEccNumber,
	    		 divison: $scope.vendorUser.divison,
	    		 vatNo: $scope.vendorUser.vatNo,
	    		 renge: $scope.vendorUser.renge
				};
	    	 var httpparams = {};
	    	 if($scope.flag==0){
	    		    httpparams.method='post',
	    		    httpparams.url=SERVER_URL + "vendor/create"
	    		    httpparams.headers = {
	    					auth_token : Auth.getAuthToken()
	    				};
	    		 }
	    	 else{
	    		      data.id=$scope.vendorUser.id,
	    		      httpparams.method='put',
	    		      httpparams.url=SERVER_URL + "vendor/update"
	    		      httpparams.headers = {
		    					auth_token : Auth.getAuthToken()
		    				};
	    		 }
	    	 httpparams.data=data;
	    	 $http(httpparams)
	    	 .then(
						function successCallback(data) {
							$mdDialog.hide();
							console.log(data);
							if(data.data.code === 0){
								console.log(data.data.message);
								$rootScope.$emit(
										"saveVendorError", {});
								console.log(data);
								$scope.hide();
								$scope.message = 'Something went worng. Please try again later.';
								utils.showToast();
							}
							else if(data.data.code===2){
								console.log(data.data.message);
								$rootScope.$emit(
										"saveVendorError", {});
								console.log(data);
								$scope.hide();
								utils.showToast(data.data.message);
								}else{
								utils.showToast('Vendor Information saved successfully.');
								$rootScope.$emit("callPopulateVendorList",{});
							}
						},
						function errorCallback(data) {
							$rootScope.$emit(
									"saveVendorError", {});
							console.log(data);
							$scope.hide();
							$scope.hide();
							$scope.hide();
							utils.showToast('Something went worng. Please try again later.');
						});
	    };
	    
    		$scope.submitVendorInformation = function(isvaliduser,$event) {
			if (isvaliduser) {
				$scope.saveVendorInfo();
			} else {
				console.log('its else block');
				utils.showToast('Please fill all required information');
			}
		}
});