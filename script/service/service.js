RAD.service("service.show_error", RAD.Blanks.Service.extend({
    onReceiveMsg: function (channel, message) {
        this.publish('navigation.toast.show', {
            content: "view.popup",
            showTime: 2000,
            extras: {
                msg: message
            }
        });
    }
}));

RAD.service("service.items",  RAD.Blanks.Service.extend({
    onReceiveMsg: function(channel, data) {
        var parts = channel.split("."),
            func = parts[2];
        if (_.isFunction(this[func])) {
            this[func](data);
        }
    },
    addItem: function(data) {
        var newItemModel,
            self = this;

        data.newItemData.user = Parse.User.current();
        newItemModel = new RAD.models.Item();
        if (newItemModel.set(data.newItemData)) {
            newItemModel.save(null, {
                success: function () {
                    data.ItemsCollection.add(newItemModel);
                    self.publish('service.show_error', 'Item is added to your list');
                },
                error: function (error) {
                    self.publish('service.show_error', 'Error: ' + error.message)
                }
            });
        }
    },
    removeItem: function(data){
        var itemModel = data.ItemsCollection.get(data.modelId),
            currentNotification,
            promArr = [];

        for (var i = 0; i < data.PostNotification.length; i++) {
            currentNotification = data.PostNotification.at(i).get('content');
            if(data.modelId == currentNotification.id){
                promArr.push(data.PostNotification.at(i).destroy());
                data.PostNotification.remove(currentNotification);
            }
        }
        Parse.Promise.when(promArr).then(function() {
            data.ItemsCollection.remove(itemModel);
            itemModel.destroy();
        });


    },
    editItemModel: function(data){
        var itemModel = data.item,
            self = this;

        if (!!itemModel){
            itemModel.save(data.newItemData, {
                success: function () {
                    self.publish('service.show_error', 'Ok: data is updated')
                },
                error: function (error) {
                    self.publish('service.show_error', 'Error: ' + error.message)
                }
            });
        }
    },
    changeItemStatus:function(data){
        var itemModel = data.ItemsCollection.get(data.modelId);

        if (itemModel.get('status') == 'planned'){
            itemModel.save({status: 'bought'});
        }else{
            itemModel.save({status: 'planned'});
        }
    }
}));

RAD.service("service.network", RAD.Blanks.Service.extend({
    onReceiveMsg: function(channel, data) {
        var parts = channel.split("."),
            func = parts[2];
        if (_.isFunction(this[func])) {
            this[func](data);
        }
    },
    registration: function(newUser){
        var regUser = new RAD.models.User(),
            self = this;

        if (newUser.password === newUser.passwordRepeat && !!newUser.password){
            delete newUser.passwordRepeat;

            if (regUser.set(newUser, {validate: true})){
                regUser.signUp(newUser, {
                    success: function() {
                        self.publish('navigation.show', {
                            content: "view.login_view",
                            container_id: '#screen',
                            animation: 'slide-out',
                            extras:{
                                login: newUser.username,
                                password: newUser.password
                            }
                        });
                    },
                    error: function(user, error) {
                        self.publish('service.show_error', "Error: " + error.message);
                    }
                });
            }
        }else{
            this.publish('service.show_error', "Password and password repeat is not equal");
        }
    },
    login: function(user){
        var self = this;

        Parse.User.logIn(user.username, user.password, {
            success: function() {
                RAD.application.selectStartPage();
            },
            error: function(user, error) {
                self.publish('service.show_error', "Error: " + error.message)
            }
        });
    },
    updateUsersInfo: function(data){
        var self = this;

        data.currentUser.set(data.newUser, {validate: true});
        if(data.buttonId == 'save'){
            data.currentUser.save(null, {
                success: function() {
                    self.publish('service.show_error', 'OK: Your profile is updated! )');
                    RAD.application.userFilledProfile();
                },
                error: function(user, error) {
                    self.publish('service.show_error', 'Error: ' + error.message)
                }
            });
        }
    }
}));

RAD.service("service.post_notification",  RAD.Blanks.Service.extend({
    onReceiveMsg: function (channel, data) {
        var parts = channel.split("."),
            func = parts[2];
        if (_.isFunction(this[func])) {
            this[func](data);
        }
    },
    sharePost: function (data) {
        var post = data.ItemsCollection.get(data.modelId),
            promArr = [],
            notificationModel,
            self = this;


        if(isNotRepeatNotification()){
            for (var i = 0; i < data.FriendsCollection.length; i++) {
                var postNotification = {
                    sender: Parse.User.current().id,
                    recipient: data.FriendsCollection.at(i),
                    content: post
                };
                notificationModel = new RAD.models.PostRequest(postNotification);
                data.PostNotification.add(notificationModel);
                promArr.push(notificationModel.save());
            }
            Parse.Promise.when(promArr).then(function() {
                self.publish('service.show_error', 'OK: This post was shared to all your friends');
            });
        }else{
            self.publish('service.show_error', 'Error: This post was shared before now');
        }

        function isNotRepeatNotification(){
            var currentId;

            for (var i = 0; i <  data.PostNotification.length; i++) {
                currentId =  data.PostNotification.at(i).get('content').id;
                if(currentId == data.modelId){
                    return false
                }
            }
            return true;
        }

    },
    takePost: function (data) {
        var takePost = data.SuggestionPosts.get(data.postId),
            newPostData = takePost.toJSON(),
            self = this;

        takePost.get('notification').destroy().then(function () {
            data.SuggestionPosts.remove(takePost);
            self.publish('service.items.addItem', {
                newItemData: newPostData,
                ItemsCollection: RAD.model('ItemsCollection')
            });
        });
    },
    deletePost: function (data) {
        var takePost = data.SuggestionPosts.get(data.postId);

        takePost.get('notification').destroy().then(function () {
            data.SuggestionPosts.remove(takePost);
        });
    },
    getSuggestionPosts: function(data){
        var myId = Parse.User.current().id,
            collection = data.PostNotification,
            currentRecipient,
            itemModel,
            suggestPosts = [];

        for (var i = 0; i < collection.length; i++) {
            currentRecipient = collection.at(i).get('recipient');
            if(currentRecipient.id == myId){
                itemModel = collection.at(i).get('content');
                itemModel.set('notification', collection.at(i));
                suggestPosts.push(itemModel);
            }
        }
        data.SuggestionPosts.reset(suggestPosts);
        if(data.SuggestionPosts.length){
            this.publish('service.show_error', 'Your friends sent you '
                + data.SuggestionPosts.length + ' new alert purchases')
        }
    }
}));

RAD.service("service.notification",  RAD.Blanks.Service.extend({
    onReceiveMsg: function(channel, data) {
        var parts = channel.split("."),
            func = parts[2];
        if (_.isFunction(this[func])) {
            this[func](data);
        }
    },
    sendFriendRequest: function(data){
        var newNotification,
            recipient = data.requestObj.recipient,
            newFriend = data.UsersCollection.get(recipient),
            notification = this.findMyNotificationModel({
                FriendNotification: data.FriendNotification,
                recipient: recipient
            });

        if (!notification){
            data.requestObj.sender = Parse.User.current().id;
            newNotification = new RAD.models.FriendRequest(data.requestObj);
            newNotification.save().then(
                function() {
                    data.FriendNotification.add(newNotification);
                    newFriend.set('sendFriendInv', true);
                });
        }else{
            notification.destroy().then(
                function() {
                    newFriend.set('sendFriendInv', false);
                });
        }
    },
    markPeopleWithNotification: function(data){
        var recipient,
            notification,
            isMyFriend;

        for (var i = 0; i < data.UsersCollection.length; i++) {
            recipient = data.UsersCollection.at(i).id;
            isMyFriend = data.FriendsCollection.get(recipient);
            notification = this.findMyNotificationModel({
                FriendNotification: data.FriendNotification,
                recipient: recipient
            });

            if(notification){
                data.UsersCollection.at(i).set('sendFriendInv', true);
            }
            if(isMyFriend){
                data.UsersCollection.at(i).set('myFriends', true);
            }
        }
    },
    getIncomingFriendNotification: function(data){
        var myId = Parse.User.current().id,
            currentRecipient,
            newFriends = [],
            sender,
            response;

        for (var i = 0; i < data.FriendNotification.length; i++) {
            currentRecipient = data.FriendNotification.at(i).get('recipient');
            response = data.FriendNotification.at(i).get('response');
            if (currentRecipient == myId && response == 'none' ) {
                sender = data.FriendNotification.at(i).get('sender');
                newFriends.push(data.UsersCollection.get(sender));
            }
        }
        data.NewFriendsCollection.reset(newFriends)
        if(data.NewFriendsCollection.length){
            this.publish('service.show_error', 'Your friends sent you '
            + data.NewFriendsCollection.length + ' new friend request')
        }
    },
    rejectToFriends: function(data){
        var user = data.NewFriendsCollection.get(data.userId),
            notification,
            self = this;

        notification = this.findNotificationModelForMe({
            FriendNotification: data.FriendNotification,
            userId: data.userId
        });

        notification.destroy().then(function () {
                self.publish('service.show_error', 'Ok: reject to Friends');
                data.NewFriendsCollection.remove(user);
            });
    },
    acceptToFriends: function(data){
        var user = Parse.User.current(),
            friend = data.NewFriendsCollection.get(data.userId),
            relation = user.relation('Friends'),
            notification,
            self = this;

        notification = this.findNotificationModelForMe({
            FriendNotification: data.FriendNotification,
            userId: data.userId
        });

        notification.set('response', 'ok');
        notification.save().then(function(){
            relation.add(friend);
            return user.save();
        }).then(function(){
            self.publish('service.show_error', 'Ok: new friends added');
            data.FriendsCollection.add(friend);
            data.NewFriendsCollection.remove(friend);
        })
    },
    getConfirmedFriend: function(data){
        var user = Parse.User.current(),
            relation = user.relation('Friends'),
            count = 0,
            self = this,
            currentNotif,
            newFriend,
            promArr = [];

        for (var i = 0; i < data.FriendNotification.length; i++) {
            currentNotif = data.FriendNotification.at(i).toJSON();
            if (currentNotif.sender == user.id && currentNotif.response == 'ok'){
                newFriend = data.UsersCollection.get(currentNotif.recipient);
                data.FriendsCollection.add(newFriend);
                promArr.push(data.UsersCollection.at(i).destroy());
                relation.add(newFriend);
                count ++;
            }
        }

        Parse.Promise.when(promArr).then(function() {
            user.save().then(function(){
                if(count){
                    self.publish('service.show_error', 'Yo have are ' + count + ' new friends!');
                    count = 0;
                }
            });
        });




    },
    removeFriends: function(data){
        var spliceUser = data.FriendsCollection.get(data.userId),
            user = Parse.User.current(),
            relation = user.relation('Friends');

        relation.remove(spliceUser);
        user.save().then(function(){
            data.FriendsCollection.remove(spliceUser)
        });
    },
    findMyNotificationModel: function(data){
        var myId = Parse.User.current().id,
            currentSender,
            currentRecipient;

        for (var i = 0; i < data.FriendNotification.length; i++) {
            currentSender = data.FriendNotification.at(i).get('sender');
            currentRecipient = data.FriendNotification.at(i).get('recipient');
            if (myId == currentSender && data.recipient == currentRecipient){
                return data.FriendNotification.at(i)
            }
        }
        return false;
    },
    findNotificationModelForMe: function(data) {
        var myId = Parse.User.current().id,
            currentSender,
            currentRecipient;

        for (var i = 0; i < data.FriendNotification.length; i++) {
            currentSender = data.FriendNotification.at(i).get('sender');
            currentRecipient = data.FriendNotification.at(i).get('recipient');
            console.log(data.userId, '=',currentSender, currentRecipient,'=', myId);
            if (data.userId == currentSender && currentRecipient == myId) {
                return data.FriendNotification.at(i)
            }
        }
        return false;
    }
}));