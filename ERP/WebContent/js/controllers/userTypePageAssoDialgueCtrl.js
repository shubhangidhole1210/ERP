erpApp.controller('userTypePageDialogCtrl',function($scope, $http, $mdDialog, $mdToast, $rootScope, SERVER_URL, utils, Auth, userTypePageAsso, $location, flag, action, information){
	 $scope.userTypePageAsso=userTypePageAsso;
	    $scope.flag=flag;
	    $scope.isReadOnly = action;
	    $scope.information = information;
	
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

	  $scope.saveUserTypePage=function(ev)
	    {
	    	 var data = {
	    			 page:$scope.userTypePageAsso.page.id,
	    			 usertype:$scope.userTypePageAsso.usertype.id
				};
	    	 
	    	 var httpparams = {};
	    	 if($scope.flag==0)
	    		 {
	    		    httpparams.method='post',
	    		    httpparams.url=SERVER_URL + "usertypepageassociation/create"
	    		    httpparams.headers = {
							auth_token : Auth.getAuthToken()
						};
	    		 }
	    	 else
	    		 {
	    		      data.id=$scope.userTypePageAsso.id,
	    		      httpparams.method='put',
	    		      httpparams.url=SERVER_URL + "usertypepageassociation/update"
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
								utils.showToast("Something went worng. Please try again later.");
							}else{
								$scope.displayProgressBar = false;
								utils.showToast(data.data.message);
								$rootScope.$emit("callPopulateUserTypePageAsso",{});
							}
						},
						function errorCallback(data) {
							$rootScope.$emit(
									"saveVendorError", {});
							console.log(data);
							$scope.hide();
							utils.showToast("Something went worng. Please try again later.");
						});
	    };

	    $scope.submitUserTypePageInformation = function(isvaliduser,$event) {
			if (isvaliduser) {
				$scope.saveUserTypePage($event);
			} else {
				console.log('its else block');
				utils.showToast("Please fill required information")
			}
		};
		
		 $scope.getUserType=function(){
			  var httpparams = {};
				httpparams.method = 'GET';
				httpparams.url = SERVER_URL + "usertype/list";
				httpparams.headers = {
						auth_token : Auth.getAuthToken()
					};
				$http(httpparams).then(function successCallback(response) {
						$scope.userTypes = response.data;

						console.log(response);

					}, function errorCallback(response) {
						console.log("Error");
					});
			    };
			    
			    $scope.getPage=function(){
			    	var httpparams = {};
					httpparams.method = 'GET';
					httpparams.url = SERVER_URL + "page/list";
					httpparams.headers = {
							auth_token : Auth.getAuthToken()
						};
					 $http(httpparams).then(function successCallback(response) {
							$scope.pages = response.data;
							console.log(response);
						}, function errorCallback(response) {
							console.log("Error");
						});
				    };
	
});