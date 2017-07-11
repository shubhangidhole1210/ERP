erpApp.controller('storeOutCtrl',function($scope, $http, $mdDialog, $mdToast,
		$rootScope, SERVER_URL,$filter,utils,Auth,$location)
{
	$scope.addProductRmAssociationMsg = false;
	$scope.currentDate = utils.getCurrentDate();
	$scope.isProduct = false;
	$scope.isProductReadOnly = false;
	$scope.isSelectedItemStoreOut = false;
	$scope.productionPlan = {};
	$scope.selectedRawMaterialList = [];
	$scope.getProductionPlanForStoreOut = function(){
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "productionplanning/getProductionPlanListByDate/" +$scope.currentDate;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
			$scope.productionPlans = response.data;
			console.log(response);
			utils.hideProgressBar();
			$scope.isProductOrderPresent();
		}, function errorCallback(response) {
			utils.showToast("We are Sorry. Something went wrong. Please try again later.");
			console.log("Error");
			utils.hideProgressBar();
		});
	};
	
	$scope.isProductOrderPresent = function(){
		if($scope.productionPlans.length ===0){
			$scope.isProduct = true ;
			$scope.isProductReadOnly = true;
		}else{
			$scope.isProduct = false;
			$scope.isProductReadOnly = false;
		}
	}
	
	$scope.getProductRMAssociation = function(){
		
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "productionplanning/getProductionPlanListForStoreOutByDateAndPId/"  + $scope.currentDate + "/" + + $scope.productionPlan.product.id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
			
//			$scope.data = response.data;
			
			if(response.data.code === 0){
				utils.showToast(response.data.message);
				console.log(response.data.message);
				$scope.addProductRmAssociationMsg = true;
			}else{
				$scope.productRMList = response.data.data;
				console.log(response);
				$scope.manuFactureQuantity = $scope.productionPlan.targetQuantity;
				console.log("Target Qty : ", $scope.productionPlan.targetQuantity);
				$scope.updateDispatchQuantity();
				$scope.addProductRmAssociationMsg = false;
			}
			utils.hideProgressBar();

		}, function errorCallback(response) {
			utils.showToast("We are Sorry. Something went wrong. Please try again later.");
			console.log("Error");
			utils.hideProgressBar();
		});
	};
	
	$scope.updateDispatchQuantity = function(){
		for(index=0;index<$scope.productRMList.length;index++){
			$scope.productRMList[index].quantityDispatched = $scope.productRMList[index].quantityRequired * $scope.manuFactureQuantity;
		}
	};
	
	
	$scope.saveStoreOutInformation=function(){
		var rmList = [];
		var index=0;
		
		if($scope.isSelectedItemStoreOut){
			var rmList = $scope.selectedRawMaterialList;
			console.log("if block");
		}else{
			for(index=0;index<$scope.productRMList.length;index++){
				var storeOutProduct = {};
				storeOutProduct.rawmaterial = $scope.productRMList[index].rawmaterial;
				storeOutProduct.quantityRequired = $scope.productRMList[index].quantityRequired;
				storeOutProduct.quantityDispatched = $scope.productRMList[index].quantityDispatched;
				rmList.push(storeOutProduct);
				console.log("else block");
			}
		}
		var data = {
				productId: $scope.productionPlan.product.id,
				productionPlanId :$scope.productionPlan.id,
				quantityRequired: $scope.manuFactureQuantity,
				isSelectedStoreOut: $scope.isSelectedItemStoreOut,
				description:$scope.description,
				storeOutParts:rmList
			};
		var httpparams = {
				method : 'post',
				url : SERVER_URL + "storeout/createStoreOut",
				data : data
			};
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(data) {
			console.log(data);
			if(data.data.code === 1){
				utils.showToast(data.data.message);
			}else{
				utils.showToast("Something went wrong. Please try again later.");
			}
			
		}, function errorCallback(response) {
			console.log("Error");
			utils.showToast("Something went wrong. Please try again later.");
			utils.hideProgressBar();
		});
		utils.showConfirm();		
	};
	
	$scope.onIsSelectedChange = function(isSelectedRawMaterial,$index){
		console.log("$index : " ,$index);
		console.log("checkData :" ,isSelectedRawMaterial);
		
		
		if(!isSelectedRawMaterial){
			if(isRawMaterialPresentInList($index)){
				$scope.selectedRawMaterialList.splice($index, 1);
				console.log("removed $scope.selectedRawMaterialList : ", $scope.selectedRawMaterialList);
			}
		}else{
			if(isRawMaterialPresentInList($index)){
				console.log('Item already present');
			}else{
				var selectedStoreOutProduct = {};
				console.log(" $scope.productRMList : ",  $scope.productRMList);
				selectedStoreOutProduct.rawmaterial = $scope.productRMList[$index].rawmaterial;
				selectedStoreOutProduct.quantityDispatched = $scope.productRMList[$index].quantityDispatched;
				selectedStoreOutProduct.quantityRequired = $scope.productRMList[$index].quantityRequired;
				$scope.selectedRawMaterialList.push(selectedStoreOutProduct);
			}
		};
		
		console.log("$scope.selectedRawMaterialList : ", $scope.selectedRawMaterialList);
	};
	
	function isRawMaterialPresentInList(listIndex){
		var isRawMaterialPresent = false;
		for(index=0; index < $scope.selectedRawMaterialList.length;index++){
			if($scope.selectedRawMaterialList[index].rawmaterial === $scope.productRMList[listIndex].rawmaterial){
				isRawMaterialPresent = true;
				break;
			}
		}
		return isRawMaterialPresent;
	}
	
	$scope.submitInformation = function(isvaliduser, $event) {
		if (isvaliduser) {
			$scope.saveStoreOutInformation();
		} else {
			console.log('its else block');
		}
	};
	
	$scope.restInformation=function(){
		$location.path('/');
	};
	
	$scope.displayHiddenColumn = function(){
		$scope.ischeckBox = true;
	};
	
	});
