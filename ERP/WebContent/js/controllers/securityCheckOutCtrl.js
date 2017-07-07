erpApp.controller('securityCheckOutCtrl', function($scope, $http, $mdDialog, $mdToast,
		$rootScope, SERVER_URL,$filter,utils,Auth,$location) {
	$scope.createDate = $filter('date')(Date.now(), 'MM-dd-yyyy');
	 $scope.productOrderMsg= true;
	 $scope.OrderCreationMsg = false;
	 $scope.isproduct =true;
	 $scope.isSavebutton = false;
	 $scope.createDate = new Date($scope.createDate);
	 
	 $scope.getClient=function(){
	    	var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL + "client/list";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
		 $http(httpparams).then(function successCallback(response) {
				$scope.clients = response.data;
				console.log(response);
			}, function errorCallback(response) {
				console.log("Error");
			});
	    };
	   
	    $scope.clientProductOrder=function(index)
		{
	    	$scope.isproduct = false;
	    	$scope.productOrderMsg= false;
			var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL + "productorder/incompleteProductOrder/"+$scope.selectedClient;
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
			$http(httpparams).then(function successCallback(response) {
				$scope.clientProductList = response.data;
				console.log(response);
				$scope.createProductOrder();
			}, function errorCallback(response) {
				console.log("Error");
			})
		};
	    
	    $scope.displayProductList = function(index) {
			console.log($scope.rawMaterials);
			var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL + "productorder/productorderId/"+ $scope.productOrders.id;
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
			$http(httpparams).then(function successCallback(response) {
				$scope.productOtderList = response.data;
				console.log(response);
	             console.log($scope.rawMaterialList)
	             utils.hideProgressBar();
			}, function errorCallback(response) {
				console.log("Error");
				utils.hideProgressBar();
			});
			utils.showProgressBar();
		};
	    
	    $scope.submitInformation = function(isvaliduser, $event) {
			if (isvaliduser) {
				$scope.saveSecurityCheckOutInformation();
			} else {
				console.log('its else block');
			}
		};
		
		$scope.saveSecurityCheckOutInformation = function() {
			console.log('Saving saveSecurityInformation');
			var index=0;
			var securityCheckOutParts = [];
			for(index=0;index<$scope.productOtderList.length;index++){
				var securityCheckOut = {};
				securityCheckOut.productId= $scope.productOtderList[index].product.id;
				securityCheckOutParts.push(securityCheckOut);
			}
			/*console.log('intime : ' + $scope.intime.getTime());
			console.log('out : ' + $scope.outtime.getTime());
			console.log('intime : ' + $scope.intime.toLocaleTimeString());
			console.log('out : ' + $scope.outtime.toLocaleTimeString());
			if($scope.intime.getTime() < $scope.outtime.getTime()){
				console.log('intime is lesser than outtime')
			}else{
				console.log('intime is greater than outtime')
			}*/
			var data = {
				invoice_No : $scope.invoice_No,
				clientname : $scope.selectedClient,
				vehicleNo : $scope.vehicleNo,
				firstName : $scope.firstName,
				lastName : $scope.lastName,
				description : $scope.description,
				createDate : $scope.createDate,
				intime : $scope.intime.toLocaleTimeString().split(" ")[0],
				/*outtime : $scope.outtime.toLocaleTimeString().split(" ")[0],*/
				poNo :  $scope.productOrders.id,
				licence_no : $scope.licence_no,
				securityCheckOutParts : securityCheckOutParts
			};
			var httpparams = {
					method : 'post',
					url : SERVER_URL + "securitycheckout/productOrderCheckOut",
					data : data
				};
			
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
			$http(httpparams).then(function successCallback(data) {
				console.log(data.data.message);
				console.log(data);
				if(data.data.code === 1){
					utils.showToast("Security Check out Sucessfully!");
					$location.path('/');
				}else{
					utils.showToast("Something went wrong. Please try again later.");
				}
				utils.hideProgressBar();
			}, function errorCallback(response) {
				console.log("Error");
				utils.showToast("Something went wrong. Please try again later.");
				utils.hideProgressBar();
			});
			utils.showProgressBar();
		};
		
		$scope.restInformation=function(){
			$location.path('/');
		};
		
		$scope.createProductOrder = function(){
			
			if( $scope.clientProductList.length === 0){
				$scope.OrderCreationMsg = true;
				$scope.isproduct = true;
				 $scope.isSavebutton = true;
			}
			
		}
		
		$scope.dateValidation = function(createDate){
			console.log("create date" + createDate);
			$scope.currentDate = new Date();
			console.log("currentDate" +$scope.currentDate);
			if(createDate != $scope.currentDate){
				console.log("if condition")
			}else{
				console.log("else condition")
			}
		}
	
});
