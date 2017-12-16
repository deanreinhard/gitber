App = angular.module('App', []);

var client='69af424226e15a6396dd';
var secret='683d05837403207f247939ab21668065352b65db';
var oauth = '?client_id='+client+'&client_secret='+secret;


App.controller('ApplicationController',function($scope,$http){
  $scope.recentSearches = [];
  $scope.repoData = [];
  $scope.orgUsers = [];
  $scope.userBio = {}
  $scope.searchText = '';

  // ALL the $http calls should be moved to service but i have kept them in controller for now.

  // to remove search from recentsearches
  $scope.removeFromSearch = function(username){
    $scope.recentSearches.splice($scope.recentSearches.indexOf(username),1);
  }

  // trigegrs on OnSearch from the search text for users
  // also called from recentSearches list for an item to search again
  $scope.onSearch = function(searchText)
  {
    if(searchText)
    {
      var index = $scope.recentSearches.indexOf(searchText);

      if(index === -1)
      {
          $scope.recentSearches.push(searchText);
      }
      $scope.searchText = searchText;
    }

    $scope.loadRepos(searchText);
    $scope.loadUserBio(searchText);
  }

  // load repos of uses on seach
  $scope.loadRepos = function(searchText)
  {
    if ( searchText )
    {
        $scope.repoData= [];
        var url = 'https://api.github.com/users/'+searchText+'/repos'+oauth;
        $http.get(url).then(function(res){
            var data = res.data;

            data.forEach(function(repo)
            {
              var repoObj = {
                  name: repo.name,
                  created: repo.created_at,
                  repoUrl: repo.clone_url,
                  language: repo.language,
                  size: repo.size,
                  avatar: repo.owner.avatar_url,
                  owner: repo.owner.login
              };

              // getting readMe file now
              var readmeUrl = 'https://api.github.com/repos/'+searchText+'/'+repo.name+'/readme'+oauth;

              $http.get(readmeUrl).then(function(res)
              {
                repoObj.readme= $.base64Decode(res.data.content);
                $scope.repoData.push(repoObj);
              },function()
              {
                repoObj.readme = "No readme found";
                $scope.repoData.push(repoObj);
              });
            });

        });
    }
  }

  // load user bio on search
  $scope.loadUserBio = function(searchText)
  {
    if ( searchText ) {
        var url = 'https://api.github.com/users/'+searchText+''+oauth;
        // push username to recent user array
        $http.get(url).then(function(res)
        {
                var data = res.data;
                var user = {
                    username: data.login,
                    avatar: data.avatar_url,
                    name: data.name,
                    company: data.company,
                    blog: data.blog,
                    location: data.location,
                    email: data.email,
                    hireable: data.hireable,
                    bio: data.bio,
                    repos: data.public_repos,
                    followers: data.followers,
                    joined: data.created_at
                };
                $scope.userBio = user;
        });
    }
  }

  // Load oragnization members
  $scope.onOrgsMemebersSearch = function(searchText)
  {
    if(searchText)
    {
      var url = 'https://api.github.com/orgs/'+searchText+'/members'+oauth;
      $http.get(url).then(function(res)
      {
        $scope.orgUsers = res.data.map(function(val){
          return val.login;
        })

      });
    }
  }

});


// search Field component. onSearch is mapped to the function while using the component
function SearchTextFieldController($scope, $element, $attrs) {

   var ctrl = this;

   ctrl.modal = '';

   ctrl.go = function(){
     ctrl.onSearch({ searchText: ctrl.modal });
   }

}

App.component('searchTextField', {
  templateUrl: 'scripts/search-text-field.html',
  controller: SearchTextFieldController,
  bindings: {
    onSearch: '&',
    modal: '<'
  }
});


// user Bio components is just to display the user info. takes user object as prpoperty
function userBioController(){
  var ctrl = this;
}

App.component('userBio', {
  templateUrl: 'scripts/user-bio.html',
  controller: userBioController,
  bindings:  {
    user: '<'
  }
});


// user repo compnents is display user repos. takes respos as property
function userRepositoriesController(){
  var ctrl = this;
}

App.component('userRepositories', {
  templateUrl: 'scripts/user-repositories.html',
  controller: userRepositoriesController,
  bindings: {
    repos: '<'
  }
});
