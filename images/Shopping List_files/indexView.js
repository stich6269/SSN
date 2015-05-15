var IndexView = BaseView.extend({
    className: 'wrapper',
    collection: new ItemCollection(),
    loadElem: $('<div/>', {class: 'load'}),
    views:{
        errView: null,
        loginView: null,
        regView: null,
        menu: null,
        statusBar: null,
        settings: null,
        items: null,
        editItem: null,
        addItems: null,
        usersView: null,
        friendsView: null,
        newFriendsView: null,
        suggestionView: null
    },
    data:{
        errMessage: null,
        itemsCollection: null,
        activeModel: null,
        usersCollection: null,
        friendsCollection: null,
        newFriendsCollection: null,
        sentFriendsNotif: null,
        incomingFriendsNotif: null,
        sentPostNotification: null,
        incomingPostNotification: null,
        suggestionPostCollection: null
    },
    onInitialize:function(){
        this.views.statusBar = new StatusBar();
        if(Parse.User.current()){
            this.getData();
        }else{
            this.selectStartPage();
        }
        this.onEvents();
    },
    getData:function(){
        this.views.menu = new MenuView({model: Parse.User.current()});
        this.$el.append(this.loadElem)
            .append(this.views.statusBar.$el);
        ParseServices.getAllData(this.data, this.dataIsUpdated, this);
    },
    dataIsUpdated: function(self){
        self.loadElem.remove();
        self.selectStartPage();
    },
    onEvents:function(){
        var self = this;

        this.vent.on('showMessageBox', function(message){
                self.showErrMessage(message);
            });
        this.vent.on('hideMessageBox', function(){
                self.views.errView.remove();
            });
        this.vent.on('toggleMenu', function(){
            self.views.menu.delegateEvents();
            self.views.menu.$el.toggle();
        });

        this.vent.on('showRegView', function() {
            self.showRegView();
        });
        this.vent.on('showLoginView', function(){
            self.showLoginView();
        });
        this.vent.on('userIsLogged', function(){
            self.views.loginView.remove();
            if(!self.isFullUserProfile()){
                self.getData();
                self.showSettingsView();
            }else{
                self.getData();
            }
        });
        this.vent.on('userFilledProfile', function(){
            self.getData();
        });
        this.vent.on('logOut', function(){
            Parse.User.logOut();
            self.showLoginView();
        });

        this.vent.on('addItem', function(newItemData){
            ItemService.addItem(newItemData, self.data.itemsCollection);
        });
        this.vent.on('removeItem', function(modelId){
            ItemService.removeItem(modelId, self.data.itemsCollection);
        });
        this.vent.on('changeItemStatus', function(modelId){
            ItemService.changeItemStatus(modelId, self.data.itemsCollection);
        });
        this.vent.on('showEditItemView', function(modelId){
            self.showEditItemView(modelId);
        });
        this.vent.on('hideEditView', function(newItemData){
            if(newItemData){
                ItemService.editItemModel(self.data.activeModel, newItemData);
            }
            self.views.editItem.remove();
            self.showItemView();
        });

        this.vent.on('showAddItemsView', function(){
            self.showAddItemsView();
        });
        this.vent.on('showItems', function(){
            self.showItemView();
        });
        this.vent.on('showUsersView', function(){
            self.showUsersView();
        });
        this.vent.on('showFriendsView', function(){
            self.showFriendsView();
        });
        this.vent.on('showSettingsView', function(){
            self.showSettingsView();
        });

        this.vent.on('sendFriendsNotification', function(notification){
            NotificationService.sendFriendRequest(notification, self.data);
        });
        this.vent.on('rejectToFriends', function(userId){
            NotificationService.rejectToFriends(userId, self.data)
        });
        this.vent.on('rejectWithFriends', function(userId){
            NotificationService.rejectWithFriends(userId, self.data)
        });
        this.vent.on('acceptToFriends', function(userId){
            NotificationService.acceptToFriends(userId, self.data)
        });
        this.vent.on('showSuggestionView', function(){
            self.showSuggestionView();
        });

        this.vent.on('shareItem', function(postId){
            PostNotificationServices.sharePost(postId, self.data);
        });
    },
    isFullUserProfile:function(){
        if(Parse.User.current()){
            return Parse.User.current().get('setupStatus') == 'complete'
        }else{
            return false;
        }
    },
    markPeopleWithNotification: function(){
        var recipientsNotification = this.data.sentFriendsNotif.pluck('recipient'),
            sentNotificationToUser;

        for (var i = 0; i < recipientsNotification.length; i++) {
            sentNotificationToUser = this.data.usersCollection.get(recipientsNotification[i]);
            sentNotificationToUser.set('sendFriendInv', true);
        }
    },


    /*DISPLAY VIEW BEGIN*/
    selectStartPage: function(){
        if (this.isFullUserProfile()){
            this.showItemView();
        }else if(Parse.User.current()){
            this.showSettingsView();
        }else{
            this.showLoginView();
        }
    },
    drawPreparing: function(view, model){
        var viewConstructors = {
            items: function(){
                return new ListView({model: model})
            },
            usersView: function(){
                return new PeopleView({model: model});
            },
            addItems: function(){
                return new AddForm();
            },
            friendsView: function(){
                return new FriendsView({model: model});
            },
            newFriendsView: function(){
                return new NewFriendsView({model: model});
            },
            settings: function(){
                return new SettingsView({model: model})
            },
            suggestionView: function(){
                return new SuggestView({model: model})
            }
        };

        this.$el.empty();
        if(true){
            this.views[view] = viewConstructors[view]();
            this.$el.append(this.views.menu.$el);
        }else{
            this.views[view].delegateEvents();
        }

        this.views.statusBar.delegateEvents();
        this.$el.append(this.views.statusBar.$el)
            .append(this.views.menu.$el)
            .append(this.views[view].$el);
    },
    showSuggestionView:function(){
        this.drawPreparing('suggestionView', this.data.suggestionPostCollection);
        console.log();
    },
    showFriendsView: function(){
        this.drawPreparing('newFriendsView', this.data.newFriendsCollection);
        this.views.friendsView = new FriendsView({model: this.data.friendsCollection});
        this.$el.append(this.views.friendsView.$el);
    },
    showUsersView: function(){
        this.drawPreparing('usersView', this.data.usersCollection);
        NotificationService.markPeopleWithNotification(this.data);
    },
    showAddItemsView: function(){
        this.drawPreparing('addItems', null);
    },
    showLoginView: function(){
        if(!this.views.loginView){
            this.views.loginView = new LoginView();
        }else{
            this.views.loginView.delegateEvents();
        }
        this.$el.html(this.views.loginView.el);
    },
    showSettingsView: function(){
        this.drawPreparing('settings', Parse.User.current())
    },
    showRegView: function(){
        if(!this.views.regView){
            this.views.regView = new RegView();
        }else{
            this.views.regView.delegateEvents();
        }
        this.$el.html(this.views.regView.el);
    },
    showItemView: function(){
        this.drawPreparing('items', this.data.itemsCollection);
    },
    showEditItemView: function(modelId){
        this.$el.empty();
        this.data.activeModel = this.data.itemsCollection.get(modelId);
        this.views.editItem = new EditView({model: this.data.activeModel});
        this.$el.append(this.views.statusBar.$el)
            .append(this.views.menu.$el)
            .append(this.views.editItem.$el);
    },
    showErrMessage: function(message){
        var isElemCreated = this.$el.find('.error_box').html();
        this.data.errMessage = message;

        if(!isElemCreated){
            var errModel = new MessageModel({message: this.data.errMessage});
            this.views.errView = new ErrView({model: errModel});
            this.$el.append(this.views.errView.$el);
            this.data.errMessage = null;
        }
    }
    /*DISPLAY VIEW END*/
});