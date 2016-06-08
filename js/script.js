var app = angular.module("shareholderApp", ["ngSanitize","ngRoute","ui.bootstrap",  ]);
var weburl = _spPageContextInfo.webServerRelativeUrl.replace(/\/$/g,'');
var contexturl = weburl + "/_api/ContextInfo";

var questionCount = 3;
var submitted = 1;
//get the current year
var year = (new Date).getFullYear();
visited = false;
var shareId;

app.config(function($routeProvider){
	$routeProvider.when("/", {templateUrl: "/shareholders/SiteAssets/views/view-home.html", controller:"homeController"})
	.when("/meeting", {templateUrl: "/shareholders/SiteAssets/views/view-meeting.html", controller:"meetingController"})
	.when("/review", {templateUrl: "/shareholders/SiteAssets/views/view-review.html", controller:"reviewController"})
	.when("/services", {templateUrl: "/shareholders/SiteAssets/views/view-services.html", controller:"servicesController"})
	.when("/information", {templateUrl: "/shareholders/SiteAssets/views/view-information.html", controller:"informationController"})
	.when("/vote", {templateUrl: "/shareholders/SiteAssets/views/view-vote.html", controller:"voteController"})
	.when("/board", {templateUrl: "/shareholders/SiteAssets/views/view-board.html", controller:"boardController"})
	.when("/officers", {templateUrl: "/shareholders/SiteAssets/views/view-officers.html", controller:"officerController"})
	.otherwise({redirectsTo: "/"})
});
app.controller("menuController", ["$scope", "$http", "$routeParams", "$location", "$modal",function($scope,$http,$routeParams,$location, $modal){
	var listurl = weburl + "/_api/web/lists/GetByTitle('Navigation')/items";
	$scope.menu = [];
	var refreshMenu = function () {
		  $http.get(listurl + "?$select=Title,cnms").
		  success(function (data) { 
			$scope.menu = data.value;
		  }).
		  error(function (data) { alert(data['odata.error'].message.value); });
		};
		refreshMenu();
	$scope.navigate = function(path){
	//update the view
	$location.path(path);
	//make sure user is in admin group
	$scope.admins = [];
	listurl = weburl + "/_api/web/sitegroups/getbyname('shareholders%20Owners')/users";
	var refreshAdmins = function () {
		$http.get(listurl + "?$select=Title,Email").
		success(function (data) { 
		$scope.admins = data.value;
		getEmailAddress("Email", function(email){
			//check if the logged in user is an admin (show the controls)
			$.each($scope.admins, function(i,obj) {
				if (obj.Email === email) { $("#admin").show();}
			});
		  });
		}).
		error(function (data) {alert(data['odata.error'].message.value); });
	};
	refreshAdmins();
	};
}]);
app.controller("homeController", ["$scope", "$http", "$modal",function($scope, $http, $modal){
	$scope.visited = [];
	//always check that the person is an authorized shareholder and has accepted the license agreement
	getEmailAddress("Email", function(email){
	var refreshShareholders = function (email) {
	listurl = weburl + "/_api/web/lists/GetByTitle('Shares')/items";
	  $http.get(listurl + "?$select=Visited,ID&$filter=Email eq '" + email + "'").
	  success(function (data) { 
		if(data.value[0]){
			$scope.visited = data.value;
			visited = $scope.visited[0].Visited;
			shareId = $scope.visited[0].ID;
			if(!$scope.visited[0].Visited){
				$modal.open({
					templateUrl: 'myLicenseAgreementModalContent.html',
					controller: 'modalController',
					backdrop: 'static',
					keyboard: false
				  });
			}
			else{
				//accepted agreement do nothing
			}
	  }else{
			//not a shareholder (definitely)
			$modal.open({
				templateUrl: 'myShareholderModalContent.html',
				controller: 'modalController',
				backdrop: 'static',
				keyboard: false
			  });
			
		}
	  }).
	  error(function (data) { alert(data['odata.error'].message.value); });
	};
	refreshShareholders(email);    
	}); 
	var listurl = weburl + "/_api/web/lists/GetByTitle('Home Page')/items";
		$scope.carousel = [];
		var refreshCarousel = function () {
		  $http.get(listurl + "?$select=Title,d40a,zojc").
		  success(function (data) { 
			$scope.carousel = data.value;
		  }).
		  error(function (data) { alert(data['odata.error'].message.value); });
		};
		refreshCarousel();
	
}]);
app.controller("meetingController", ["$scope", "$http", "$modal", function($scope, $http, $modal){
	//always check that the person is an authorized shareholder and has accepted the license agreement
	getEmailAddress("Email", function(email){
	var refreshShareholders = function (email) {
	listurl = weburl + "/_api/web/lists/GetByTitle('Shares')/items";
	  $http.get(listurl + "?$select=Visited,ID&$filter=Email eq '" + email + "'").
	  success(function (data) {
		if(data.value[0]){
			$scope.visited = data.value;
			visited = $scope.visited[0].Visited;
			shareId = $scope.visited[0].ID;
			if(!$scope.visited[0].Visited){
				$modal.open({
					templateUrl: 'myLicenseAgreementModalContent.html',
					controller: 'modalController',
					backdrop: 'static',
					keyboard: false
				  });
			}
			else{
				//accepted agreement do nothing
			}
	  }else{
			//not a shareholder (definitely)
			$modal.open({
				templateUrl: 'myShareholderModalContent.html',
				controller: 'modalController',
				backdrop: 'static',
				keyboard: false
			  });
			
		}
	  }).
	  error(function (data) { alert(data['odata.error'].message.value); });
	};
	refreshShareholders(email);    
	}); 
	//always open modal with statement on view load
	$scope.minutes = [];
	var listurl = weburl + "/_api/web/lists/GetByTitle('Minutes')/items";
		var refreshMinutes = function () {
		  $http.get(listurl + "?$select=FileLeafRef,Year,FileRef").
		  success(function (data) { 
			$scope.minutes = data.value;
		  }).
		  error(function (data) { alert(data['odata.error'].message.value); });
		};
		refreshMinutes();
		
	$scope.agendas = [];
	var listurl = weburl + "/_api/web/lists/GetByTitle('Agenda')/items";
		var refreshAgenda = function () {
		  $http.get(listurl + "?$select=Title,hadh,qoft,BulletPoints,smeq,Notice").
		  success(function (data) { 
			$scope.agendas = data.value;
		  }).
		  error(function (data) { alert(data['odata.error'].message.value); });
		};
		 refreshAgenda();
	 
}]);
app.controller("reviewController", ["$scope", "$http", "$modal", function($scope, $http, $modal){
	//always check that the person is an authorized shareholder and has accepted the license agreement
	getEmailAddress("Email", function(email){
	var refreshShareholders = function (email) {
	listurl = weburl + "/_api/web/lists/GetByTitle('Shares')/items";
	  $http.get(listurl + "?$select=Visited,ID&$filter=Email eq '" + email + "'").
	  success(function (data) { 
		if(data.value[0]){
			$scope.visited = data.value;
			visited = $scope.visited[0].Visited;
			shareId = $scope.visited[0].ID;
			if(!$scope.visited[0].Visited){
				$modal.open({
					templateUrl: 'myLicenseAgreementModalContent.html',
					controller: 'modalController',
					backdrop: 'static',
					keyboard: false
				  });
			}
			else{
				//accepted agreement do nothing
			}
	  }else{
			//not a shareholder (definitely)
			$modal.open({
				templateUrl: 'myShareholderModalContent.html',
				controller: 'modalController',
				backdrop: 'static',
				keyboard: false
			  });
			
		}
	  }).
	  error(function (data) { alert(data['odata.error'].message.value); });
	};
	refreshShareholders(email);    
	});
	
	var listurl = weburl + "/_api/web/lists/GetByTitle('Financial Review')/items";
	$scope.reviews = [];
	var refreshData = function () {
	  $http.get(listurl + "?$select=FileLeafRef,Year,FileRef").
	  success(function (data) { 
		$scope.reviews = data.value;
	  }).
	  error(function (data) { alert(data['odata.error'].message.value); });
	};
	refreshData();
}]);
app.controller("servicesController", ["$scope", "$http", "$modal", function($scope, $http, $modal){
	//always check that the person is an authorized shareholder and has accepted the license agreement
	getEmailAddress("Email", function(email){
	var refreshShareholders = function (email) {
	listurl = weburl + "/_api/web/lists/GetByTitle('Shares')/items";
	  $http.get(listurl + "?$select=Visited,ID&$filter=Email eq '" + email + "'").
	  success(function (data) { 
		if(data.value[0]){
			$scope.visited = data.value;
			visited = $scope.visited[0].Visited;
			shareId = $scope.visited[0].ID;
			if(!$scope.visited[0].Visited){
				$modal.open({
					templateUrl: 'myLicenseAgreementModalContent.html',
					controller: 'modalController',
					backdrop: 'static',
					keyboard: false
				  });
			}
			else{
				//accepted agreement do nothing
			}
	  }else{
			//not a shareholder (definitely)
			$modal.open({
				templateUrl: 'myShareholderModalContent.html',
				controller: 'modalController',
				backdrop: 'static',
				keyboard: false
			  });
			
		}
	  }).
	  error(function (data) { alert(data['odata.error'].message.value); });
	};
	refreshShareholders(email);    
	}); 
	
	var listurl = weburl + "/_api/web/lists/GetByTitle('Shareholder Forms')/items";
	$scope.forms = [];
	var refreshData = function () {
	  $http.get(listurl + "?$select=FileLeafRef,FileRef,Section,Order0").
	  success(function (data) { 
		$scope.forms = data.value;
	  }).
	  error(function (data) { alert(data['odata.error'].message.value); });
	};
	refreshData(); 
}]);
app.controller("informationController", ["$scope", "$http", "$modal", function($scope, $http, $modal){
	//always check that the person is an authorized shareholder and has accepted the license agreement
	getEmailAddress("Email", function(email){
	var refreshShareholders = function (email) {
	listurl = weburl + "/_api/web/lists/GetByTitle('Shares')/items";
	  $http.get(listurl + "?$select=Visited,ID&$filter=Email eq '" + email + "'").
	  success(function (data) { 
		if(data.value[0]){
			$scope.visited = data.value;
			visited = $scope.visited[0].Visited;
			shareId = $scope.visited[0].ID;
			if(!$scope.visited[0].Visited){
				$modal.open({
					templateUrl: 'myLicenseAgreementModalContent.html',
					controller: 'modalController',
					backdrop: 'static',
					keyboard: false
				  });
			}
			else{
				//accepted agreement do nothing
			}
	  }else{
			//not a shareholder (definitely)
			$modal.open({
				templateUrl: 'myShareholderModalContent.html',
				controller: 'modalController',
				backdrop: 'static',
				keyboard: false
			  });
			
		}
	  }).
	  error(function (data) { alert(data['odata.error'].message.value); });
	};
	refreshShareholders(email);    
	}); 
	FB = null;
	var appId = "629055593912156";
	(function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0];
	  js = d.createElement(s); 
	  js.id = id;
	  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=" + appId + "&version=v2.5";
	  fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
	
	//get all links to notices
	var listurl = weburl + "/_api/web/lists/GetByTitle('Additional Notices')/items";
	$scope.notices = [];
	var refreshNotices = function () {
	  $http.get(listurl + "?$select=Title,DateOfNotice,linkToNotice").
	  success(function (data) { 
		$scope.notices = data.value;
	  }).
	  error(function (data) { alert(data['odata.error'].message.value); });
	};
	refreshNotices();
	
}]);
app.controller("voteController", ["$scope", "$http", "$modal", function($scope, $http, $modal, $modalInstance){
	//always check that the person is an authorized shareholder and has accepted the license agreement
	getEmailAddress("Email", function(email){
	var refreshShareholders = function (email) {
	listurl = weburl + "/_api/web/lists/GetByTitle('Shares')/items";
	  $http.get(listurl + "?$select=Visited,ID&$filter=Email eq '" + email + "'").
	  success(function (data) { 
		if(data.value[0]){
			$scope.visited = data.value;
			visited = $scope.visited[0].Visited;
			shareId = $scope.visited[0].ID;
			if(!$scope.visited[0].Visited){
				$modal.open({
					templateUrl: 'myLicenseAgreementModalContent.html',
					controller: 'modalController',
					backdrop: 'static',
					keyboard: false
				  });
			}
			else{
				//accepted agreement do nothing
			}
	  }else{
			//not a shareholder (definitely)
			$modal.open({
				templateUrl: 'myShareholderModalContent.html',
				controller: 'modalController',
				backdrop: 'static',
				keyboard: false
			  });
			
		}
	  }).
	  error(function (data) { alert(data['odata.error'].message.value); });
	};
	refreshShareholders(email);    
	});
	
	$scope.agenda = [];
	var listurl = weburl + "/_api/web/lists/GetByTitle('Agenda')/items";
		var refreshAgenda = function () {
		  $http.get(listurl + "?$select=grfq,smeq").
		  success(function (data) { 
			$scope.agenda = data.value;
		  }).
		  error(function (data) { alert(data['odata.error'].message.value); });
		};
	refreshAgenda();
	//get the president
	var listurl = weburl + "/_api/web/lists/GetByTitle('Nominees')/items";
	$scope.presidents = [];
	var refreshPresidents = function () {
	  $http.get(listurl + "?$select=Title&$filter=President eq '1'").
	  success(function (data) { 
		$scope.presidents = data.value;
	  }).
	  error(function (data) { alert(data['odata.error'].message.value); });
	};
	refreshPresidents();
	//get the nominees
	listurl = weburl + "/_api/web/lists/GetByTitle('Nominees')/items";
	$scope.nominees = [];
	$scope.againstNominees = [];
	var refreshNominees = function () {
	  $http.get(listurl + "?$select=Title,ID").
	  success(function (data) { 
		$scope.nominees = data.value;
		for (var m=0; m <  $scope.nominees.length; m++){
			$scope.againstNominees.push(0);
		}
	  }).
	  error(function (data) { alert(data['odata.error'].message.value); });
	};
	refreshNominees();
	
	//tabulation of votes
	$scope.refreshTabulation = function () {
		var withheldNominees = [];
		$scope.againstNominees = [];
		var squireVotesFor = [];
		var squireVotesAgainst = [];
		var squireVotesAbstain = [];
		
		for (var m=0; m <  $scope.nominees.length; m++){
			$scope.againstNominees.push(0);
		}
		//total shares
		listurl = weburl + "/_api/web/lists/GetByTitle('Shares')/items";
		$http.get(listurl +"?select=j7z9&$top=1000").
		success(function (data) {
			var shares = data.value;
			$scope.total = 0;
			for(var i = 0; i < shares.length; i++){
				if(shares[i].j7z9){
					$scope.total += parseInt((shares[i].j7z9).replace(/,/g, ""));
				}
			}
		}).
		error(function (data) { alert(data['odata.error'].message.value); });
		
		//total votes
		listurl = weburl + "/_api/web/lists/GetByTitle('Votes')/items"; 
		$http.get(listurl +"?select=Title,NameId,Vote,WithheldId&$top=5000").
		success(function (data) {
			var votes = data.value;
			var ids = groupBy(votes, 'NameId');
			for(var i = 0; i < votes.length; i++){
				var obj = {id : votes[i].NameId, withheldId : votes[i].WithheldId}; 
					if(votes[i].Title === "1"){//question 1				
						if(votes[i].Vote === "Withhold" || votes[i].WithheldId){
							withheldNominees.push(obj);
						}
						
					}
					else{//question 2
						if(votes[i].Vote === "For"){
							squireVotesFor.push(votes[i].NameId); 
						}
						else if(votes[i].Vote === "Against"){
							squireVotesAgainst.push(votes[i].NameId);
						}
						else if(votes[i].Vote === "Abstain"){
							squireVotesAbstain.push(votes[i].NameId);
						}
						else{
							//weird (not vote)
							alert("Error: Missing Vote");
						}
					}
			}
			listurl = weburl + "/_api/web/lists/GetByTitle('Shares')/items";
			$http.get(listurl +"?select=j7z9,ID&$top=1000").
			success(function (data) {
				var shares = data.value;
				var withheldNomineesBefore = withheldNominees;
				withheldNominees = groupBy(withheldNominees, 'id');
				$scope.voted = 0;
				$scope.withheld = 0;
				$scope.forSquire = 0;
				$scope.againstSquire = 0;
				$scope.abstainSquire = 0;
				for(var i = 0; i < shares.length; i++){
					for(var j = 0; j < ids.length; j++){  
						if(ids[j] == shares[i].ID){
							if(shares[i].j7z9){
								$scope.voted += parseInt((shares[i].j7z9).replace(/,/g, "")); 
							}
							break; 
						} 
					}
				
					for(var k = 0; k < withheldNominees.length; k++){
						var notAll = 0;
						for(var n = 0; n < withheldNomineesBefore.length; n++){
							if(withheldNominees[k] == withheldNomineesBefore[n].id){
								notAll++;
							}
						}
						if(withheldNominees[k]  == shares[i].ID && notAll == $scope.nominees.length ){
							$scope.withheld += parseInt((shares[i].j7z9).replace(/,/g, ""));
							break; 
						}
					}
					
					for(var l = 0; l < withheldNomineesBefore.length; l++){
						if(withheldNomineesBefore[l].id  == shares[i].ID){
							if(shares[i].j7z9){
								$scope.againstNominees[withheldNomineesBefore[l].withheldId - 1] += parseInt((shares[i].j7z9).replace(/,/g, "")); 
							}
						}
					}
					//squire Votes
					for(var j = 0; j < squireVotesFor.length; j++){  
						if(squireVotesFor[j] == shares[i].ID){
							if(shares[i].j7z9){
								$scope.forSquire += parseInt((shares[i].j7z9).replace(/,/g, "")); 
							}
							break; 
						} 
					}
					for(var j = 0; j < squireVotesAgainst.length; j++){  
						if(squireVotesAgainst[j] == shares[i].ID){
							if(shares[i].j7z9){
								$scope.againstSquire += parseInt((shares[i].j7z9).replace(/,/g, "")); 
							}
							break; 
						} 
					}
					for(var j = 0; j < squireVotesAbstain.length; j++){  
						if(squireVotesAbstain[j] == shares[i].ID){
							if(shares[i].j7z9){
								$scope.abstainSquire += parseInt((shares[i].j7z9).replace(/,/g, "")); 
							}
							break; 
						} 
					}
				}
			}).
			error(function (data) { alert(data['odata.error'].message.value); });
		}).
		error(function (data) { alert(data['odata.error'].message.value); });
		
		//set the year
		$("#year").text(year);
	};
	
	$scope.refreshTabulation();
	
	//get All Shareholders
	listurl = weburl + "/_api/web/lists/GetByTitle('Shares')/items";
	$scope.AllShareholders = [];
	var refreshAllShareholders = function () {
	  $http.get(listurl + "?$select=Title,Email&$top=1000").
	  success(function (data) { 
		$scope.AllShareholders = data.value;
	  }).
	  error(function (data) { alert(data['odata.error'].message.value); });
	};
	refreshAllShareholders(); 
	
	//get shareholders
	$scope.shareholders = [];
	getEmailAddress("Email", function(email){
		var refreshShareholders = function (email) {
		listurl = weburl + "/_api/web/lists/GetByTitle('Shares')/items";
		  $http.get(listurl + "?$select=Title,j7z9,ID&$filter=Email eq '" + email + "'").
		  success(function (data) { 
			$scope.shareholders = data.value;
			listurl = weburl + "/_api/web/lists/GetByTitle('Votes')/items";
			if(data.value[0]){
			$http.get(listurl +"?select=Name&$filter=Name eq '" + data.value[0].ID + "' and Year eq '" + year + "'").
			success(function (data) {
				if(data.value.length){
					submitted = 0;
				}
				ready();
			}).
			error(function (data) { alert(data['odata.error'].message.value); });
		  }else{
			$("#loading").html("<h2>No Shares Found! </h2>");
		  }
		  }).
		  error(function (data) { alert(data['odata.error'].message.value); });
		};
		refreshShareholders(email);	
		});
		
	$scope.refreshShareholder = function () {
		$scope.shareholders = [];
		listurl = weburl + "/_api/web/lists/GetByTitle('Shares')/items";
		$http.get(listurl + "?$select=Title,j7z9,ID&$filter=Email eq '" + $scope.item.Email + "'").
		success(function (data) { 
		$scope.shareholders = data.value;
		listurl = weburl + "/_api/web/lists/GetByTitle('Votes')/items";
		if(data.value[0])
		$http.get(listurl +"?select=Name&$filter=Name eq '" + data.value[0].ID + "' and Year eq '" + year + "'").
		success(function (data) {
			if(data.value.length){
				submitted = 0;
			}
			else{
				submitted = 1;
			}
			ready();
		}).
		error(function (data) { alert(data['odata.error'].message.value); });
	  }).
	  error(function (data) { alert(data['odata.error'].message.value); });
	};
	var $modalInstance;
	
	$scope.submitSurvey = function() {
		var batchExecutor = new RestBatchExecutor(weburl, { 'X-RequestDigest': $('#__REQUESTDIGEST').val() });
		listurl = weburl + "/_api/web/lists/GetByTitle('Votes')/items";
		var batchRequest;
		//survey is over (return to homepage)
		$("[id=shareholder]").each(function(){
			var name = $(this).children("#fullNameID").text() + ";#" + $(this).children("#fullName").text();
			var shares =  $(this).children("#shares").text();
			for(var questionNumber = 1; questionNumber <= questionCount; questionNumber++)
			{
				if(questionNumber != 3)
				{
					
					var vote = $('input[name=vote'+ questionNumber +']:checked').val();
					var withheld = "";
					var withheldId ="";
					if(questionNumber == 1)
					{				
						$("input[name=nominees]").each(function(){
							batchRequest = new BatchRequest();
							
							//determine the payload
							withheldId = $(this).next().text();
							withheld = "";
							if($(this).is(":checked")){
								
							}
							else{//unchecked
								withheld = $(this).val();
							}
							
							if(withheld === ""){
								batchRequest.payload = { '__metadata': { 'type': 'SP.Data.VotesListItem' }, 'Title': questionNumber+"",'Vote':vote,'NameId':name.split(";")[0],'Year':year+"" };
							}
							else{
								batchRequest.payload = { '__metadata': { 'type': 'SP.Data.VotesListItem' }, 'Title': questionNumber+"",'Vote':vote,'NameId':name.split(";")[0],'WithheldId':withheldId,'Year':year+"" };
							}
							batchRequest.endpoint = listurl;
							batchRequest.verb = "POST";
							batchExecutor.loadChangeRequest(batchRequest);
						});
					}
					else{
						batchRequest = new BatchRequest();	
						batchRequest.payload = { '__metadata': { 'type': 'SP.Data.VotesListItem' }, 'Title': questionNumber+"",'Vote':vote,'NameId':name.split(";")[0],'Year':year+"" };
						batchRequest.endpoint = listurl;
						batchRequest.verb = "POST";
						batchExecutor.loadChangeRequest(batchRequest);
									
					}
				}
			}
		});
		//post all the results to Sharepoint and redirect
		batchExecutor.executeAsync().done(function (result){
			$modal.open({
				templateUrl: 'myVoteModalContent.html',
				controller: 'modalController',
				backdrop: 'static'
			  });
		}).fail(function (err) {
			alert(JSON.stringify(err));
		});
	 
	};
	
}]);
app.controller("officerController", ["$scope", "$http", "$modal", function($scope, $http, $modal){
	//always check that the person is an authorized shareholder and has accepted the license agreement
	getEmailAddress("Email", function(email){
	var refreshShareholders = function (email) {
	listurl = weburl + "/_api/web/lists/GetByTitle('Shares')/items";
	  $http.get(listurl + "?$select=Visited,ID&$filter=Email eq '" + email + "'").
	  success(function (data) { 
		if(data.value[0]){
			$scope.visited = data.value;
			visited = $scope.visited[0].Visited;
			shareId = $scope.visited[0].ID;
			if(!$scope.visited[0].Visited){
				$modal.open({
					templateUrl: 'myLicenseAgreementModalContent.html',
					controller: 'modalController',
					backdrop: 'static',
					keyboard: false
				  });
			}
			else{
				//accepted agreement do nothing
			}
	  }else{
			$modal.open({
				templateUrl: 'myShareholderModalContent.html',
				controller: 'modalController',
				backdrop: 'static',
				keyboard: false
			  });
			
		}
	  }).
	  error(function (data) { alert(data['odata.error'].message.value); });
	};
	refreshShareholders(email);    
	}); 
	
	//get all the officers and their information
	var listurl = weburl + "/_api/web/lists/GetByTitle('Meet the Officers')/items";
	$scope.officers = [];
	var refreshOfficers = function () {
	  $http.get(listurl + "?$select=Title,photo,BIO,email&$filter=isOfficer eq 1").
	  success(function (data) { 
		$scope.officers = data.value;
	  }).
	  error(function (data) { alert(data['odata.error'].message.value); });
	};
	refreshOfficers();
	//get all the presidents and their information
	var listurl = weburl + "/_api/web/lists/GetByTitle('Meet the Officers')/items";
	$scope.presidents = [];
	var refreshPresidents = function () {
	  $http.get(listurl + "?$select=Title,photo,BIO,email&$filter=isPresident eq 1").
	  success(function (data) { 
		$scope.presidents = data.value;
	  }).
	  error(function (data) { alert(data['odata.error'].message.value); });
	};
	refreshPresidents(); 	
}]);
app.controller("boardController", ["$scope", "$http", "$modal", function($scope, $http, $modal){
	//always check that the person is an authorized shareholder and has accepted the license agreement
	getEmailAddress("Email", function(email){
	var refreshShareholders = function (email) {
	listurl = weburl + "/_api/web/lists/GetByTitle('Shares')/items";
	  $http.get(listurl + "?$select=Visited,ID&$filter=Email eq '" + email + "'").
	  success(function (data) { 
		if(data.value[0]){
			$scope.visited = data.value;
			visited = $scope.visited[0].Visited;
			shareId = $scope.visited[0].ID;
			if(!$scope.visited[0].Visited){
				$modal.open({
					templateUrl: 'myLicenseAgreementModalContent.html',
					controller: 'modalController',
					backdrop: 'static',
					keyboard: false
				  });
			}
			else{
				//accepted agreement do nothing
			}
	  }else{
			$modal.open({
				templateUrl: 'myShareholderModalContent.html',
				controller: 'modalController',
				backdrop: 'static',
				keyboard: false
			  });
			
		}
	  }).
	  error(function (data) { alert(data['odata.error'].message.value); });
	};
	refreshShareholders(email);    
	}); 
	
	//get all the officers and their information
	var listurl = weburl + "/_api/web/lists/GetByTitle('Meet the Officers')/items";
	$scope.boards = [];
	var refreshBoard = function () {
	  $http.get(listurl + "?$select=Title,photo,BIO,email&$filter=isBoard eq 1").
	  success(function (data) { 
		$scope.boards = data.value;
	  }).
	  error(function (data) { alert(data['odata.error'].message.value); });
	};
	refreshBoard();
}]);
app.controller('modalController', function ($scope, $modalInstance, $http) {
//close modal and redirect to main site
  $scope.ok = function () {
    $modalInstance.dismiss('ok');
	//site has been visited (meaning they accepted the agreement)
    if(!visited){
        //update sharepoint list
		var batchExecutor = new RestBatchExecutor(weburl, { 'X-RequestDigest': $('#__REQUESTDIGEST').val()});
		var restUrl = weburl + "/_api/web/lists/getbytitle('Shares')/items(" + shareId + ")";
		var batchRequest = new BatchRequest();
		batchRequest.payload = { '__metadata': {'type': 'SP.Data.SharesListItem'},'Visited' : !visited };
		batchRequest.headers = { 'IF-MATCH': "*" };
		batchRequest.endpoint = restUrl;
		batchRequest.verb = "MERGE";
		batchExecutor.loadChangeRequest(batchRequest);
		
		batchExecutor.executeAsync().done(function (result){
		}).fail(function (err) {
			alert(JSON.stringify(err));
		});
		
    }
	//always reload the page
	if(visited){
		location.reload();
	}
  };
});
function groupBy(items,propertyName)
{
    var result = [];
    $.each(items, function(index, item) {
       if ($.inArray(item[propertyName], result)==-1) {
          result.push(item[propertyName]);
       }
    });
    return result;
}

function showTabulations(){
	$("#tabulationControl").toggle();
}
function hideWithHold(){ 
	//un-check all the boxes
	$('.check').prop('checked', false);
	//hide checkboxes
	$('#witholdInfo').hide();
	$('.check').toggle();
}
function showWithHold()
{
	$('#witholdInfo').show();
	//check all the boxes
	$('.check').prop('checked', true);
	$('.check').toggle();
}
function showAdminControls(){
	$("#adminControl").toggle();
}
function getCurrentDate()
{
	var d = new Date();
	var month = d.getMonth()+1;
	var day = d.getDate();

	return (month<10 ? '0' : '') + month + '/' + (day<10 ? '0' : '') + day + '/' ;
}
function getEmailAddress(property, callback)
{	
	$.ajax({
		url: weburl + "/_api/sp.userprofiles.peoplemanager/getmyproperties?$select=" + property,
		type: "GET",
		headers: { "accept": "application/json;odata=verbose" },
		success: function(data) {
			callback(data.d.Email);
		},
		error: function(data) {
			alert("Error: " + data.d);
		}
		
	});
}

function ready()
{	
	//set all year values in survey
	$("#year").text(year);
	
	//set all date info
	date = getCurrentDate();
	$("#date").text(date + year);
	//you have until May 5th @4:00pm of the current year to complete the survey (and if already submitted for the year)
							  //"05/05/2015 16:00:00"
	if((new Date() > Date.parse("March 14, " + year + " 00:00:00")) && (new Date() < Date.parse("12/05/" + year + " 16:00:00")) && submitted)
	{
		//set all year info
		$('span[id="year"]').each(function(){
			$(this).text(year);
		});
		
		//show survey when all data is populated
		$("#header").text("");
		$("#messageBegin").show();
		$("#messageEnd").show();
		$("#surveyQuestions").show();
		$("#submit").show();
	}
	else{
		$("#messageBegin").hide();
		$("#messageEnd").hide();
		$("#surveyQuestions").hide();
		$("#submit").hide();
		$("#header").text("");
		if(!(submitted))
		{
			$("#header").append("<lead>You are only allowed to take the Proxy Survey once a year.<br>Please come back to cast your vote between April 1st and 10pm the night before the May Shareholder meeting.<br>If you wish to change your vote, please send your request to <a href='mailto:shareholders@clydeinc.com'>shareholders@clydeinc.com</a></lead>");
		}
		else{
			$("#header").append("<lead>The Proxy Survey has been closed for the year.<br>Please come back to cast your vote between April 1st and 10pm the night before the May Shareholder meeting.<br>If you wish to change your vote, please send your request to <a href='mailto:shareholders@clydeinc.com'>shareholders@clydeinc.com</a></lead>");
		}
	}
	$("#loading").hide();
	
}
function agree(){
  if($('#agreeBox').prop("checked")) {
    $('#okButton').show();
  } else {
    $('#okButton').hide();
  }
}
$(document).on('click','.navbar-collapse.in',function(e) {
    if( $(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle' ) {
		 $(this).collapse('hide');
    }
});
window.addEventListener("load",function() {
    // Set a timeout...
    setTimeout(function(){
        // Hide the address bar!
        window.scrollTo(0, 1);
    }, 1000);
});