erpApp.controller('userTypePageAssoCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils) {
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
				utils.hideProgressBar();
				console.log(response);

			}, function errorCallback(response) {
				utils.showToast("We are Sorry. Something went wrong. Please try again later.");
				console.log("Error");
				utils.hideProgressBar();
			});
		 utils.showProgressBar();
	}
	 
	$scope.isVendorInformation=function(){
		if($scope.data.length==0){
			$scope.isVendorPredent =true;
		}else{
			$scope.isVendorPredent =false;
		}
	};
	
	$scope.showAddNewUserTypePage = function(ev) {
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.information="ADD NEW USER TYPE PAGE ASSOCIATION";
		$scope.userTypePageAsso={};
		var abc = {
			controller : "userTypePageDialogCtrl",
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
	
	  
	  $scope.editUserTypePage = function(ev , $index) {
		  $scope.flag = 1;
		  $scope.isReadOnly = false;
		  $scope.userTypePageAsso = $scope.userTypePageAssociations[($scope.currentPage*$scope.pageSize) + ($index)];
		  $scope.information="EDIT USER TYPE PAGE ASSOCIATION"
		    $mdDialog.show({
		      controller: "userTypePageDialogCtrl",
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
						controller : "userTypePageDialogCtrl",
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
		
});
