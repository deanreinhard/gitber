var app = angular.module('login',[]).controller('loginController',function($scope,$http){
//injected angular scope and http modules



var client='69af424226e15a6396dd';
var secret='683d05837403207f247939ab21668065352b65db';
var oauth = '?client_id='+client+'&client_secret='+secret;
$scope.recentSearch = [];
 $scope.readmeFile=[];
 $scope.value="";
$scope.search = function(){
		//Added username to array to display in the recent search 
	
	$scope.recentSearch.push($scope.username);
}

$scope.searchAgain = function(username){
		
		
		//check duplication and prevent them
		if($scope.recentSearch.indexOf(username)==-1)
			$scope.recentSearch.push(username);
			
		//check length is not more than 5 in recentSearch
		if($scope.recentSearch.length>=5)
			$scope.recentSearch.pop();
			
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
								  readme: $scope.decodeReadMe(value.name,username)});
						
					   
					   
		   });

		}).error(function(data){
		console.log(data);
		});
		//Calling $scope function to display user details
		$scope.setuser(username);
}

$scope.remove = function(index){
		//used to remove the element given by X button in recentSearch array //It works fine for 2nd to last element to so on... but when used track by index with reverse have issue with angular 1.5. for 1st element removal 
		$scope.recentSearch.splice(index,1);
}
$scope.decodeReadMe=function(repoName,username){
var val="";
//call this function during setting values in searchAgain method for readme. able to print decoded value but the method not returning the string
	if(repoName)
		 var url = 'https://api.github.com/repos/'+username+'/'+repoName+'/readme'+oauth;
		 
		 $http.get(url).success(function(readme){
				if(readme.status===404)
					return "No readme found";
				else{
				var val=($.base64Decode(readme.content));
				console.log(val);
				return val;
				}				
					 	
				
		 }).error(function(readme){
		 if(readme.status===404)
					return "No readme found";
					
		
			
			return "No readme found";
		 })
		 

}
$scope.setuser = function(username){
//used to set User Bio details
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
//This method loads all members into the Organisation search using members array, // upon clicking the member it call searchAgain method from the front end. 
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