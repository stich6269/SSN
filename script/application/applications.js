RAD.application(function (core) {
    var app = this;



    app.start = function () {
        core.startService();
        this.checkUser();
    };
    app.data = {
        ItemsCollection:            new  RAD.models.ItemsCollection(),
        UsersCollection:            new  RAD.models.UsersCollection(),
        FriendsCollection:          new  RAD.models.FriendsCollection(),
        PostNotification:           new  RAD.models.PostNotification(),
        FriendNotification:         new  RAD.models.FriendNotification(),
        SuggestionPosts:            new  RAD.models.SuggestionPosts(),
        NewFriendsCollection:       new  RAD.models.NewFriendsCollection()
    };
    app.checkUser = function(){
        if(Parse.User.current()){
            core.publish('service.network.getUsersData', this.data);
            this.showParentView();
        }else{
            this.showLoginView();
        }
    };
    app.checkUserProfile = function(){
        var options = {
            container_id: '.content',
            content: 'view.settings_view',
            animationTimeout: 500
        };

        if(Parse.User.current()){
            if (Parse.User.current().get('setupStatus') != 'complete'){
                core.publish('navigation.show', options);
            }
        }else{
            options.content = 'view.items_view';
            core.publish('navigation.show', options);
        }
    };
    app.showView = function(pageId, data, animation) {
        var options = {
            container_id: '.content',
            content: pageId,
            animationTimeout: 2000,
            defaultAnimation: animation || 'slide'
        };


        if (pageId != 'view.logout_view') {
            if (Parse.User.current().get('setupStatus') != 'complete'){
                options.content = 'view.settings_view';
            }
            if(data){
                options.extras = {model: data}
            }
            core.publish('navigation.show', options);
        } else {
            this.logOut();
        }
    };
    app.userFilledProfile = function(){
        core.publish('navigation.show', {
            container_id: '.content',
            content: "view.items_view",
            animationTimeout: 2000,
            defaultAnimation: 'slide'
        });
    };
    app.logOut = function(){
        var options = {
            container_id: '#screen',
            content: "view.login_view",
            animationTimeout: 2000,
            defaultAnimation: 'slide-out'
        };

        Parse.User.logOut();
        core.publish('navigation.show', {
            container_id: '.content',
            view: 'view.items_view',
            defaultAnimation: 'slide'
        });
        core.publish('navigation.show', options)
    };
    app.loadSpin = {
        start: function(){
            var loadElement = $('.upd_icon')[0];
            $(loadElement).addClass('rotate_load');
        },
        stop: function(){
            var loadElement = $('.upd_icon')[0];
            $(loadElement).removeClass('rotate_load');
        }
    };
    app.showLoginView = function(){
        core.publish('navigation.show', {
            container_id: '#screen',
            content: "view.login_view",
            animationTimeout: 500,
            defaultAnimation: 'slide'
        });
    };
    app.showParentView = function(){
        core.publish('navigation.show', {
            container_id: '#screen',
            content: "view.parent_view",
            defaultAnimation: 'slide'
        });
    };
    app.showSettingsView = function(){
        core.publish("view.parent_view", {
            view: 'view.settings_view',
            method: 'show'
        });
    };
    return app;
}, true);

