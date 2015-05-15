var ContentView = BaseView.extend({
    className: 'content',
    views:{
        listsViews: null,
        editView: null,
        peopleView: null,
        friendsView: null
    },
    data:{
        itemsCollection: null,
        usersCollection: null,
        activeModel: null,
        newPostCollection: null
    },
    notification:{
        inbox: null,
        send: null
    },
    onInitialize:function(){
        var self = this,
            itemsQuery = new Parse.Query(ItemModel);

        this.data.newPostCollection = new ItemCollection();

        this.notification.inbox = new NotificationCollection();
        this.notification.send = new NotificationCollection();
        this.views.addForm = new AddForm();
        this.onEvents();
    },



    onEvents:function(){
        var self = this;


        this.vent.on('showItems', function(){
            self.renderItemsList();
        });
        this.vent.on('showAddItemsForm', function(){
            self.showAddItemsForm();
        });
        this.vent.on('showSettingsView', function(){
            self.showSettingsView();
        });
        this.vent.on('showPeopleView', function(){
            self.showPeopleView();
        });


        this.vent.on('sendFriendRequest', function(requestObj){
            self.sendFriendRequest(requestObj);
        });
        this.vent.on('showFriendsView', function(){
            self.showFriendsView();
        });
        this.vent.on('acceptToFriends', function(userId){
            self.acceptToFriends(userId);
        });
        this.vent.on('rejectToFriends',function(userId){
            self.rejectToFriends(userId);
        });
        this.vent.on('shareItem',function(requestObj){
            self.shareItem(requestObj);
        });
        this.vent.on('showSuggestionView',function(){
            self.showSuggestionView();
        })

    },




    /*SHARE ITEM BEGIN*/
    shareItem: function(requestObj){
        var self = this,
            myNotif = this.notification.send.toJSON(),
            newNotification,
            notifNumber = null,
            friendsStatusArr = this.data.usersCollection.pluck('isMyFriend'),
            errArr = [];

        requestObj.sender = Parse.User.current().id;
        for (var j = 0; j < friendsStatusArr.length; j++) {
            if(friendsStatusArr[j]){
                requestObj.recipient = this.data.usersCollection.at(j).id;
                notifNumber = null;

                for (var i = 0; i < myNotif.length; i++) {
                    if(requestObj.recipient == myNotif[i].recipient && requestObj.postId == myNotif[i].postId){
                        notifNumber = i;
                    }
                }

                if (notifNumber === null){
                    newNotification = new RequestObj(requestObj);
                    self.notification.send.add(newNotification);
                    newNotification.save().then(
                        function() {
                            console.log(self.notification.send.toJSON());
                            console.log('ok');
                        },
                    function(error){
                        errArr.push(error.message)
                    });
                }else{
                    errArr.push('Was shared before now')
                }
            }
        }

        if(errArr.length){
            self.vent.trigger('showErrBox', 'Error: ' + errArr.join(' '))
        }else {
            self.vent.trigger('showErrBox', 'Ok: item shared')
        }



    },
    createNewPostCollection: function(postId, notification) {

        var query = new Parse.Query(ItemModel),
            self = this;

        query.get(postId, {
            success: function(gameScore) {
                self.data.newPostCollection.add(gameScore);
            },
            error: function(object, error) {

            }
        });


        console.log(postId, notification);
    },
    rejectPost:function(postId){
        var user = this.data.usersCollection.get(userId),
            self = this;

        notification.destroy({
            success: function () {
                user.unset('isRequestToFriends');
                self.vent.trigger('showErrBox', 'Ok: reject to Friends')
            },
            error: function (error) {
                self.vent.trigger('showErrBox', 'Error: ' + error.message)
            }
        });

    },
    /*SHARE ITEM END*/



























    /*HANDLING NOTIFICATION END*/
    chooseStartPage:function(){
        var user = Parse.User.current().toJSON(),
            messageForNewUser = 'Welcome to the best Shopping Social Network (SSN). To start using' +
                'the application, fill in the information about yourself';

        if(user.setupStatus == 'incomplete' || !user.setupStatus){
            this.showSettingsView();
            this.vent.trigger('showErrBox', messageForNewUser)
        }else{
            this.renderItemsList();
        }
    },

    /*DISPLAY VIEW BEGIN*/
    renderPreparation: function(){
        this.$el.html('');
        this.views.menuView.delegateEvents();
        this.$el.append(this.views.menuView.$el.hide());
    },
    renderItemsList: function(){
        this.renderPreparation();
        this.views.listsViews.delegateEvents();
        this.$el.append(this.views.listsViews.$el)
    },
    showPeopleView: function(){
        this.renderPreparation();
        this.views.peopleView.delegateEvents();
        this.$el.append(this.views.peopleView.$el)
    },
    showAddItemsForm: function(){
        this.renderPreparation();
        this.views.addForm.delegateEvents();
        this.$el.append(this.views.addForm.$el)
    },
    showFriendsView: function(){
        this.renderPreparation();
        this.views.friendsView = new FriendsView({model: this.data.usersCollection});
        this.views.friendsView.delegateEvents();
        this.$el.append(this.views.friendsView.$el)
    },
    showSuggestionView: function(){
        this.renderPreparation();
        this.views.suggestionView = new SuggestionView({model: this.data.newPostCollection});
        this.views.suggestionView.delegateEvents();
        this.$el.append(this.views.suggestionView.$el)
    }
    /*DISPLAY VIEW END*/
});