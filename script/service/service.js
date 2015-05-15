RAD.service("service.show_error", RAD.Blanks.Service.extend({
    onReceiveMsg: function (channel, message) {
        this.publish('navigation.popup.show', {
            content: "view.popup",
            extras: {
                msg: message
            }
        });
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
        var currentUser = Parse.User.current(),
            self = this;

        currentUser.set(data.newUser, {validate: true});
        if(data.buttonId == 'save'){
            currentUser.save(null, {
                success: function() {
                    self.publish('service.show_error', 'OK: Data is updated)');
                    RAD.application.userFilledProfile();
                },
                error: function(user, error) {
                    self.publish('service.show_error', 'Error: ' + error.message)
                }
            });
        }
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
    addItem: function(newItemData) {
        var newItemModel,
            self = this;

        newItemData.user = Parse.User.current();
        newItemModel = new RAD.models.Item();
        if (newItemModel.set(newItemData)) {
            newItemModel.save(null, {
                success: function () {
                    RAD.model('ItemsCollection').add(newItemModel);
                    self.publish('service.show_error', 'Item is added');
                },
                error: function (error) {
                    self.publish('service.show_error', 'Error: ' + error.message)
                }
            });
        }
    },
    removeItem: function(modelId){
        var itemModel,
            self = this;

        itemModel = RAD.model('ItemsCollection').get(modelId);
        RAD.model('ItemsCollection').remove(itemModel);
        itemModel.destroy({
            error: function (error) {
                self.publish('service.show_error', 'Error: ' + error.message)
            }
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
    changeItemStatus:function(modelId){
        var itemModel = RAD.model('ItemsCollection').get(modelId);

        if (itemModel.get('status') == 'planned'){
            itemModel.save({status: 'bought'});
        }else{
            itemModel.save({status: 'planned'});
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
    sharePost: function (postId) {
        var post = RAD.model('ItemsCollection').get(postId),
            currentUser,
            postNotification = {},
            notificationModel,
            sentPostArr = [],
            self = this;

        var notificationRequest;
        notificationRequest = new Parse.Query(RAD.model('PostRequest'));
        notificationRequest.equalTo('content', post);
        notificationRequest.find().then(function (notifications) {
            if (!notifications.length) {
                for (var i = 0; i < RAD.model('FriendsCollection').length; i++) {
                    currentUser = RAD.model('FriendsCollection').at(i);
                    postNotification.sender = Parse.User.current().id;
                    postNotification.recipient = currentUser;
                    postNotification.content = post;
                    notificationModel = new RAD.models.PostRequest(postNotification);

                    notificationModel.save().then(function () {
                        RAD.model('SentPostNotification').add(sentPostArr);
                        self.publish('service.show_error', 'OK: Post was shared');
                    });
                }
            } else {
                self.publish('service.show_error', 'Err: Post was shared before now');
            }
        });

    },
    processingSuggestionPost: function (data) {
        var incPostNot = data.incomingPostNotification.pluck('content');

        data.suggestionPostCollection = new ItemCollection();
        data.suggestionPostCollection.add(incPostNot);
        console.log('processingSuggestionPost', incPostNot);
    },
    takePost: function (postId, data) {
        var takePost = data.suggestionPostCollection.get(postId),
            newPostData = takePost.toJSON(),
            notificationRequest = new Parse.Query(PostRequest);

        notificationRequest.equalTo('content', takePost);
        notificationRequest.find().then(function (notification) {
            return notification[0].destroy();
        }).then(function () {
            data.suggestionPostCollection.remove(takePost);
            ItemService.addItem(newPostData, data.itemsCollection);
        });
    },
    deletePost: function (postId, data) {
        var takePost = data.suggestionPostCollection.get(postId),
            notificationRequest = new Parse.Query(PostRequest);

        notificationRequest.equalTo('content', takePost);
        notificationRequest.find().then(function (notification) {
            console.log(notification[0]);
            return notification[0].destroy();
        }).then(function () {
            data.suggestionPostCollection.remove(takePost);
        });
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
    sendFriendRequest: function(requestObj){
        var sentNotif = RAD.model('SentFriendsNotification').pluck('recipient') || [],
            newNotification,
            recipient = requestObj.recipient,
            sendRequestToUser = RAD.model('UsersCollection').get(recipient),
            self = this,
            chkObj = {
                notifIsSent: function(){
                    return sentNotif.indexOf(recipient) == -1
                },
                userIsFriend: function(){
                    return !! RAD.model('FriendsCollection').get(sendRequestToUser);
                },
                isRequestForSelf: function(){
                    return requestObj.sender != requestObj.recipient;
                }
            };

        requestObj.sender = Parse.User.current().id;
        if (chkObj.notifIsSent() && !chkObj.userIsFriend() && chkObj.isRequestForSelf()){
            newNotification = new RAD.models.FriendRequest(requestObj);
            newNotification.save().then(
                function() {
                    RAD.model('SentFriendsNotification').add(newNotification);
                    sendRequestToUser.set('sendFriendInv', true);
                });
        }else{
            if(!RAD.model('FriendsCollection').get(sendRequestToUser) && chkObj.isRequestForSelf()){
                RAD.model('SentFriendsNotification').at(sentNotif.indexOf(recipient)).destroy().then(
                    function() {
                        sendRequestToUser.set('sendFriendInv', false);
                    });
            }else{
                self.publish('service.show_error', 'Warning: This user is your friend, or you tray send request for your self');
            }
        }
    },
    rejectToFriends: function(userId){
        var data = window.RAD.application.data,
            notification = this.findNotifModel(userId, data),
            user = data.newFriendsCollection.get(userId),
            self = this;

        notification.destroy({
            success: function () {
                self.publish('service.show_error', 'Ok: reject to Friends');
                data.newFriendsCollection.remove(user);
                self.publish('service.network.getUsersData');
            },
            error: function (error) {
                self.publish('service.show_error', 'Error: ' + error.message)
            }
        });
    },
    acceptToFriends: function(userId){
        var friend = RAD.model('NewFriendsCollection').get(userId),
            notification = this.findNotifModel(userId),
            user = Parse.User.current(),
            relation = user.relation('Friends'),
            self = this;

        notification.set('response', 'ok');
        notification.save().then(function(){
            relation.add(friend);
            return user.save();
        }).then(function(){
            self.publish('service.show_error', 'Ok: new friends added');
            RAD.model('FriendsCollection').add(friend);
            RAD.model('NewFriendsCollection').remove(friend);
            self.publish('service.network.getUsersData');
        })
    },
    processingOfRequestsInFriend: function(){
        var data = window.RAD.application.data,
            recipientArr = data.incomingFriendsNotif.pluck("sender"),
            sendAnApplicationUser;

        data.newFriendsCollection = new UsersCollection();
        for (var i = 0; i < recipientArr.length; i++) {
            sendAnApplicationUser = data.usersCollection.get(recipientArr[i]);
            if(data.incomingFriendsNotif.at(i).get('response') === 'none'){
                data.newFriendsCollection.add(sendAnApplicationUser);
            }
        }
    },
    processingOfConfirmedOrders: function(){
        var data = window.RAD.application.data,
            sentNotification = data.sentFriendsNotif.pluck('recipient'),
            user = Parse.User.current(),
            relation = user.relation('Friends'),
            addFriend,
            count = 0;

        for (var i = 0; i < sentNotification.length; i++) {
            if(data.sentFriendsNotif.at(i).get('response') == 'ok'){
                addFriend = data.usersCollection.get(sentNotification[i]);
                data.friendsCollection.add(addFriend);
                relation.add(addFriend);
                data.sentFriendsNotif.at(i).destroy();
                sentNotification.splice(i, 1);
                count++;
            }
        }
        user.save().then(function(){
            if(count){
                self.publish('service.show_error', 'Yo have are ' + count + ' new friends!')
                count = 0;
            }
        });
    },
    removeFriends: function(userId){
        var spliceUser = RAD.model('FriendsCollection').get(userId),
            user = Parse.User.current(),
            relation = user.relation('Friends');

        relation.remove(spliceUser);
        user.save().then(function(){
            RAD.model('FriendsCollection').remove(spliceUser)
        });
    },
    findNotifModel: function(userId){
        var incFriendsNotif = RAD.model('IncFriendsRequest').pluck('sender'),
            notifNumber = incFriendsNotif.indexOf(userId);

        return  RAD.model('IncFriendsRequest').at(notifNumber);
    },
    markPeopleWithNotification: function(){
        var recipientsNotification = RAD.model('SentFriendsNotification').pluck('recipient'),
            myFriends = RAD.model('FriendsCollection'),
            sentNotificationToUser;

        for (var i = 0; i < recipientsNotification.length; i++) {
            sentNotificationToUser = RAD.model('UsersCollection').get(recipientsNotification[i]);
            sentNotificationToUser.set('sendFriendInv', true);
        }
        for (var j = 0; j <  myFriends.length; j++) {
            sentNotificationToUser = RAD.model('UsersCollection').get(myFriends.at(j));
            console.log(sentNotificationToUser.get('name'));
            sentNotificationToUser.set('myFriends', true);
        }
        console.log(RAD.model('FriendsCollection').toJSON());
    }
}));

