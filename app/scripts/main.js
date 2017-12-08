"use strict";

// Define the gitberApp module
var gitberApp = angular.module("gitberApp", []);

// Factory
gitberApp.factory("githubFactory", function($http) {
    // API endpoint and keys for authentication
    var githubAPI = "https://api.github.com";
    var client = "69af424226e15a6396dd";
    var secret = "683d05837403207f247939ab21668065352b65db";
    var oauth  = "?client_id=" + client + "&client_secret=" + secret;

    var searchedUsers = [];
    var user = "";

    /**
     * Add user to array of searched usernames that have been searched for previously
     * 1) If user exists in array, remove first
     * 2) Then readd to the front of the array
     * 3) If array exceeds 5 elements, remove 1 from end of the array (oldest)
     *
     * @param {string} username The user to add to the array
     **/
    function addUser(username) {
        var idx = searchedUsers.indexOf(username);

        if (idx !== -1) {
            searchedUsers.splice(idx, 1);
        }

        searchedUsers.unshift(username);

        if (searchedUsers.length > 5) {
            searchedUsers.pop();
        }
    }

    //
    return {
        /**
         * Remove user from array of searched usernames when X is clicked
         *
         * @param {string} username The user to remove from the array
         **/
        removeUser: function(username) {
            searchedUsers.splice(searchedUsers.indexOf(username), 1);
        },

        /**
         * Calls Github User API to load user data and adds user to array of searched usernames
         * Returned data from API ...
         *
         * @param {string} username The user to load the data for
         * @return {Object} The user data returned from the Github API
         **/
        loadUser: function(username) {
            addUser(username);

            return $http.get(githubAPI + "/users/" + username + oauth)
                .then(function(response) {
                    return response.data;
                });
        },

        /**
         * Calls Github Repo API to load user repos data
         * Further calls the API to load the README file data (if available)
         * Returned data from API ...
         *
         * @param {string} username The user to load the data for
         * @return {Object} The user repo data returned from the Github API
         **/
        loadRepos: function(username) {
            return $http.get(githubAPI + "/users/" + username + "/repos" + oauth)
                .then(function(response) {
                    async.map(
                        response.data,
                        function(repo, callback) {
                            $http.get(githubAPI + "/repos/" + username + "/" + repo.name + "/readme" + oauth)
                                .then(
                                    function(response) {
                                        repo.readme = $.base64Decode(response.data.content);
                                    },
                                    function(response) {
                                        repo.readme = "No readme found";
                                    });
                        }
                    );

                    return response.data;
                });
        },

        recentUsers: function() {

        },

        /**
         * Array of previously searched usernames - limit to 5
         **/
        searchedUsers: searchedUsers
    }
});

// Controller
gitberApp.controller("gitberController", function($scope, githubFactory) {
    $scope.searchedUsers = githubFactory.searchedUsers;

    $scope.findUser = function() {
        githubFactory.loadUser($scope.username)
            .then(function(data) {
                $scope.data = data;
            });

        githubFactory.loadRepos($scope.username)
            .then(function(repos) {
                $scope.repos = repos;
            });
    };

    $scope.searchAgain = function(username) {
        $scope.username = username;
        $scope.findUser();
    };

    $scope.removeUser = githubFactory.removeUser;
});
