
	var client='69af424226e15a6396dd';
	var secret='683d05837403207f247939ab21668065352b65db';
	var oauth = '?client_id='+client+'&client_secret='+secret;
	
/**************************
* Application
**************************/

var app = angular.module('gitBerApp', [])
.controller('recentSearch', function($scope) {

	$scope.recentList=[{name:""}];
	$scope.repoList=[
	             {
	            	 name: "",
                     created: "",
                     repoUrl: "",
                     language: "",
                     size: "",
                     avatar: "",
                     owner: "",
                     readme: "",
	             }
	             ];
	$scope.orgList=[
	                {
	                	orgUsername: ""
	                }];
	$scope.loadreposi = function() {
		var userN={name: $scope.username};
		$scope.recentList.push(userN);
        if ( $scope.username ) {
        	
            var url = 'https://api.github.com/users/'+username+'/repos'+oauth;
           
            $.getJSON(url,function(data){
                async.map(
                  data,
                  function(repo, callback){
				  var success = false;
                    var url = 'https://api.github.com/repos/'+username+'/'+repo.name+'/readme'+oauth;
                    $.getJSON(url, function(readme){
						success = true;
						repo.readmeFile = $.base64Decode(readme.content);
                      callback(null, repo);
                    });
					setTimeout(function() {
						if (!success)
						{
								repo.readmeFile = "No readme found";
								callback(null, repo);
						}
					}, 2200);
                  },
                  function(error, reposWithReadme){
                    $(reposWithReadme).each(function(index,value){
                      var repoElement={
                          name: value.name,
                          created: value.created_at,
                          repoUrl: value.clone_url,
                          language: value.language,
                          size: value.size,
                          avatar: value.owner.avatar_url,
                          owner: value.owner.login,
                          readme: value.readmeFile
                      };
                      $scope.repoList.push(repoElement);
                  });
                });
            });
       
        }
    }
	$scope.remove=function(item){
		$scope.recentList.splice($scope.recentList.indexOf(item),1);
	}
	$scope.loadOrganisation = function() {
			var organisation = $scope.orgname;
	        if ( organisation ) {
	            var url = 'https://api.github.com/orgs/'+organisation+'/members'+oauth;
	            $.getJSON(url,function(data){
	                $(data).each(function(index,value){
	                    var orgElement = {
	                        orgUsername: value.login
	                    };
	                    $scope.orgList.push(orgElement);
	                })
	            });
	        }
	}
	
	$scope.searchOrgUser=function(item){
		$scope.username=item.orgUserName;
		$scope.loadreposi();
	}
	
	$scope.loadUser=function(userInput){
		if ( userInput ) {
            var url = 'https://api.github.com/users/'+username+''+oauth;
            // push username to recent user array
                        $.getJSON(url,function(data){
               
                $(data).each(function(index,value){
                    var githubUserElement = {
                        username: value.login,
                        avatar: value.avatar_url,
                        name: value.name,
                        company: value.company,
                        blog: value.blog,
                        location: value.location,
                        email: value.email,
                        hireable: value.hireable,
                        bio: value.bio,
                        repos: value.public_repos,
                        followers: value.followers,
                        joined: value.created_at
                    };
                    $scope.githubUserList.push(githubUserElement);
                })
            });
        }$scope.recentList.push(username);
		
	}
    
});
