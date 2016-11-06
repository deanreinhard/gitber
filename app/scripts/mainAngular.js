(function () {
    'use strict';
    var app = angular.module('gitber', ['ngResource', 'common']);

    ////======================================= APP CONSTANTS ========================================================
    var appConstant = angular.module('common', [])
           .constant('appSettings',
           {
               reposServer: 'https://api.github.com/repos/',
               userServer: 'https://api.github.com/users/',
               organizationServer: 'https://api.github.com/orgs/',
               client: '69af424226e15a6396dd',
               secret: '683d05837403207f247939ab21668065352b65db',
               oauth: '?client_id=' + client + '&client_secret=' + secret
           });

    ////======================================= CONTROLLER ========================================================
    app.controller('gitberController', ['appSettings', 'gitberFactory', function (appSettings, gitberFactory) {
        var vm = this;
        vm.users = [];
        vm.currentUser = {};
        vm.username = '';
        vm.organization = '';
        vm.organizations = [];
        vm.repos = [];

        //get repository
        vm.getRepo = function (username) {
            vm.username = username;
            gitberFactory.loadUser(username)
                        .then(getUserSuccess)
                        .catch(errorCallBack);
        };

        //get organization members
        vm.getOrganization = function (organization) {
            gitberFactory.loadOrganization(organization)
                        .then(getOrganizationSuccess)
                        .catch(errorCallBack);
        }

        vm.onEnter = function (keyEvent, searchType, text) {
            if (keyEvent.which === 13 && searchType == 'user')
                vm.getRepo(text);
            else if (keyEvent.which === 13 && searchType == 'organization')
                vm.getOrganization(text);
        }

        vm.isEmptyObject = function (obj) {
            return Object.keys(obj).length == 0;
        }

        vm.isEmpty = function (obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    return false;
                }
            }
            return true;
        };

        vm.viewAgain = function (username) {
            for (var i = 0 ; i < vm.users.length; i++) {
                if (vm.users[i].username == username) {
                    vm.currentUser = vm.users[i];
                    gitberFactory.loadRepos(vm.currentUser.username)
                        .then(getRepoSuccess)
                        .catch(errorCallBack);
                }
                else {
                    gitberFactory.loadRepos(username)
                        .then(getRepoSuccess)
                        .catch(errorCallBack);
                }
            }
        }

        //remove a user
        vm.removeUser = function (username) {
            for (var i = 0 ; i < vm.users.length; i++) {
                if (vm.users[i].username == username)
                    vm.users.splice(i);
            }
        }

        //on sucessfully get a user
        function getUserSuccess(response) {
            vm.currentUser = {
                username: response.login,
                avatar: response.avatar_url,
                name: response.name,
                company: response.company,
                blog: response.blog,
                location: response.location,
                email: response.email,
                hireable: response.hireable,
                bio: response.bio,
                repos: response.public_repos,
                followers: response.followers,
                joined: response.created_at
            };
            vm.users.push(vm.currentUser);
            //get the repository once done load a user    
            gitberFactory.loadRepos(vm.currentUser.username)
                        .then(getRepoSuccess)
                        .catch(errorCallBack);
        }

        //get repository success
        function getRepoSuccess(response) {
            vm.repos = [];
            angular.forEach(response, function (item) {
                gitberFactory.loadRepoReadme(item.owner.login, item.name)
                        .then(function (result) {
                            vm.repos.push({
                                login: item.owner.login,
                                name: item.name,
                                language: item.language,
                                size: item.size,
                                description: item.description,
                                readme: atob(result.content),
                                created: item.created_at,
                                repoUrl: item.clone_url
                            });
                        })
                        .catch(errorCallBack);
            });
        }

        //get organization successfully
        function getOrganizationSuccess(response) {
            angular.forEach(response, function (item) {
                vm.organizations.push({
                    orgUsername: item.login
                });
            })
        }

        //get error
        function errorCallBack(errorMsg) {
            console.log('ERROR CALLING WEB SERVICE: ' + JSON.stringify(errorMsg));
        }
    }]);

    ////======================================= WEB SERVICES CALL ========================================================
    app.factory('gitberFactory', ['appSettings', '$q', '$timeout', '$http',
            function (appSettings, $q, $timeout, $http) {
                return {
                    loadRepos: loadRepos,
                    loadRepoReadme: loadRepoReadme,
                    loadUser: loadUser,
                    loadOrganization: loadOrganization
                };

                function loadUser(username, name) {
                    return $http({
                        method: 'GET',
                        url: appSettings.userServer + username + '' + oauth,
                        cache: true,
                    })
                    .then(sendResponseData)
                    .catch(sendResponseError);
                }

                function loadOrganization(organization) {
                    return $http({
                        method: 'GET',
                        url: appSettings.organizationServer + organization + '/members' + oauth,
                        cache: true,
                    })
                    .then(sendResponseData)
                    .catch(sendResponseError);
                }

                function loadRepoReadme(username, repo) {
                    return $http({
                        method: 'GET',
                        url: appSettings.reposServer + username + '/' + repo + '/readme' + oauth,
                        cache: true
                    })
                    .then(sendResponseData)
                    .catch(sendResponseError);
                }

                function loadRepos(username) {
                    return $http({
                        method: 'GET',
                        url: appSettings.userServer + username + '/repos' + oauth,
                        cache: true,
                    })
                    .then(sendResponseData)
                    .catch(sendResponseError);
                }

                function sendResponseData(response) {
                    return response.data;
                }

                function sendResponseError(response) {
                    return $q.reject(response);
                }
            }]);

}());