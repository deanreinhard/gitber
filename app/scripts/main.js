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
App = Em.Application.create();

/**************************
* Models
**************************/
App.repo = Em.Object.extend({
 
});

App.githubUser = Em.Object.extend({
 
});

App.orgMembers = Em.Object.extend({
 
});

/**************************
* Views
**************************/
App.SearchTextField = Em.TextField.extend({
    insertNewline: function(){
        App.reposController.loadrepos();
    }
});
App.OrganisationSearchTextField = Em.TextField.extend({
    insertNewline: function(){
        App.organisationUserController.loadOrganisation();
    }
});
/**************************
* Controllers
**************************/
App.reposController = Em.ArrayController.create({
    content: [],
    username: '',
    loadrepos: function(username,name) {
        var me = this;
        var username = me.get("username");
        if ( username ) {
            App.recentUsersController.addUser(username);
            me.set('content', []);
            $.getJSON(API.repos(username),function(data){
                me.set('content', []);
                async.map(
                    data,
                    function(repo, callback){
                        var success = false;
                        $.getJSON(API.readme(username, repo.name), function(readme){
                            success = true;
                            repo.readmeFile = $.base64Decode(readme.content);
                            callback(null, repo);
                        })
                            .fail(function(){
                                repo.readmeFile = "No readme found";
                                callback(null, repo);
                            });
                    },
                    function(error, reposWithReadme){
                        $(reposWithReadme).each(function(index,value){
                            var repoArray = App.repo.create({
                                name: value.name,
                                created: value.created_at,
                                repoUrl: value.clone_url,
                                language: value.language,
                                size: value.size,
                                avatar: value.owner.avatar_url,
                                owner: value.owner.login,
                                readme: value.readmeFile
                            });
                            me.pushObject(repoArray);
                        });
                    });
            });
            App.githubUserController.loadUser(username);
        }
    }
});

App.githubUserController = Em.ArrayController.create({
    content: [],
    loadUser: function(username,name) {
        var me = this;
        if ( username ) {
            // push username to recent user array
            me.set('content', []);
            $.getJSON(API.user(username),function(data){
                me.set('content', []);
                $(data).each(function(index,value){
                    var githubUserArray = App.githubUser.create({
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
                    });
                    me.pushObject(githubUserArray);
                })
            });
        }App.recentUsersController.addUser(username);
    }
});


App.organisationUserController = Em.ArrayController.create({
	organisation: '',
    content: [],
    loadOrganisation: function(organisation,name) {
        var me = this;
		var organisation = me.get("organisation");
        if ( organisation ) {
            me.set('content', []);
            $.getJSON(API.organisation(organisation),function(data){
                me.set('content', []);
                $(data).each(function(index,value){
                    var organisationUserArray = App.githubUser.create({
                        orgUsername: value.login
                    });
                    me.pushObject(organisationUserArray);
                })
            });
        }
    },
	searchOrgUser: function(view){
        App.reposController.set('username', view.context.orgUsername);
        App.reposController.loadrepos();
    }
});

function formatJoinDate(joined) {
    return Date.parse(joined).toString("d MMMM yyyy");
}

////////////////////////////////////////////////////////////////////////////////////////
App.recentUsersController = Em.ArrayController.create({
    content: [],
    addUser: function(name) {
        if ( this.contains(name) ) this.removeObject(name);
        this.pushObject(name);
        if (this.get('content').length > 5){
            this.get('content').splice(0,1);
        };
    },
    removeUser: function(view){
        this.removeObject(view.context);
    },
    searchAgain: function(view){
        App.reposController.set('username', view.context);
        App.reposController.loadrepos();
    },
    reverse: function(){
        return this.toArray().reverse();
    }.property('@each')
});

