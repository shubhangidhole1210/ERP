erpApp.controller('userTypeCtrl',function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils)
{
	$scope.isReadOnly = false;
	$scope.userType = {};
	
	$rootScope.$on("CallPopulateUserTypeList", function($event) {
		$scope.populateUserTypeList	();
	});
	$rootScope.$on("saveUserError", function() {
		$scope.showAddNewUser();
	});

	$scope.populateUserTypeList = function() {
		 $scope.currentPage = 0;
	     $scope.pageSize = 15;
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "usertype/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {

							$scope.data = response.data;
							$scope.UserTypes = response.data;
							console.log('$scope.UserTypes' , $scope.UserTypes);
							console.log(response);
							utils.hideProgressBar();
						},
						function errorCallback(response) {
							$scope.message = 
							utils.showToast("We are Sorry. Something went wrong. Please try again later.");
							console.log("Error");
							utils.hideProgressBar();
						});
	};

	$scope.showAddNewUserType = function(ev) {
		$scope.information = "ADD NEW USER TYPE"
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.userType = {};
		var addNewUserTypeDialog = {
			controller : 'userTypeDialogCtrl',
			templateUrl : 'views/userTypeDialogue.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : false,
			fullscreen : $scope.customFullscreen,
			locals : {
				userType : $scope.userType,
				flag : $scope.flag,
				action : $scope.isReadOnly,
				information : $scope.information
			}
		};
		$mdDialog
		.show(addNewUserTypeDialog)
		.then(function(answer) {},
				function() {});
	};
	  
	$scope.showEditUserType = function(ev, $index) {
		$scope.flag = 1;
		$scope.isReadOnly = false;
		$scope.userType = $scope.UserTypes[($scope.currentPage*$scope.pageSize) + ($index)];
		$scope.information = "EDIT USER TYPE"
		console.log($scope.user);
		$mdDialog
				.show({
					controller : 'userTypeDialogCtrl',
					templateUrl : 'views/userTypeDialogue.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : false,
					fullscreen : $scope.customFullscreen,
					locals : {
						userType : $scope.userType,
						flag : $scope.flag,
						action : $scope.isReadOnly,
						information : $scope.information
					}
				})
				.then(function(answer) {},
						function() {});
	};
	
	$scope.viewUserTypeInformation = function(ev, $index) {
		$scope.flag = 2;
		$scope.isReadOnly = true;
		$scope.isSaving = false;
		$scope.userType = $scope.UserTypes[($scope.currentPage*$scope.pageSize) + ($index)];
		console.log($scope.unit);
		$mdDialog.show({
					controller : 'userTypeDialogCtrl',
					templateUrl : 'views/userTypeDialogue.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : false,
					fullscreen : $scope.customFullscreen,
					locals : {
						userType : $scope.userType,
						flag : $scope.flag,
						action : $scope.isReadOnly,
						information : $scope.information
					}
				})
				.then(
						function(answer) {},
						function() {});
	};
	
	
	$scope.deleteUserType = function(index) {
		var httpparams = {};
		httpparams.method = 'delete';
		httpparams.url = SERVER_URL + "usertype/delete/" + $scope.UserTypes[index].id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(data) {
					$mdDialog.hide();
			utils.showToast('User Type Deleted Sucessfully!');
			$rootScope.$emit("CallPopulateUserTypeList", {});
			console.log(data);

		}, function errorCallback(data) {
			console.log("Error");
			utils.showToast("We are Sorry. Something went wrong. Please try again later.");
			
		});
		utils.showProgressBar();
	};
	
	$scope.showConfirm = function(ev,$index) {
		var confirm = $mdDialog.confirm().title('Are you sure you want to Delete User Type Information?')
				.ariaLabel('').targetEvent(ev).ok('YES' ).cancel('NO');

		$mdDialog.show(confirm)
				.then(function() {
					$scope.deleteUserType(($scope.currentPage*$scope.pageSize) + ($index));
				}, function() {});
	};
	
});