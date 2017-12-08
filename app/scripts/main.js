"use strict";

// API endpoint and keys for authentication
var githubAPI = "https://api.github.com";
var client = "69af424226e15a6396dd";
var secret = "683d05837403207f247939ab21668065352b65db";
var oauth  = "?client_id=" + client + "&client_secret=" + secret;

// Init main Angular app
var gitberApp = angular.module("gitberApp", []);

gitberApp.factory("githubFactory", function($http) {
    var searchedUsers = [];
    var user = "";

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

    return {
        removeUser: function(username) {
            searchedUsers.splice(searchedUsers.indexOf(username), 1);
        },

        loadUser: function(username) {
            addUser(username);

            return $http.get(githubAPI + "/users/" + username + oauth)
                .then(function(response) {
                    return response.data;
                });
        },

        recentUsers: function() {

        },

        searchedUsers: searchedUsers
    }
});

gitberApp.controller("gitberController", function($scope, githubFactory) {
    $scope.searchedUsers = githubFactory.searchedUsers;

    $scope.findUser = function() {
        githubFactory.loadUser($scope.username)
            .then(function(data) {
                $scope.data = data;
            });

    };

    $scope.searchAgain = function(username) {
        $scope.username = username;
        $scope.findUser();
    };

    $scope.removeUser = githubFactory.removeUser;
});
