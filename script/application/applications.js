RAD.application(function (core) {
    var app = this;


    app.viewStatus = {
        currentView: null,
        prevView: null
    };
    app.start = function () {
        core.startService();
        this.selectStartPage();
    };
    app.isFullUserProfile = function(){
        if(Parse.User.current()){
            if (Parse.User.current().get('setupStatus') != 'complete'){
                console.log('ok');
                var options = {
                    container_id: '.content',
                    content: 'view.settings_view',
                    animationTimeout: 500
                };
                core.publish('navigation.show', options);
            }
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
    app.showView = function(pageId, data) {
        var options = {
            container_id: '.content',
            content: pageId,
            animationTimeout: 2000,
            defaultAnimation: 'slide'
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
    app.selectStartPage = function(){
        if(Parse.User.current()){
            RAD.model('FriendsCollection').refresh();
            RAD.model('SentFriendsNotification').refresh();
            RAD.model('UsersCollection').refresh();
            RAD.model('IncFriendsRequest').refresh();

            this.showParentView();
        }else{
            this.showLoginView();
        }
    };
    app.dataIsUpdated = function(self){
/*        core.publish('service.notification.processingOfRequestsInFriend');
        core.publish('service.notification.processingOfConfirmedOrders');
        core.publish('service.notification.markPeopleWithNotification');*/
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
        console.log('set');
        core.publish("view.parent_view", {
            view: 'view.settings_view',
            method: 'show'
        });
    };
    return app;
}, true);

