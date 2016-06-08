var app = angular.module("trucksApp", ["ngSanitize"]);
var weburl = _spPageContextInfo.webServerRelativeUrl.replace(/\/$/g,'');
var contexturl = weburl + "/_api/ContextInfo";


app.service("menuService",['$http', function($http){
	var menuService = {
		getMenu: function (listurl, Department) {
			var promise = $http(
			{
				method: 'GET',
				url: listurl + "?$select=Title,Order0,Department,appLinks&$orderby=Order0&$filter=Department eq '"+ Department +"'",
				dataType: "json"
			})
			//This is called a promise
			.then(function (json) {
				return json.data;
			})
			.catch(function (data) {
   			     // Handle error here
  			});
			
			return promise;
		}
	};
	return menuService;
}]);

app.controller("employeeInfoController", ["$scope", "$http", function($scope, $http){
		$scope.searchByTruck = true;
		$('#Tnumb').on('focus',function(){
			$('#Tnumb').trigger('click')
		});
		$("#Tnumb").focus();
		$scope.toggleSearch = function () {
			$scope.searchByTruck = !$scope.searchByTruck;
			$scope.clearFields();
		}
		$scope.clearFields = function(){
			if(!$scope.searchByTruck){
				$("#Tnumb").val("");
			}else{
				$("#Ename").val("");
			}
		}
		
		$scope.clearX = function(){
				$("#Tnumb").val("");
				$("#Ename").val("");
		}
		
		$scope.employeeInfo = [];
		$scope.refreshEmployeeInfo = function () {
		  $http.post("https://webservices.clydeinc.com/ClydeRestServices.svc/json/GetTrucks?name="+ $("#Ename").val() +"&truck="+ $("#Tnumb").val() +"&token=tRuv^:]56NEn61M5vl3MGf/5A/gU<@").
		  success(function (data) {
			$scope.employeeInfo = data;
		  }).
		  error(function (data) { alert(data['odata.error'].message.value); });
		};
}]);
/*------- This is to add default image where image == null*/


app.controller("menuController", ["$scope", "menuService", function($scope, menuService){
	$scope.accountingMenuItems = [];
	$scope.employeeMenuItems = [];
	$scope.equipmentMenuItems = [];
	$scope.hrMenuItems = [];

	
	$scope.getMenuItems = function () {
		var listurl = weburl + "/_api/web/lists/GetByTitle('AppList')/items";
		menuService.getMenu(listurl, 'Accounting and Credit').then(function(data){
			$scope.accountingMenuItems = data.value;
		});
		menuService.getMenu(listurl, 'Employee').then(function(data){
			$scope.employeeMenuItems = data.value;
		});
		menuService.getMenu(listurl, 'Equipment').then(function(data){
			$scope.equipmentMenuItems = data.value;
		});
		menuService.getMenu(listurl, 'Human Resources').then(function(data){
			$scope.hrMenuItems = data.value;
		});
	}
	$scope.getMenuItems();
	
	
}]);


app.directive('checkImage', function($http) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            attrs.$observe('ngSrc', function(ngSrc) {
                $http.get(ngSrc).success(function(){
                }).error(function(){
                    element.attr('src', '/_layouts/15/userphoto.aspx?size=L&accountname=zzzz@clydeinc.com'); // set default image
                });
            });
        }
    };
});
