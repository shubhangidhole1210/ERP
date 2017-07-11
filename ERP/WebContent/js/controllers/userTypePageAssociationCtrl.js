erpApp.controller('userTypePageAssoCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth) {
	$scope.isVendorPredent =false;
	$scope.userTypePageAsso={};
	$rootScope.$on("callPopulateUserTypePageAsso", function() {
		$scope.populateuserTeypePageAsso();
	});
	$rootScope.$on("saveVendorError", function() {
		$scope.showAddNewUserTypePage()
	});
	
	
	$scope.populateuserTeypePageAsso=function(){
		 $scope.currentPage = 0;
	     $scope.pageSize = 15;
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "usertypepageassociation/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
				$scope.data = response.data;
				$scope.isVendorInformation();
				$scope.userTypePageAssociations = response.data;
				$mdDialog.hide();
				console.log(response);

			}, function errorCallback(response) {
				$scope.showToast();
				$scope.message = "We are Sorry. Something went wrong. Please try again later."
				console.log("Error");
				$mdDialog.hide();
			});
		 $scope.showProgressBarOne();
	}
	
	$scope.showToast = function() {
		$mdToast.show({
			hideDelay : 3000,
			position : 'top right',
			controller : 'ToastCtrl',
			templateUrl : 'views/toast.html',
			locals : {
				message : $scope.message
			}
		});
	};
	 
	$scope.isVendorInformation=function(){
		if($scope.data.length==0){
			$scope.isVendorPredent =true;
		}else{
			$scope.isVendorPredent =false;
		}
	};
	
	$scope.showProgressBarOne= function()
	{
		$mdDialog
		.show(
				{
					controller : ProgressBarController,
					templateUrl : 'views/progressBar.html',
					parent : angular
							.element(document.body),
					clickOutsideToClose : false,
					fullscreen : $scope.customFullscreen,
					onComplete : function() {
					}
				})
		.then(
				function(answer) {
					$scope.status = 'You said the information was "'
							+ answer + '".';
				},
				function() {
					$scope.status = 'You cancelled the dialog.';
				});
	};
	
	$scope.showAddNewUserTypePage = function(ev) {
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.information="ADD NEW USER TYPE PAGE ASSOCIATION";
		$scope.userTypePageAsso={};
		var abc = {
			controller : DialogVendorController,
			templateUrl : 'views/userTypePageAssociationDialogue.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : false,
			onRemoving : function(){console.log('Removing user dialog');},
			fullscreen : $scope.customFullscreen,
			locals : {
				userTypePageAsso : $scope.userTypePageAsso,
				flag : $scope.flag,
				action : $scope.isReadOnly,
				information : $scope.information
			}
		};
		$mdDialog
				.show(abc)
				.then(
						function(answer) {
							$scope.status = 'You said the information was "'
									+ answer + '".';
						},
						function() {
							$scope.status = 'You cancelled the dialog.';
						});
	  };
	  function DialogVendorController($scope, $mdDialog,userTypePageAsso,flag,action,$rootScope,$mdToast,information,utils) {
		    $scope.userTypePageAsso=userTypePageAsso;
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
									$scope.message = 'Something went worng. Please try again later.';
									$scope.showToast();
								}else{
									$scope.message = 'User Page Type Information saved successfully.';
									$scope.showToast();
									$rootScope.$emit("callPopulateUserTypePageAsso",{});
								}
							},
							function errorCallback(data) {
								$rootScope.$emit(
										"saveVendorError", {});
								console.log(data);
								$scope.hide();
								$scope.message = 'Something went worng. Please try again later.';
								$scope.showToast();
							});
		    }
		    
		    $scope.showToast = function() {
				$mdToast.show({
					hideDelay : 3000,
					position : 'top right',
					controller : 'ToastCtrl',
					templateUrl : 'views/toast.html',
					locals : {
						message : $scope.message
					}
				});
			};
			
			$scope.submitUserTypePageInformation = function(isvaliduser,$event) {
				if (isvaliduser) {
					$scope.showProgressBar($event);
				} else {
					console.log('its else block');
					utils.showToast("Please fill required information")
				}
			}
		    
		    $scope.showProgressBar = function(ev) {
				$scope.displayProgressBar = true;
				$mdDialog
						.show(
								{
									controller : ProgressBarController,
									templateUrl : 'views/progressBar.html',
									parent : angular
											.element(document.body),
									targetEvent : ev,
									clickOutsideToClose : false,
									fullscreen : $scope.customFullscreen,
									onComplete : function() {
										$scope.saveUserTypePage(ev);
									}
								})
						.then(
								function(answer) {
									$scope.status = 'You said the information was "'
											+ answer + '".';
								},
								function() {
									$scope.status = 'You cancelled the dialog.';
								});
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
		  };
	  
	  $scope.editUserTypePage = function(ev , $index) {
		  $scope.flag = 1;
		  $scope.isReadOnly = false;
		  $scope.userTypePageAsso = $scope.userTypePageAssociations[($scope.currentPage*$scope.pageSize) + ($index)];
		  $scope.information="EDIT USER TYPE PAGE ASSOCIATION"
		    $mdDialog.show({
		      controller: DialogVendorController,
		      templateUrl: 'views/userTypePageAssociationDialogue.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:false,
		      fullscreen: $scope.customFullscreen ,
		      locals : {
		    	  userTypePageAsso : $scope.userTypePageAsso,
		    	  flag : $scope.flag,
		    	  action : $scope.isReadOnly,
		    	  information : $scope.information
				}
		    })
		    .then(function(answer) {
		      $scope.status = 'You said the information was "' + answer + '".';
		    }, function() {
		      $scope.status = 'You cancelled the dialog.';
		    });
		  };
	  
	  $scope.deleteUserTypePage = function(index) {
			console.log($scope.vendoUser);
			var httpparams = {};
			httpparams.method = 'delete';
			httpparams.url = SERVER_URL + "usertypepageassociation/delete/" +  $scope.userTypePageAssociations[index].id;
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
			$http(httpparams).then(function successCallback(data) {
						$mdDialog.hide();
						$rootScope.$emit("callPopulateUserTypePageAsso", {});
				console.log(data);
			}, function errorCallback(data) {
				console.log("Error");
			});
			$scope.showProgressBarOne();
		};
		
		$scope.viewUserTypePage = function(ev, $index) {
			$scope.flag = 2;
			$scope.isReadOnly = true;
			$scope.userTypePageAsso = $scope.userTypePageAssociations[($scope.currentPage*$scope.pageSize) + ($index)];
			$scope.isSaving = false;
			$scope.information="VIEW USER TYPE PAGE ASSOCIATION"
			console.log($scope.user);
			$mdDialog.show({
						controller : DialogVendorController,
						templateUrl : 'views/userTypePageAssociationDialogue.html',
						parent : angular.element(document.body),
						targetEvent : ev,
						clickOutsideToClose : false,
						fullscreen : $scope.customFullscreen,
						locals : {
							  userTypePageAsso : $scope.userTypePageAsso,
							flag : $scope.flag,
							action : $scope.isReadOnly,
							information : $scope.information
						}
					})
					.then(
							function(answer) {
								$scope.status = 'You said the information was "'
										+ answer + '".';
							},
							function() {
								$scope.status = 'You cancelled the dialog.';
							});
		};
		
		$scope.showConfirm = function(ev,$index) {
			var confirm = $mdDialog.confirm().title(
					'Are you sure you want to Delete User Type Page Information?')
					.ariaLabel('Lucky day').targetEvent(ev).ok(
							'Delete' ).cancel('Cancel');
			$mdDialog
					.show(confirm)
					.then(
							function() {
								$scope.status = 'You decided to get rid of your debt.';
								$scope.deleteUserTypePage(($scope.currentPage*$scope.pageSize) + ($index));
								$scope.message = 'Delete User Type Page Record sucessfully';
								$scope.showToast();
							},
							function() {
								$scope.status = 'You decided to keep your debt.';
							});
		};
		
		function ProgressBarController($scope, $mdDialog) {
			$scope.hide = function() {
				$mdDialog.hide();
			};

			$scope.cancel = function() {
				$mdDialog.cancel();
			};
			$scope.answer = function(answer) {
				$mdDialog.hide(answer);
			};
		}
});
