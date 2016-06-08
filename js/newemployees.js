var app = angular.module('hrApp', ['ngSanitize','ui.router', 'angular.filter','ui.bootstrap', 'ngIdle', 'ngCapsLock']);
var weburl = _spPageContextInfo.webServerRelativeUrl.replace(/\/$/g,'');
var contexturl = weburl + "/_api/ContextInfo";
var sender = _spPageContextInfo.userLoginName.split("@")[0];
var protocol = window.location.protocol;

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

//config
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){
	
	//reauthentication and re-issue of request if authentication is successful
	/*$httpProvider.interceptors.push(function ($timeout, $q, $injector) {
		var loginModal, $http, $state;

		// this trick must be done so that we don't receive
		// `Uncaught Error: [$injector:cdep] Circular dependency found`
		$timeout(function () {
			loginModal = $injector.get('loginModal');
			$http = $injector.get('$http');
			$state = $injector.get('$state');
		});

		return {
			responseError: function (rejection) {
			if (rejection.status !== 401) {
				return rejection;
			}

			var deferred = $q.defer();
			loginModal()
			.then(function () {
				deferred.resolve( $http(rejection.config) );
			})
			.catch(function () {
				$state.go('welcome');
				deferred.reject(rejection);
			});

			return deferred.promise;
		  }
	};
	});*/
	//url router (unmatched url goes to home)
	$urlRouterProvider.otherwise('/welcome'); 
	$stateProvider
		.state('welcome', {
		  url: '/welcome',
		  templateUrl: "/apps/SiteAssets/views/view-welcome.html",
		  data: {
			requireLogin: false
		  }
		})
		.state('create', {
			url: '/create',
			templateUrl: "/apps/SiteAssets/views/view-create.html",
			controller: 'accountController',
			data: {
				requireLogin: false // this property will apply to all children of 'app'
			}
		});
		
	//configure time for auto logoff
	//IdleProvider.idle(60*60); //60 minutes idle (1 hour) 
	//IdleProvider.timeout(.5*60); //30 seconds to respond (and stay logged in)
	//KeepaliveProvider.interval(5*60); // 5 minute keep-alive ping
	
}]);
//run
app.run(function ($rootScope, $state) {	
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
	$state.go(toState.name, toParams);
    /*var requireLogin = toState.data.requireLogin;
	
	//check for current user
	$rootScope.currentUser = SecurityManager.username;
	
    if (requireLogin && ($rootScope.currentUser == null)) {
      event.preventDefault();

      loginModal()
        .then(function () {
          return $state.go(toState.name, toParams);
        })
        .catch(function () {
          return $state.go('welcome');
        });
    }else{
		//restart the idle watch on a page refresh
		//Idle.watch();
		//user could already be logged in on refresh 
		//loginService.getUserInfo(SecurityManager.username, "");
	}*/
  });
});
//Services
app.service("userProfileService",["$http", function($http){
	var userProfileService = {
		getEmployeeInfo: function(userID) {
			if(userID === "Me"){
				userID = sender;
			}
			var promise = $http(
			{
				method: 'POST',
				url: protocol + '//webservices.clydeinc.com/ClydeRestServices.svc/json/GetUserProfile?username=' + sender,
				dataType: "json"
			})
			.then(function(json) {
				//get employee profile
				return json.data;
			});
			
			return promise;
		}
	};
	return userProfileService;
}]);
app.service("activeDirectoryService",["$http", function($http){
	var activeDirectoryService = {
		getCompanies: function() {
			var promise = $http(
			{
				method: 'POST',
				url: protocol + '//webservices.clydeinc.com/ClydeRestServices.svc/json/GetAllCompanies',
				dataType: "json"
			})
			.then(function(json) {
				//get all companies data
				return json.data;
			});
			
			return promise;
		},
		getDivisions: function(company) {
			var promise = $http(
			{
				method: 'POST',
				url: protocol + '//webservices.clydeinc.com/ClydeRestServices.svc/json/GetDivisions?company=' + company,
				dataType: "json"
			})
			.then(function(json) {
				//get all companies data
				return json.data;
			});
			
			return promise;
		},
		getAreas: function(company, division) {
			var promise = $http(
			{
				method: 'POST',
				url: protocol + '//webservices.clydeinc.com/ClydeRestServices.svc/json/GetAreas?company=' + company + '&division=' + division,
				dataType: "json"
			})
			.then(function(json) {
				//get all companies data
				return json.data;
			});
			
			return promise;
		},
		getLocations: function(company, division, area) {
			var promise = $http(
			{
				method: 'POST',
				url: protocol + '//webservices.clydeinc.com/ClydeRestServices.svc/json/GetLocations?company=' + company + '&division=' + division + '&area=' + area,
				dataType: "json"
			})
			.then(function(json) {
				//get all companies data
				return json.data;
			});
			
			return promise;
		},
		activateAccount: function(userName, manager, notes) {
			var promise = $http(
			{
				method: 'POST',
				url: protocol + '//webservices.clydeinc.com/ClydeRestServices.svc/json/ActivateAccount?username=' + userName + '&manager=' + manager + '&sender=' + sender + '&notes=' + notes,
				dataType: "json"
			})
			.then(function(json) {
				//get all companies data
				return json.data;
			});
			
			return promise;
		},
		createAccount: function(firstName, middleName, lastName, company, companyNumber, location, manager, notes) {
			var promise = $http(
			{
				method: 'POST',
				url: protocol + '//webservices.clydeinc.com/ClydeRestServices.svc/json/CreateAccount?firstName=' + firstName + '&middleName=' + middleName + '&lastName=' + lastName + '&company=' + company + '&companyNumber=' + companyNumber + '&location=' + location + '&manager=' + manager + '&sender=' + sender + '&notes=' + notes,
				dataType: "json"
			})
			.then(function(json) {
				//get all companies data
				return json.data;
			});
			
			return promise;
		},
		getPendingHires: function(firstName, lastName) {
			var promise = $http(
			{
				method: 'POST',
				url: protocol + '//webservices.clydeinc.com/ClydeRestServices.svc/json/GetPendingHires',
				dataType: "json"
			})
			.then(function(json) {
				//get all companies data
				return json.data;
			});
			
			return promise;
		}
	};
	return activeDirectoryService;
}]);
app.service("vistaService",["$http", function($http){
	var vistaService = {
		getDuplicates: function(lastName) {
			var promise = $http(
			{
				method: 'POST',
				url: protocol + '//webservices.clydeinc.com/ClydeRestServices.svc/json/GetDuplicates?lastName=' + lastName,
				dataType: "json"
			})
			.then(function(json) {
				//get all employee data
				return json.data;
			});
			
			return promise;
		}
	};
	return vistaService;
}]);
//controllers
app.controller("menuController", ["$scope","$state", function($scope, $state){
	$scope.logout = function () {
		//log the user out
		//SecurityManager.logout();
		//stop the idle timer
		//Idle.unwatch();
	}
	
}]);
app.controller('accountController', ["$scope", "activeDirectoryService", "vistaService", function($scope, activeDirectoryService,vistaService) {	
	$scope.isNewHire = true;
	$scope.isUpdating = false;
	
	$scope.form = {
		middleName : "",
		manager : ""
	};
	$scope.activateAccount = function(userName, employeeNumber, existsInAD){
		if($scope.form.firstName && $scope.form.lastName && $scope.form.company){
			if(existsInAD){
				$scope.isUpdating = true;
				firstName = "NEWLINEFirst Name: " + $scope.form.firstName;
				middleName = "NEWLINEMiddle Name: " + $scope.form.middleName;
				lastName = "NEWLINELast Name: " + $scope.form.lastName;
				employeeNum = "NEWLINEEmployee Number: " + $scope.form.lastName;
				responsibilities = "NEWLINESame Responsibilities: " + $scope.form.responsibilities;
				$scope.form.notes = firstName + middleName + lastName +  employeeNum + responsibilities +"NEWLINE" + $scope.form.notes; 
				activeDirectoryService.activateAccount(userName, $scope.form.manager, $scope.form.notes).then(function(data){
					$scope.userAccountInfo = data;
					$scope.getPendingHires();
					$scope.isUpdating = false;
				});
			}
			else{
				$scope.createAccount();
			}
		}
		$scope.clearForm();
	}
	
	$scope.userAccountInfo = [];
	$scope.createAccount = function(){
		if($scope.form.firstName && $scope.form.lastName && $scope.form.company){
			$scope.isUpdating = true;
			activeDirectoryService.createAccount($scope.form.firstName, $scope.form.middleName, $scope.form.lastName, $scope.form.company.Name, $scope.form.company.CompanyNumber, $scope.form.location.Name, $scope.form.manager, $scope.form.notes).then(function(data){
				$scope.userAccountInfo = data;
				$scope.getPendingHires();
				$scope.isUpdating = false;
			});
		}
		$scope.clearForm();
	}
	$scope.clearForm = function(){
		$scope.userAccountInfo = [];
		$scope.isNewHire = true;
		$scope.form = {
			middleName : "",
			manager : ""
		};
		$scope.divisions = [];
		$scope.areas = [];
		$scope.locations = [];
		$scope.getPendingHires();
		$scope.getPossibleDuplicates();
	}
	//companies
	$scope.companies = [];
	$scope.refreshCompanies = function () {
		activeDirectoryService.getCompanies().then(function(data){
			$scope.companies = data;
		});
		$scope.divisions = [];
		$scope.areas = [];
		$scope.locations = [];
	}
	$scope.refreshCompanies();
	
	//get all divisions
	$scope.divisions = [];
	$scope.refreshDivisions = function () {
		activeDirectoryService.getDivisions($scope.form.company.CompanyNumber).then(function(data){
			$scope.divisions = data;
		});
		$scope.areas = [];
		$scope.locations = [];
	}
	
	//get all areas
	$scope.areas = [];
	$scope.refreshAreas = function () {
		activeDirectoryService.getAreas($scope.form.company.CompanyNumber, $scope.form.division.ID).then(function(data){
			$scope.areas = data;
		});
		$scope.locations = [];
	}


	//get all locations
	$scope.locations = [];
	$scope.refreshLocations = function () {
		activeDirectoryService.getLocations($scope.form.company.CompanyNumber, $scope.form.division.ID, $scope.form.area.ID).then(function(data){
			$scope.locations = data;
		});
	}
	
	$scope.duplicates = [];
	$scope.getPossibleDuplicates = function(){
		if($scope.form.lastName){
			vistaService.getDuplicates($scope.form.lastName).then(function(data){
				$scope.duplicates = data;
			});
		}
		else{
			$scope.duplicates = [];
		}
	}
	
	$scope.pending = [];
	$scope.getPendingHires = function(){
		activeDirectoryService.getPendingHires().then(function(data){
			$scope.pending = data;
		});
	}
	$scope.getPendingHires();
	
}]);	

$(document).on('click','.navbar-collapse.in',function(e) {
    if( $(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle' ) {
		 $(this).collapse('hide');
    }
});
$(document).ready(function(){
	$('[data-toggle="tooltip"]').tooltip(); 
	
});
window.addEventListener("load",function() {
    // Set a timeout...
    setTimeout(function(){
        // Hide the address bar!
        window.scrollTo(0, 1);
    }, 1000);
});