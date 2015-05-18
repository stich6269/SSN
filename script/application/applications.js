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
    app.selectStartPage = function(){
        if(Parse.User.current()){
            this.getData();
            this.showParentView();
        }else{
            this.showLoginView();
        }
    };
    app.getData = function(){
        RAD.model('FriendsCollection').refresh();
        RAD.model('UsersCollection').refresh();
        RAD.model('IncFriendsRequest').refresh();
        RAD.model('SentFriendsNotification').refresh();
    };
    app.isFullUserProfile = function(){
        if(Parse.User.current()){
            if (Parse.User.current().get('setupStatus') != 'complete'){
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

