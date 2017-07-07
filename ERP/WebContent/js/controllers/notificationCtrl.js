erpApp.controller('notificationCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils) {
     $scope.isNotificationPresent=false;
     $scope.notification={};
     
	$rootScope.$on("CallPopulateNotificationList", function() {
		$scope.populateNotificationList();
	});
	
	$rootScope.$on("saveUnitError", function() {
		$scope.addNewNotification();
	});
	
	$scope.populateNotificationList=function(){
		$scope.currentPage = 0;
	     $scope.pageSize = 15;
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "notification/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
			$scope.notificationList=response.data;
			console.log(response)
			utils.hideProgressBar();
		}, function errorCallback(response) {
			utils.showToast("We are Sorry. Something went wrong. Please try again later.");
			utils.hideProgressBar();
			console.log("Error");
		});
	};
	
	$scope.isNotificationInformation = function() {
		$scope.isNotificationPresent = $scope.data.length === 0 ? true : false;
	};
	
	$scope.addNewNotification = function(ev) {
		$scope.notification={};
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.information = "ADD NEW NOTIFICATION"
		var addNewNotificationDialog = {
			controller : 'notificationDialogCtrl',
			templateUrl : 'views/notificationDialog.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : true,
			onRemoving : function(){console.log('Removing user dialog');},
			fullscreen : $scope.customFullscreen,
			locals : {
				notification : $scope.notification,
				flag : $scope.flag,
				action : $scope.isReadOnly,
				information : $scope.information
			}
		};
		$mdDialog
		.show(addNewNotificationDialog)
		.then(function(answer) {},
				function() {});
	};

	$scope.showEditNotification = function(ev, $index) {
		$scope.flag = 1;
		$scope.isReadOnly = false;
		$scope.notification = $scope.notificationList[($scope.currentPage*$scope.pageSize) + ($index)];
		$scope.information = "EDIT NOTIFICATION INFORMATION"
		console.log($scope.notification);
		$mdDialog
				.show({
					controller : 'notificationDialogCtrl',
					templateUrl : 'views/notificationDialog.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : true,
					fullscreen : $scope.customFullscreen,
					locals : {
						notification : $scope.notification,
						flag : $scope.flag,
						action : $scope.isReadOnly,
						information : $scope.information
					}
				})
				.then(
						function(answer) {},
						function() {});
	};
	
	$scope.viewNotificationInformation = function(ev, $index) {
		$scope.flag = 2;
		$scope.isReadOnly = true;
		$scope.notification = $scope.notificationList[($scope.currentPage*$scope.pageSize) + ($index)];
		$scope.isSaving = false;
		$scope.information = "VIEW NOTIFICATION INFORMATION"
		console.log($scope.notification);
		$mdDialog.show({
					controller : 'notificationDialogCtrl',
					templateUrl : 'views/notificationDialog.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : true,
					fullscreen : $scope.customFullscreen,
					locals : {
						notification : $scope.notification,
						flag : $scope.flag,
						action : $scope.isReadOnly,
						information : $scope.information
					}
				})
				.then(
						function(answer) {},
						function() {});
	};
	
	$scope.deleteNotification = function(index) {
		utils.showProgressBar();
		 $scope.notification = $scope.notificationList[index].id; 
		console.log($scope.page);
		var httpparams = {};
		httpparams.method = 'delete';
		httpparams.url = SERVER_URL + "notification/delete/" + $scope.notificationList[index].id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(data) {
			utils.hideProgressBar();
			$rootScope.$emit("CallPopulateNotificationList", {});
			console.log(data);
			if(data.data.code === 0){
				utils.showToast("We are Sorry. Something went wrong. Please try again later.");
			}else{
				utils.showToast("Notification Deleted sucessfully");
			}

		}, function errorCallback(data) {
			console.log("Error");
			utils.showToast("We are Sorry. Something went wrong. Please try again later.");
		});
	};
	
	$scope.showConfirm = function(ev,$index) {
		var confirm = $mdDialog.confirm().title(
				'Are you sure you want to Delete Notification Information?')
				.ariaLabel('Lucky day').targetEvent(ev).ok(
						'YES' ).cancel('NO');
		$mdDialog
				.show(confirm)
				.then(
						function() {
							$scope.status = 'You decided to get rid of your debt.';
							$scope.deleteNotification(($scope.currentPage*$scope.pageSize) + ($index));
						},
						function() {
							$scope.status = 'You decided to keep your debt.';
						});
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
