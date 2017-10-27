/**************************
 * Constants
 **************************/

var CLIENT_KEY = '69af424226e15a6396dd';
var SECRET_KEY = '683d05837403207f247939ab21668065352b65db';
var OAUTH_QUERY_STRING = '?client_id=' + CLIENT_KEY + '&client_secret=' + SECRET_KEY;
var API_URL = 'https://api.github.com';

/**************************
 * API
 **************************/

var API = {
    user: function(username) {
        return [API_URL, 'users', username].join('/') + OAUTH_QUERY_STRING;
    },
    repos: function(username) {
        return [API_URL, 'users', username, 'repos'].join('/') + OAUTH_QUERY_STRING;
    },
    readme: function(username, repo) {
        return [API_URL, 'repos', username, repo, 'readme'].join('/') + OAUTH_QUERY_STRING;
    },
    organisation: function(organisation) {
        return [API_URL, 'orgs', organisation, 'members'].join('/') + OAUTH_QUERY_STRING;
    }
};

var githubService = {
    repos: function(username) {

    },
    repoReadme: function(username, repo) {

    },
    orgMembers: function(organisation) {

    }
};

/**************************
* Application
**************************/
var App = angular.module('gitberApp', []);

/**************************
* Models
**************************/
App.factory('githubUser', function($http, recentSearches, githubRepos) {
    var User = {};

    function searchUser(username) {
        // Stop search if username is blank
        if(username.length === 0) return;

        $http.get(API.user(username)).then(function(value){
            var user = {
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
            User = user;
            recentSearches.addUser(username);
            githubRepos.getRepos(username);
        });
    }

    return {
        User: User,
        searchUser: searchUser
    };
});

App.factory('githubRepos', function($http) {
    // data property is used to preserve reference when emptying the list
    // otherwise it may cause Angular to not watch the array correctly
    // i.e. Repos.data = []
    var Repos = {data: []};

    function getRepos(username) {
        $http.get(API.repos(username)).then(function(response) {
            Repos.data  = [];
            for(var i = 0; i < response.data.length; i++) {
                var value = response.data[i];
                Repos.data.push({
                    name: value.name,
                    created: value.created_at,
                    repoUrl: value.clone_url,
                    language: value.language,
                    size: value.size,
                    avatar: value.owner.avatar_url,
                    owner: value.owner.login,
                    readme: 'No readme found'
                });
            }
        });
    }

    return {
        Repos: Repos,
        getRepos: getRepos
    };
});

App.factory('recentSearches', function() {
    // data property is used to preserve reference when emptying the list
    // otherwise it may cause Angular to not watch the array correctly
    // i.e. Searches.data = []
    var Searches = {data: []};

    function addUser(username) {
        if(Searches.data.indexOf(username) !== -1) {
            removeUser(username);
        }
        Searches.data.push(username);
    }

    function removeUser(username) {
        var index = Searches.data.indexOf(username);
        if (index !== -1) {
            Searches.data.splice(index, 1);
        }
    }

    return {
        Searches: Searches,
        addUser: addUser,
        removeUser: removeUser
    };
});


/**************************
* Views
**************************/

/**************************
* Controllers
**************************/
App.controller('userSearchCtrl', function($rootScope, $scope, githubUser, recentSearches) {
    $scope.username = '';
    $scope.history = recentSearches.Searches;

    $scope.loadUser = function(e) {
        githubUser.searchUser($scope.username);

        // Prevent Form Submission
        e.preventDefault();
    };

    $scope.searchAgain = function(username) {
        $scope.username = username;
        githubUser.searchUser(username);
    };

    $scope.removeUser = recentSearches.removeUser;
});

App.controller('orgSearchCtrl', function($rootScope, $scope) {

});

App.controller('reposCtrl', function($scope, githubRepos) {
    $scope.repos = githubRepos.Repos;
});

/**************************
 * Filters
 **************************/
App.filter('reverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
});
