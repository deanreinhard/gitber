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

/**************************
 * Application
 **************************/
var App = angular.module('gitberApp', []);

/**************************
 * API Service
 **************************/

App.factory('githubApi', function($http) {
    function user(username) {
        return $http.get(API.user(username)).then(function(response) {
            var value = response.data;
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
            return user;
        });
    }

    function repos(username) {
        return $http.get(API.repos(username)).then(function(response) {
            return new Promise(function(resolve) {
                async.map(
                    response.data,
                    function (value, callback) {
                        var repo = {
                            name: value.name,
                            created: value.created_at,
                            repoUrl: value.clone_url,
                            language: value.language,
                            size: value.size,
                            avatar: value.owner.avatar_url,
                            owner: value.owner.login,
                            readme: 'No readme found'
                        };
                        $http.get(API.readme(username, repo.name)).then(
                            function(response){
                                repo.readme = $.base64Decode(response.data.content);
                                callback(null, repo)
                            },
                            function() {
                                repo.readme = 'No readme found';
                                callback(null, repo);
                            }
                        );
                    },
                    function (error, repos) {
                        resolve(repos);
                    });
            });
        });
    }

    function organisation(organisation) {
        return $http.get(API.organisation(organisation)).then(function(response) {
            var members  = [];
            for(var i = 0; i < response.data.length; i++) {
                var value = response.data[i];
                members.push({
                    username: value.login
                });
            }
            return members;
        });
    }

    return {
        user: user,
        repos: repos,
        organisation: organisation
    };
});

/**************************
 * Models
 **************************/
App.factory('githubUser', function(githubApi, recentSearches, githubRepos, githubUserForm) {
    var User = {};

    function searchUser(username) {
        // Stop search if username is blank
        if(username.length === 0) return;

        // Set githubUserForm username field if toggled by a link
        githubUserForm.setUsername(username);

        githubApi.user(username).then(function(user) {
            angular.extend(User, user);
            recentSearches.addUser(username);
            githubRepos.getRepos(username);
        });
    }

    return {
        User: User,
        searchUser: searchUser
    };
});

App.factory('githubRepos', function(githubApi) {
    var Repos = [];

    function getRepos(username) {
        githubApi.repos(username).then(function (repos) {
            angular.copy(repos, Repos);
        });
    }

    return {
        Repos: Repos,
        getRepos: getRepos
    };
});

App.factory('githubOrganisation', function(githubApi) {
    var Members = [];

    function getOrganisation(organisation) {
        githubApi.organisation(organisation).then(function(members) {
            angular.copy(members, Members);
        });
    }

    return {
        Members: Members,
        getOrganisation: getOrganisation
    };
});

App.factory('recentSearches', function() {
    var Searches = [];

    function addUser(username) {
        if(Searches.indexOf(username) !== -1) {
            removeUser(username);
        }
        Searches.push(username);
    }

    function removeUser(username) {
        var index = Searches.indexOf(username);
        if (index !== -1) {
            Searches.splice(index, 1);
        }
    }

    return {
        Searches: Searches,
        addUser: addUser,
        removeUser: removeUser
    };
});

App.factory('githubUserForm', function() {
    // Need to create service as an object to keep reference to Username
    // property. Otherwise angular will not be able to store changes
    var svc = {};
    svc.Username = '';

    svc.setUsername = function(username) {
        svc.Username = username;
    };

    return svc;
});

/**************************
 * Controllers
 **************************/
App.controller('userSearchCtrl', function($scope, githubUserForm, githubUser) {
    $scope.username = githubUserForm.Username;

    $scope.searchUser = function (e) {
        githubUser.searchUser($scope.username);

        // Prevent Form Submission
        e.preventDefault();
    };

    // Watch githubUserForm.Username for changes so that we can
    // update $scope.username when search is toggled externally
    $scope.$watch(
        function () {
            return githubUserForm.Username;
        },
        function (newVal) {
            if ($scope.username !== newVal) {
                $scope.username = newVal;
            }
        },
        true);
});

App.controller('recentSearchesCtrl', function($scope, githubUser, recentSearches) {
    $scope.searches = recentSearches.Searches;
    $scope.searchAgain = githubUser.searchUser;
    $scope.removeUser = recentSearches.removeUser;
});

App.controller('orgSearchCtrl', function($scope, githubOrganisation, githubUserForm, githubUser) {
    $scope.organisation = '';
    $scope.members = githubOrganisation.Members;

    $scope.searchOrganisation = function(e) {
        githubOrganisation.getOrganisation($scope.organisation);

        // Prevent Form Submission
        e.preventDefault();
    };

    $scope.searchUser = githubUser.searchUser;
});

App.controller('reposCtrl', function($scope, githubRepos) {
    $scope.repos = githubRepos.Repos;
});

App.controller('userBioCtrl', function($scope, githubUser) {
    $scope.user = githubUser.User;
});

/**************************
 * Filters
 **************************/
App.filter('reverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
});
