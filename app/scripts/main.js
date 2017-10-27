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
App.controller('gitberCtrl', function($scope) {
});
