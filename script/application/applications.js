RAD.application(function (core) {
    var app = this;



    app.start = function () {
        core.startService();
        this.selectStartPage();
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
    app.selectStartPage = function(){
        if(Parse.User.current()){
            this.getData();
            this.showParentView();
        }else{
            this.showLoginView();
        }
    };
    app.getData = function(){
        var promArr = [],
            self = this;

        for (var key in this.data) {
            if(this.data.hasOwnProperty(key) && key != 'FriendsCollection' && key != 'SuggestionPosts' && key != 'NewFriendsCollection'){
                promArr.push(this.data[key].refresh());
            }

        }


        this.data.FriendsCollection.refresh().then(function(data){
            self.data.FriendsCollection.reset(data);
            Parse.Promise.when(promArr).then(function(r1, r2, r3, r4, r5) {
                core.publish('service.post_notification.getSuggestionPosts', self.data);
                core.publish('service.notification.markPeopleWithNotification', self.data);
                core.publish('service.notification.getIncomingFriendNotification', self.data);
/*
                console.log('UsersCollection',          r1);  // prints 1
                console.log('SentFriendsNotification',  r2);  // prints 2
                console.log('IncFriendsRequest',        r3);  // prints 3
                console.log('FriendsCollection',        RAD.model('FriendsCollection'));  // prints 3
                console.log('PostNotification',         r4);  // prints 3
                console.log('FriendNotification',       r5);  // prints 3
                console.log('END users data -----');*/
            });
        });
    };
    app.isFullUserProfile = function(){
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
            options.content = 'view.settings_view';
            core.publish('navigation.show', options);
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
    app.showView = function(pageId, data, animation) {
        var options = {
            container_id: '.content',
            content: pageId,
            animationTimeout: 2000,
            defaultAnimation: animation || 'slide'
        };

        if (pageId != 'view.logout_view') {
            if(data){
                options.extras = {model: data}
            }
            core.publish('navigation.show', options);
        } else {
            Parse.User.logOut();
            options.container_id = '#screen';
            options.content = "view.login_view";
            core.publish('navigation.show', options)
        }
    };
    app.showLoad = function(){
        var $loadElem = $('<div/>', {class: 'load'}),
            loadInPage = $('.load')[0];

        if (! loadInPage){
            $('#screen').append($loadElem);
        }else{
            $(loadInPage).toggle();
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

