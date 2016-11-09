//define reposController
// define the module
var app = angular
  .module('app', ['ab-base64']);

app
  .constant("ghConstants", {
        oauth: '?client_id='+"69af424226e15a6396dd"+'&client_secret='+"683d05837403207f247939ab21668065352b65db",
        ghUsersApi: "https://api.github.com/users/",
        ghReposApi: "https://api.github.com/repos/",
        ghOrgsApi: "https://api.github.com/orgs/"
    })
  .controller("controller", [ "$scope", "ghConstants", "$http", "base64", function($scope, ghConstants, $http, base64) {
		$scope.orgMembers = [];
		
		$scope.username = '';
		$scope.loadrepos = function(username) {
	        if ( username ) {
	        	//reset the repository list
	        	$scope.userRepos=[];
	        	//add the user into the recent users search
	            $scope.addUser(username);
	            $http({
				  method: 'GET',
				  url: ghConstants.ghUsersApi + username+'/repos'+ ghConstants.oauth
				}).then(function successCallback(response) {
					console.log(response);
				    // this callback will be called asynchronously
				    // when the response is available
				    var repos = response.data;
				    repos.forEach(function(repo) {
					    $http({
						  method: 'GET',
						  url: ghConstants.ghReposApi + username +'/'+ repo.name+'/readme'+ ghConstants.oauth
						}).then(function successCallback(response) {
							//console.log(response.data.content);
							repo.readme = base64.decode(response.data.content);
							$scope.userRepos.push(repo);
						}, function errorCallback(response) {
							//console.log("error for repo");
							repo.readme = "No readme found";
							//console.log(repo);
							$scope.userRepos.push(repo);
						});
					});
					$scope.loadUser(username);
				}, function errorCallback(response) {
				    // called asynchronously if an error occurs
				    // or server returns response with an error status.
				});
        	}
    	}

    	//load a user profile using username
    	$scope.githubUser = {};
    	$scope.githubUserArray = [];
		$scope.loadUser = function(username) {
    		if ( username ) {
	            $http({
				  method: 'GET',
				  url: ghConstants.ghUsersApi + username+''+ ghConstants.oauth
				}).then(function successCallback(response) {
				    var data = response.data;
				    console.log(response);
				    
				    $scope.addUser(data.login);
	                $scope.githubUser = data;
				  }, function errorCallback(response) {
				
				  });
	        }

    	}

    	//load users under an organisation
    	$scope.organisationUserArray = []
    	$scope.loadOrganisation = function(organisation) {
	        if ( organisation ) {
	            $http({
				  method: 'GET',
				  url: ghConstants.ghOrgsApi+organisation+'/members'+ghConstants.oauth
				}).then(function successCallback(response) {
				    $scope.organisationUserArray = response.data;
				    console.log(response.data);
				  }, function errorCallback(response) {
				
				  });
	        }
	    };

		$scope.searchOrgUser = function(name){
	        $scope.username =  view.context.orgUsername;
	        $scope.loadrepos($scope.username);
	    };

    	//recent users management
		$scope.recentUsers = [];

		$scope.addUser = function(name){
			if ( $scope.recentUsers.indexOf(name) !== -1 ) {
				var index = $scope.recentUsers.indexOf(name);
  				$scope.recentUsers.splice(index, 1);
	        	$scope.recentUsers.push(name);
			} else {
				$scope.recentUsers.push(name);
			}
			
	        if ($scope.recentUsers.length > 5){
	            $scope.recentUsers.splice(0,1);
	        };
		}

		$scope.removeUser = function(name){
        	var index = $scope.recentUsers.indexOf(name);
  			$scope.recentUsers.splice(index, 1);
        	console.log("removed user");
    	}

    	$scope.searchAgain = function(name){
	        $scope.username =  name;
	        $scope.loadrepos(name);
    	}

    	$scope.reverse = function(){
        	return $scope.recentUsers.toArray().reverse();
    	}	
	}])
  .directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter, {'event': event});
                    });

                    event.preventDefault();
                }
            });
        };
    });
