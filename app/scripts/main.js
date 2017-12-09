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

        /**
         * Calls Github Organizations API to load organisation members data
         *
         * @param {string} orgname The name of the organisation to load the data for
         * @return {Object} The organisation member data returned from the Github API
         **/
        loadOrganisation: function(orgname) {
            return $http.get(githubAPI + "/orgs/" + orgname + "/members" + oauth)
                .then(function(response) {
                    return response.data;
                });
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
            .then(function(user) {
                $scope.user = user;
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

    $scope.findOrg = function() {
        githubFactory.loadOrganisation($scope.orgname)
            .then(function(orgMembers) {
                $scope.orgMembers = orgMembers;
            });
    };

    $scope.searchOrgMember = function(memberName) {
        $scope.username = memberName;
        $scope.findUser();
    };
});

/**
 * Filter
 *  formatDate - parse and return date in desired format
 **/
gitberApp.filter("formatDate", function($filter) {
    return function(input) {
        if (input === null)
            return "";

        return $filter("date")(new Date(input), "d MMMM yyyy");
    };
});

