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
    user: function(username, callback) {
        $.getJSON(API.user(username), function(value){
            var githubUser = {
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
            callback(githubUser);
        });
    },
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

/**************************
* Views
**************************/

/**************************
* Controllers
**************************/
App.controller('userSearchCtrl', function($rootScope, $scope) {
    $scope.username = '';
    $scope.user = {};

    $scope.loadUser = function(e) {
        if($scope.username.length > 0) {
            // Broadcast 'search' event
            $rootScope.$broadcast('search', $scope.username);

            githubService.user($scope.username, function(githubUser) {
                if(githubUser) {
                    $scope.user = githubUser;
                    $scope.$apply();
                }
            });
        }

        // Prevent form submission
        if(e){
            e.preventDefault();
        }
    };
});

App.controller('orgSearchCtrl', function($rootScope, $scope) {

});

App.controller('recentSearchesCtrl', function($rootScope, $scope) {
    $scope.usernames = [];

    $rootScope.$on('search', function(e, username) {
        $scope.usernames.push(username);
    });

    $scope.addUser = function(username){
        if($scope.usernames.indexOf(username) !== -1) {
            $scope.removeUser(username);
        }
        $scope.usernames.push(username);
    };

    $scope.removeUser = function(username) {
        var index = $scope.usernames.indexOf(username);
        if (index !== -1) {
            $scope.usernames.splice(index, 1);
        }
    };

    $scope.searchAgain = function(username) {
        // NOOP
        console.error('not implemented yet');
    };
});

/**************************
 * Filters
 **************************/
App.filter('reverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
});
