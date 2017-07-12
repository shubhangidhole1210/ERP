erpApp.controller('unitDialogCtrl',
		function($scope, $http, $mdDialog, $mdToast, $rootScope, SERVER_URL, utils, Auth, unit, $location, flag, action, information) {
	$scope.isReadOnly = action;
	$scope.flag = flag;
	$scope.unit = unit;
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

	$scope.saveUnitInformation = function(ev) {
		var data = {
				name : $scope.unit.name,
				description : $scope.unit.description
		};
		var httpparams = {};
		if ($scope.flag == 0) {
			console.log($scope.unit);
			console.log($scope.data);
			httpparams.method = 'post';
			httpparams.url = SERVER_URL + "unit/create";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
		} else {
			console.log($scope.unit);
			data.id = $scope.unit.id;
			httpparams.method = 'put';
			httpparams.url = SERVER_URL + "unit/update";
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
										"saveUnitError", {});
								console.log(data);
								$scope.hide();
								$scope.message = 'Something went worng. Please try again later.';
								utils.showToast();
							}else{
								$scope.displayProgressBar = false;
								/*$scope.message = 'Unit Information saved successfully.';*/
								utils.showToast(data.data.message);
								$rootScope.$emit("CallPopulateUnitList",{});
							}
						},
						function errorCallback(data) {
							$rootScope.$emit(
									"saveUnitError", {});
							console.log(data);
							$scope.hide();
							$scope.hide();
							utils.showToast('Something went worng. Please try again later.');
						});
	};

	$scope.submitUnitInformation = function(isvaliduser,$event){
		if (isvaliduser) {
			$scope.saveUnitInformation();
		} else {
			console.log('its else block');
			utils.showToast('Please fill all required information');
		}
	};
});