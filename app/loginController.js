var app = angular.module('login',[]).controller('loginController',function($scope,$http){
//injected angular scope and http modules

$scope.search = function(){
	//prefer to show the user name and then go for searching
	$scope.recentSearch = $scope.username;
}

var client='69af424226e15a6396dd';
var secret='683d05837403207f247939ab21668065352b65db';
var oauth = '?client_id='+client+'&client_secret='+secret;

$scope.searchAgain = function(username){
		$scope.content=[];
		if(username)
		  var url = 'https://api.github.com/users/'+username+'/repos'+oauth;
		  
		$http.get(url).success(function(data){
		console.log(data);
		//used angular ng-model to map in HTML page. So i am setting the key based on the ng-model name in index2.html
		angular.forEach(data, function(value, key){
						var val = value;
						console.log("var"+val.name+key)
						$scope.content.push({name: value.name,
								  created: value.created_at,
								  repoUrl: value.clone_url,
								  language: value.language,
								  size: value.size,
								  avatar: value.owner.avatar_url,
								  owner: value.owner.login,
								  readme: value.readmeFile});
						
					   
					   
		   });

		}).error(function(data){
		console.log(data);
		});
		//Calling $scope function to display user details
		$scope.setuser(username);
}
$scope.decodeReadMe=function(repoName,username){
 $scope.readmeFile=[];
	if(repoName)
		 var url = 'https://api.github.com/repos/'+username+'/'+repoName+'/readme'+oauth;
		 
		 $http.get(url).success(function(readme){
		
		 readmeFile = $.base64Decode(readme);
		 
		 }).error(function(readme){
			readmeFile="No readme found";
		 })
		 return readmeFile;

}
$scope.setuser = function(username){
		$scope.user=[];
					if(username)
						var url = 'https://api.github.com/users/'+username+''+oauth;
						$http.get(url).success(function(data){
						console.log(data);
							//Since it is Single value mapped directly to the JSON Array.
							$scope.user=data;
						
								
							}).error(function(data){
								console.log(data);
							});
							
}

$scope.organisationSearch = function(organisation){
$scope.members=[];
if ( organisation ) 
            var url = 'https://api.github.com/orgs/'+organisation+'/members'+oauth;
			
			
	$http.get(url).success(function(data){
		angular.forEach(data,function(value,key){
		$scope.members.push({'name':value.login});
		});
	}).error(function(data){
		console.log(data);
	});







}

//use Base64 plugin mormally in Angular 
	
})