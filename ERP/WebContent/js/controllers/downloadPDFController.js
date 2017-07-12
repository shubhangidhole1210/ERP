erpApp.controller('downloadPDFController',function($scope, $mdDialog, $location,$rootScope,SERVER_URL,Auth,$http,utils){
	$scope.ProductOrderMsg = true;
	$scope.productIdReadOnly = true;
	$scope.isBomIdMsg = false;
	$scope.getProducts = function() {
		utils.showProgressBar();
		        var httpparams = {};
		         httpparams.method = 'GET';
		         httpparams.url = SERVER_URL + "bom/getProductList";
		        httpparams.headers = {
				      auth_token : Auth.getAuthToken()
			        };
		
					$http(httpparams).then( function successCallback(response) {
//								$scope.data = response.data;
								$scope.products = response.data.data;
								console.log(response);
								utils.hideProgressBar();
								if(response.data.code === 0){
									utils.showToast(response.data.message);
								}
								/*$scope.ProductOrderMsg = false;*/
							},
							function errorCallback(response) {
								console.log("Error");
								utils.showToast('We are Sorry. Something went wrong. Please try again later.');
								utils.hideProgressBar();
			});
	};
	
	$scope.submitData = function(id,bom){
		console.log("in submit data function");
		console.log("id" , id);
		console.log("bom" , bom);
		if(id == null && bom == null){
			  utils.showToast("please select Product and BOM");
		   }else if(id == null){
			console.log("its if condition");
			utils.showToast("please select product ID");
		}else if(bom == null){
			console.log("its else if condition");
			utils.showToast("please select BOM ID");
		}else{
			utils.showToast("PDF download sucessfully");
			console.log("its else  condition");
			$scope.getPdf();
		}
	};
	
	$scope.getBomInformation = function(){
		console.log($scope.rawMaterials);
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "bom/bomList/" + $scope.product.id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
			$scope.bomData = response.data;
			console.log(response);
             utils.hideProgressBar();
             $scope.ProductOrderMsg = false;
             $scope.productIdReadOnly = false;
             $scope.isEmptyBomId();
		}, function errorCallback(response) {
			console.log("Error");
			utils.hideProgressBar();
		});
		utils.showProgressBar();
	};
	
	$scope.isEmptyBomId = function(){
		if($scope.bomData.length===0){
			$scope.isBomIdMsg = true;
			$scope.productIdReadOnly = true;
		}else{
			$scope.isBomIdMsg = false;
			$scope.productIdReadOnly = false;
		}
	}
	
	$scope.getPdf = function () {
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "bom/downloadBomPdf/" + $scope.product.id + "/" +$scope.bom.id;
		httpparams.responseType = 'arraybuffer';
		httpparams.headers = {
			      auth_token : Auth.getAuthToken()
		        };
		$http(httpparams).then( function successCallback(response,data, status, headers){
			utils.showConfirm();
			console.log(response.headers);
	        headers = response.headers();
	        var filename = headers['BOMDetails.pdf'];
	        var contentType = headers['content-type'];
	        console.log("file name:-" + filename)
	        var linkElement = document.createElement('a');
	        console.log("bom id is :" ,$scope.bom.bomId)
	        try {
	            var blob = new Blob([response.data], { type: contentType });
	            var url = window.URL.createObjectURL(blob);
	            linkElement.setAttribute('href', url);
	            linkElement.setAttribute("download", $scope.bom.bomId);
	            var clickEvent = new MouseEvent("click", {
	                "view": window,
	                "bubbles": true,
	                "cancelable": false
	            });
	            linkElement.dispatchEvent(clickEvent);
	        } catch (ex) {
	            console.log(ex);
	        }
		},   
		function errorCallback(response) {
			console.log("Error");
			utils.showToast('We are Sorry. Something went wrong. Please try again later.');
			utils.hideProgressBar();
	    });
		
	};
	
	$scope.cancelBOM = function(){
		$location.path('/home');
	};
	
});