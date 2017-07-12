var erpApp = angular
		.module('ERPApp', [ 'ngRoute', 'ngMaterial', 'ngMessages', 'ngAnimate' , 'ngAria']);
erpApp.config(function($locationProvider) {
	$locationProvider.hashPrefix('');
});
erpApp.value('SERVER_URL', 'http://192.168.2.101:8080/ERP/');



erpApp.config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl : 'views/home.html',
		data : {
			loginRequired : true
		}
	}).when('/product', {
		templateUrl : 'views/product.html',
		data : {
			loginRequired : true
		}
	}).when('/userType', {
		templateUrl : 'views/userType.html',
		data : {
			loginRequired : true
		}
	}).when('/home', {
		templateUrl : 'views/home.html',
			data : {
				loginRequired : true
			}
	}).when('/login', {
		templateUrl : 'views/login.html'
	}).when('/unit', {
		templateUrl : 'views/unit.html',
		data : {
			loginRequired : true
		}
	}).when('/user', {
		templateUrl : 'views/user.html',
		data : {
			loginRequired : true,
		}
	
	}).when('/vendor', {
		templateUrl : 'views/vendor.html',
		data : {
			loginRequired : true
		}
	}).when('/rmInventary', {
		templateUrl : 'views/RMInventary.html',
		data : {
			loginRequired : true
		}
	}).when('/rawMaterial', {
		templateUrl : 'views/rawMaterial.html',
		data : {
			loginRequired : true
		}
	}).when('/rmVendorAssociation', {
		templateUrl : 'views/RMVendor.html',
		data : {
			loginRequired : true
		}
	}).when('/rmOrder', {
		templateUrl : 'views/RMOrder.html',
		data : {
			loginRequired : true
		}
	}).when('/userTypeAsso', {
		templateUrl : 'views/userPageTypeAsso.html',
		data : {
			loginRequired : true
		}
	}).when('/securityCheckOut', {
		templateUrl : 'views/SecurityCheckOut.html',
		data : {
			loginRequired : true
		}
	}).when('/client', {
		templateUrl : 'views/client.html',
		data : {
			loginRequired : true
		}
	}).when('/productOrder', {
		templateUrl : 'views/productOrder.html',
		data : {
			loginRequired : true
		}
	}).when('/productInventory', {
		templateUrl : 'views/productInventory.html',
		data : {
			loginRequired : true
		}
	}).when('/productRMAssociation', {
		templateUrl : 'views/productRMAssociation.html',
		data : {
			loginRequired : true
		}
	}).when('/order', {
		templateUrl : 'views/order.html',
		data : {
			loginRequired : true
		}
	}).when('/unAuthorized', {	
		templateUrl : 'views/unAuthorized.html',
		data : {
			loginRequired : true
		}
	}).when('/securityCheck', {
		templateUrl : 'views/securityInformation.html',
		data : {
			loginRequired : true
		}
	}).when('/qualityCheck', {
		templateUrl : 'views/qualityInspection.html',
		data : {
			loginRequired : true
		}
	}).when('/productionPlan', {
		templateUrl : 'views/productionPlan.html',
		data : {
			loginRequired : true
		}
	}).when('/productionPlan', {
		templateUrl : 'views/productionPlan.html',
		data : {
			loginRequired : true
		}
	}).when('/todaysProductionPlan', {
		templateUrl : 'views/todaysProductionPlan.html',
		data : {
			loginRequired : true
		}
	}).when('/status', {
		templateUrl : 'views/status.html',
		data : {
			loginRequired : true
		}
	}).when('/page', {
		templateUrl : 'views/page.html',
		data : {
			loginRequired : true
		}
	}).when('/productQualityCheck', {
		templateUrl : 'views/productQualityCheck.html',
		data : {
			loginRequired : true
		}
	}).when('/dispatchquantity', {
		templateUrl : 'views/dispatchQuantity.html',
		data : {
			loginRequired : true
		}
	}).when('/stores', {
		templateUrl : 'views/stroreInformation.html',
		data : {
			loginRequired : true
		}
	}).when('/productStore',{
		templateUrl : 'views/productStore.html',
		data :{
			loginRequired : true
		}
			
	}).when('/storeOut',{
		templateUrl : 'views/storeOut.html',
		data :{
			loginRequired : true
		}
			
	}).when('/getPdf',{
		templateUrl : 'views/downloadPDF.html',
		data :{
			loginRequired : true
		}
			
	}).when('/generateBOM',{
		templateUrl : 'views/generateBom.html',
		data :{
			loginRequired : true
		}
			
	}).when('/fileUpload', {
		templateUrl : 'views/fileUpload.html',
		data : {
			loginRequired : true
		}
	}).when('/notification', {
		templateUrl : 'views/notification.html',
		data : {
			loginRequired : true
		}
	}).when('/notificationUserAssociation', {
		templateUrl : 'views/notificationUserAssociation.html',
		data : {
			loginRequired : true
		}
	}).when('/report', {
		templateUrl : 'views/report.html',
		data : {
			loginRequired : true
		}
	}).when('/notFound', {
		templateUrl : 'views/notFound.html',
	}).otherwise({
		redirectTo : '/notFound'
	});
	
});
erpApp.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
    $rootScope.$on('$routeChangeStart', function (event,next) {

    	 if (next !== undefined) {
 	        if ('data' in next) {
 	            if ('loginRequired' in next.data ) {
 	                var loginRequired = next.data.loginRequired;
 	                /*console.log('loginRequired = ' + loginRequired);*/
 	                if(!Auth.isLoggedIn() && loginRequired){
 	                	$location.path('/login');
 	                 }else if(next.$$route.originalPath !=='/' && !Auth.isPageAccessible(next)){
 	                	 console.log('page is not accessible');
 	                	$location.path('/unAuthorized');
 	                 }else{
 	                	 //do nothing
 	                 }
 	            }
 	        }
 	    }
    });
}]);
/*erpApp.factory('data',function(){
	 var currentPage = 0;
    var pageSize = 15;
    return currentPage;
    return pageSize;
})*/



erpApp.filter('startFrom', function() {
    return function(input, start) {
    	if (!input || !input.length){
    		  return;
    		}
        start = +start; //parse to int
        return input.slice(start);
        console.log("in filtter function")
    }
});

erpApp.directive('accessibleForm', function () {
    return {
        restrict: 'A',
        link: function (scope, elem) {

            // set up event handler on the form element
            elem.on('submit', function () {

                // find the first invalid element
                var firstInvalid = elem[0].querySelector('.ng-invalid');

                // if we find one, set focus
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            });
        }
    };
});



erpApp.directive("limitTo", [function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            var limit = parseInt(attrs.limitTo);
            angular.element(elem).on("keypress", function(e) {
                if (this.value.length == limit) e.preventDefault();
            });
        }
    }
}]);


/*erpApp.directive("fileread", [
                           function() {
                             return {
                               scope: {
                                 fileread: "="
                               },
                               link: function(scope, element, attributes) {
                                 element.bind("change", function(changeEvent) {
                                   var reader = new FileReader();
                                   reader.onload = function(loadEvent) {
                                     scope.$apply(function() {
                                       scope.fileread = loadEvent.target.result;
                                     });
                                   }
                                   reader.readAsDataURL(changeEvent.target.files[0]);
                                 });
                               }
                             }
                           }
                         ]);*/


erpApp.directive('ngFiles', ['$parse', function ($parse) {

    function fn_link(scope, element, attrs) {
        var onChange = $parse(attrs.ngFiles);
        element.on('change', function (event) {
            onChange(scope, { $files: event.target.files });
        });
    };

    return {
        link: fn_link
    }
} ])






erpApp.directive('lettersOnly', function() {
	  return {
		    replace: true,
		    template: '<input replace="[^a-zA-Z]" with="">'
		  };
		});

erpApp.directive('capitalize', function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
          if (inputValue == undefined) inputValue = '';
          var capitalized = inputValue.toUpperCase();
          if (capitalized !== inputValue) {
            modelCtrl.$setViewValue(capitalized);
            modelCtrl.$render();
          }
          return capitalized;
        }
        modelCtrl.$parsers.push(capitalize);
        capitalize(scope[attrs.ngModel]); // capitalize initial value
      }
    };
  });	

