var erpApp = angular
		.module('ERPApp', [ 'ngRoute', 'ngMaterial', 'ngMessages' ]);
erpApp.config(function($locationProvider) {
	$locationProvider.hashPrefix('');
});
erpApp.value('SERVER_URL', 'http://localhost:8080/ERP-BackEnd/');
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
	}).when('/Rmorder', {
		templateUrl : 'views/RMOrder.html',
		data : {
			loginRequired : true
		}
	})
	
	.when('/userTypeAsso', {
		templateUrl : 'views/userPageTypeAsso.html',
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
	}).when('/administration', {	
		templateUrl : 'views/administration.html',
		data : {
			loginRequired : true
		}
	}).when('/Report', {
		templateUrl : 'views/Report.html',
		data : {
			loginRequired : true
		}
	}).when('/notification', {
		templateUrl : 'views/notification.html',
		data : {
			loginRequired : true
		}
	}).otherwise({
		redirectTo : '/login'
	});
	
});



erpApp.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
    $rootScope.$on('$routeChangeStart', function (event,next) {

    	 if (next !== undefined) {
 	        if ('data' in next) {
 	            if ('loginRequired' in next.data) {
 	                var loginRequired = next.data.loginRequired;
 	                console.log('loginRequired = ' + loginRequired);
 	                if(!Auth.isLoggedIn() && loginRequired){
 	                	$location.path('/login');
 	                 }
 	            }
 	        }
 	    }
    });
}]);

erpApp.factory('Auth', function(){
	var user;

	return{
	    setUser : function(aUser){
	        user = aUser;
	    },
	    isLoggedIn : function(){
	        return (user)? user : false;
	    },
	    getAuthToken : function(){
	        return user.auth_token;
	    }
	  }
	});



erpApp.controller('ERPController', function($scope,$rootScope,Auth) {
	
	/*$scope.isLoginButton = true;
	$scope.isuserName = false;
	$scope.displayLogin = function() {
		$scope.isLoginButton = false;
		$scope.isuserName = true;
	}*/
	$scope.displayMenu=Auth.isLoggedIn();
	$rootScope.$on('logout',function($event){
		console.log('Inside logout event');
		$scope.displayMenu=Auth.isLoggedIn();
	});
	$rootScope.$on('loginSuccess',function($event){
		console.log('Inside login success event');
		$scope.displayMenu=Auth.isLoggedIn();
	});
});

/*erpApp.controller('homectrl', function($scope, $http,SERVER_URL) {
	$http({
		method : 'GET',
		url : SERVER_URL + 'user/list'
	}).then(function successCallback(response) {
		$scope.data = response.data;
		
	}, function errorCallback(response) {
		console.log("Error");

	});

});
*/



erpApp.controller('finshedGoodctrl', function($scope) {

});

erpApp.controller('orderCtrl', function($scope) {

});

erpApp.controller('administrationCtrl', function($scope) {

});

erpApp.controller('reportctrl', function($scope) {

});

erpApp.controller('notificationCtrl', function($scope) {

});




erpApp.controller('ToastCtrl', function($scope, $mdToast, message) {
	$scope.message = message;
	$scope.closeToast = function() {

		$mdToast.hide().then(function() {

		});
	};

});
