/*This is a the angular app */

var app = angular.module("trucksApp", ["ngSanitize"]);

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

		$scope.submitKey = function(){
			//var charCode = (typeof event.which == "number") ? event.which : event.keyCode;
			//alert(charCode)
			if (event.charCode == 13){
				$scope.refreshEmployeeInfo();
			}
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
