/**************************
* Application
**************************/
App = Em.Application.create();

/**************************
* Models
**************************/
App.repo = Em.Object.extend({
 
});

App.repoReadme = Em.Object.extend({

});

App.githubUser = Em.Object.extend({
 
});

/**************************
* Views
**************************/
App.SearchTextField = Em.TextField.extend({
    insertNewline: function(){
        App.reposController.loadrepos();
    }
});
var client='69af424226e15a6396dd';
var secret='683d05837403207f247939ab21668065352b65db';
var oauth = '?client_id='+client+'&client_secret='+secret;
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
            var url = 'https://api.github.com/users/'+username+'/repos'+oauth;
            // push username to recent user array
            App.recentUsersController.addUser(username);
            me.set('content', []);
            $.getJSON(url,function(data){
                me.set('content', []);
                async.map(
                  data,
                  function(repo, callback){
                    var url = 'https://api.github.com/repos/'+username+'/'+repo.name+'/readme'+oauth;
                    $.getJSON(url, function(readme){
                      repo.readmeFile = $.base64Decode(readme.content);
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
            var url = 'https://api.github.com/users/'+username+''+oauth;
            // push username to recent user array
            me.set('content', []);
            $.getJSON(url,function(data){
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
        }
    }
});


 function formatJoinDate(joined) {
        var joined = Date.parse(joined);
        return joined.toString("d MMMM yyyy");
    };


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

