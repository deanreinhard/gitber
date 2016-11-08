var app = angular.module('gitber', []);

var client='69af424226e15a6396dd';
var secret='683d05837403207f247939ab21668065352b65db';
var oauth = '?client_id=' + client+'&client_secret=' + secret;
var url;


app.controller('GitInfoController', function($scope, $http) {

    $scope.getGitInfo = function() {
        $scope.repos = null;
        $scope.reposFound = false;
        $scope.members = null;
        $scope.membersFound = false;
        $scope.memberNotFound = false;
        getrepos($scope.username);
    };

    $scope.getGitOrgInfo = function() {
        $scope.repos = null;
        $scope.reposFound = false;
        getrepos($scope.orgname);

        $scope.memberNotFound = false;

        url = 'https://api.github.com/orgs/' + $scope.orgname + '/members' + oauth;

        $http.get(url).success(function (data) {
            $scope.members = data;
            $scope.membersFound = data.length > 0;
        })
            .error(function () {
                $scope.memberNotFound = true;
            });
    };

    $scope.getGitMemInfo = function(username, event) {
        getrepos(username);
    };

    function getrepos(username){
        $scope.userNotFound = false;
        $scope.loaded = false;
        if(typeof username != 'undefined') {

            url = "https://api.github.com/users/" + username + oauth;
            $http.get(url).success(function (data) {
                if (data.name == "") data.name = data.login;
                $scope.user = data;
                $scope.loaded = true;
            })
                .error(function () {
                    $scope.userNotFound = true;
                });
            url = "https://api.github.com/users/" + username + '/repos' + oauth;
            $http.get(url).success(function (data) {

                $scope.repos = data;
                $scope.reposFound = data.length > 0;
            });
        }else{
            $scope.userNotFound = true;
        }
    }


});


app.controller('ExampleController', ['$scope', function($scope) {
    $scope.counter = 0;
    $scope.change = function() {
        $scope.counter++;
    };
}]);

