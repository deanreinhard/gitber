var app = angular.module('app', []);

var client = '69af424226e15a6396dd';
var secret = '683d05837403207f247939ab21668065352b65db';
var oauth = '?client_id=' + client + '&client_secret=' + secret;

//user a service to store the recent users
app.service('recentUsers', function () {
    var recentUsers = [];

    this.addUser = function (username) {
        if (recentUsers.includes(username)) this.removeUser(username);

        recentUsers.push(username);
        if (recentUsers.length > 5) recentUsers.splice(0, 1);

    }

    this.removeUser = function (username) {
        recentUsers.splice(recentUsers.indexOf(username), 1);

    },

    //searchAgain is not necessarily to be in the service as we can call loadrepos in controller
    // searchAgain: function(view){
    //     App.reposController.set('username', view.context);
    //     App.reposController.loadrepos();
    // },

    this.reverse = function () {
        //clone another array and return the reversed of this array, so the recentUsers array is intact
        var a = Array.from(recentUsers);
        return a.reverse();
    }
});

app.controller('myController', function ($scope, recentUsers, $http) {
    //remove user and update the corresponding $scope variable
    $scope.removeUser = function(username){
        recentUsers.removeUser(username);
        $scope.recentUsers = recentUsers.reverse();
    }

    //load user data
    $scope.loadUser = function (username) {
        if (username) {
            var url = 'https://api.github.com/users/' + username + '' + oauth;
            // push username to recent user array
            $http.get(url).then(function (res) {
                var value = res.data;
                $scope.githubUser = {
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
            });
        }
        recentUsers.addUser(username);

        $scope.recentUsers = recentUsers.reverse();
    }

    //load repository data
    $scope.loadrepos = function (username) {
        $scope.repos = new Array();

        if (username) {
            var url = 'https://api.github.com/users/' + username + '/repos' + oauth;

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
                        reposWithReadme.forEach(function(value){
                            var repoArray = {
                                name: value.name,
                                created: value.created_at,
                                repoUrl: value.clone_url,
                                language: value.language,
                                size: value.size,
                                avatar: value.owner.avatar_url,
                                owner: value.owner.login,
                                readme: value.readmeFile
                            };
                            $scope.repos.push(repoArray);

                        });
                        //call $apply to ask angular to re-update the $scope models
                        $scope.$apply();
                    });
            });

            $scope.loadUser(username);
        }
    }

    //load org data
    $scope.loadOrganisation = function(org){
        if ( org ) {
            $scope.orgUsernames = [];
            var url = 'https://api.github.com/orgs/'+org+'/members'+oauth;
            $http.get(url).then(function(res){
                var data = res.data;
                data.forEach(function(value){
                    $scope.orgUsernames.push(value.login);

                })
            });
        }
    }

    //searchOrgUser is not necessarily to be in the service as we can call loadOrganisation instead
    // searchOrgUser: function(view){
    //     App.reposController.set('username', view.context.orgUsername);
    //     App.reposController.loadrepos();
    // }

    function formatJoinDate(joined) {
        var joined = Date.parse(joined);
        return joined.toString("d MMMM yyyy");
    };
});
