erpApp.controller('vedorCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils) {
	$scope.isVendorPredent =false;
	$scope.vendorUser={};
	
	$rootScope.$on("callPopulateVendorList", function() {
		$scope.populateVendorList();
	});
	
	$rootScope.$on("saveVendorError", function() {
		$scope.showAddNewVendor()
	});
	
	$scope.populateVendorList=function(){
		 $scope.currentPage = 0;
	     $scope.pageSize = 10;
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "vendor/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
				$scope.data = response.data;
				$scope.isVendorInformation();
				$scope.vendorUsers = response.data;
				utils.hideProgressBar();
				console.log(response);
			}, function errorCallback(response) {
				utils.showToast("We are Sorry. Something went wrong. Please try again later.");
				console.log("Error");
				utils.hideProgressBar();
			});
	}
	
	$scope.isVendorInformation = function() {
		$scope.isVendorPredent = $scope.data.length === 0 ? true : false;
	};

	$scope.showAddNewVendor = function(ev) {
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.information="ADD NEW VENDOR";
		$scope.vendorUser={};
		var addNewVendorDialog = {
			controller : 'DialogVendorController',
			templateUrl : 'views/vendorDialog.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : false,
			onRemoving : function(){console.log('Removing user dialog');},
			fullscreen : $scope.customFullscreen,
			locals : {
				vendorUser : $scope.vendorUser,
				flag : $scope.flag,
				action : $scope.isReadOnly,
				information : $scope.information
			}
		};
		$mdDialog
		.show(addNewVendorDialog)
		.then(function(answer) {},
				function() {});
	  };
	
	  $scope.showEditVendor = function(ev , $index) {
		  $scope.flag = 1;
		  $scope.vendorUser = $scope.vendorUsers[($scope.currentPage*$scope.pageSize) + ($index)];
		  $scope.information="EDIT VENDOR INFORMATION"
		    $mdDialog.show({
		      controller: 'DialogVendorController',
		      templateUrl: 'views/vendorDialog.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:false,
		      fullscreen: $scope.customFullscreen ,
		      locals : {
		    	  vendorUser : $scope.vendorUser,
		    	  flag : $scope.flag,
		    	  action : $scope.isReadOnly,
		    	  information : $scope.information
				}
		    })
		    .then(function(answer) {},
					function() {});
		  };
	  
	  $scope.deleteVendor = function(index) {
			console.log($scope.vendoUser);
			var httpparams = {};
			httpparams.method = 'delete';
			httpparams.url = SERVER_URL + "vendor/delete/" + + $scope.vendorUsers[index].id;
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
			$http(httpparams).then(function successCallback(data) {
				if (data.data.code === 0){
					utils.showToast('We are Sorry. Something went wrong. Please try again later.!');
				}else{
					utils.hideProgressBar();
					$rootScope.$emit("callPopulateVendorList", {});
			console.log(data);
			utils.showToast('Vendor Deleted Sucessfully!');
				}
			}, function errorCallback(data) {
				console.log("Error");
				utils.showToast('We are Sorry. Something went wrong. Please try again later.!');
			});
			utils.showProgressBar();
		};
		
		$scope.viewVendarInformation = function(ev, $index) {
			$scope.flag = 2;
			$scope.isReadOnly = true;
			$scope.vendorUser = $scope.vendorUsers[($scope.currentPage*$scope.pageSize) + ($index)];
			$scope.isSaving = false;
			$scope.information="VIEW VENDOR INFORMATION"
			console.log($scope.user);
			$mdDialog.show({
						controller : 'DialogVendorController',
						templateUrl : 'views/vendorDialog.html',
						parent : angular.element(document.body),
						targetEvent : ev,
						clickOutsideToClose : false,
						fullscreen : $scope.customFullscreen,
						locals : {
							  vendorUser : $scope.vendorUser,
							flag : $scope.flag,
							action : $scope.isReadOnly,
							information : $scope.information
						}
					})
					.then(function(answer) {},
							function() {});
		};
		
		$scope.showConfirm = function(ev,$index) {
			var confirm = $mdDialog.confirm().title(
					'Are you sure you want to Delete Vendor Information?')
					.ariaLabel('Lucky day').targetEvent(ev).ok(
							'Delete' ).cancel('Cancel');
			$mdDialog
					.show(confirm)
					.then(
							function() {
								$scope.status = 'You decided to get rid of your debt.';
								$scope.deleteVendor(($scope.currentPage*$scope.pageSize) + ($index));
							},
							function() { });
		};
		
		$scope.gotoPrevPage = function(){
			 utils.scrollToTop();
			 $scope.currentPage = $scope.currentPage - 1;
		};
		
		$scope.gotoNextPage = function(){
			 utils.scrollToTop();
			 $scope.currentPage = $scope.currentPage + 1;
		};
		
		
});

