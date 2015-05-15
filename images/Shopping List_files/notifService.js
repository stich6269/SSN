var NotificationService = {
    sendFriendRequest: function(requestObj, data){
        var sentNotif = data.sentFriendsNotif.pluck('recipient') || [],
            newNotification,
            recipient = requestObj.recipient,
            sendRequestToUser = data.usersCollection.get(recipient),
            chkObj = {
                notifIsSent: function(){
                    return sentNotif.indexOf(recipient) == -1
                },
                userIsFriend: function(){
                    return !!data.friendsCollection.get(sendRequestToUser);
                },
                isRequestForSelf: function(){
                    return requestObj.sender != requestObj.recipient;
                }
            };


        requestObj.sender = Parse.User.current().id;
        if (chkObj.notifIsSent() && !chkObj.userIsFriend() && chkObj.isRequestForSelf()){
            newNotification = new FriendRequest(requestObj);
            newNotification.save().then(
                function() {
                    data.sentFriendsNotif.add(newNotification);
                    sendRequestToUser.set('sendFriendInv', true);
                    vent.trigger('showMessageBox', 'Ok: notification was send');
                });
        }else{
            if(!data.friendsCollection.get(sendRequestToUser) && chkObj.isRequestForSelf()){
                data.sentFriendsNotif.at(sentNotif.indexOf(recipient)).destroy().then(
                    function() {
                        sendRequestToUser.set('sendFriendInv', false);
                        vent.trigger('showMessageBox', 'Ok: notification was canceled');
                    });
            }else{
                vent.trigger(
                    'showMessageBox', 'Warning: This user is your friend, or you tray send request for your self'
                );
            }
        }
    },
    rejectToFriends: function(userId, data){
        var notification = this.findNotifModel(userId, data),
            user = data.newFriendsCollection.get(userId);

        notification.destroy({
            success: function () {
                vent.trigger('showMessageBox', 'Ok: reject to Friends');
                data.newFriendsCollection.remove(user);
                ParseServices.getAllData(data);
            },
            error: function (error) {
                vent.trigger('showMessageBox', 'Error: ' + error.message)
            }
        });
    },
    acceptToFriends: function(userId, data){
        var friend = data.newFriendsCollection.get(userId),
            notification = this.findNotifModel(userId, data),
            user = Parse.User.current(),
            relation = user.relation('Friends');

        notification.set('response', 'ok');
        notification.save().then(function(){
            relation.add(friend);
            return user.save();
        }).then(function(){
            vent.trigger('showMessageBox', 'Ok: new friends added');
            data.friendsCollection.add(friend);
            data.newFriendsCollection.remove(friend);
            ParseServices.getAllData(data);
        })
    },
    processingOfRequestsInFriend: function(data){
        var recipientArr = data.incomingFriendsNotif.pluck("sender"),
            sendAnApplicationUser;

        data.newFriendsCollection = new UsersCollection();
        for (var i = 0; i < recipientArr.length; i++) {
            sendAnApplicationUser = data.usersCollection.get(recipientArr[i]);
            if(data.incomingFriendsNotif.at(i).get('response') === 'none'){
                data.newFriendsCollection.add(sendAnApplicationUser);
            }
        }
    },
    processingOfConfirmedOrders: function(data){
        var sentNotification = data.sentFriendsNotif.pluck('recipient'),
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
                vent.trigger('showMessageBox', 'Yo have are ' + count + ' new friends!')
                count = 0;
            }
        });
    },
    rejectWithFriends: function(userId, data){
        var spliceUser = data.friendsCollection.get(userId),
            user = Parse.User.current(),
            relation = user.relation('Friends');

        relation.remove(spliceUser);
        user.save().then(function(){
            vent.trigger('showMessageBox', 'Friend is removed');
            data.friendsCollection.remove(spliceUser)
        });
    },
    findNotifModel: function(userId, data){
        var incFriendsNotif = data.incomingFriendsNotif.pluck('sender'),
            notifNumber = incFriendsNotif.indexOf(userId);

        return data.incomingFriendsNotif.at(notifNumber);
    },
    markPeopleWithNotification: function(data){
        var recipientsNotification = data.sentFriendsNotif.pluck('recipient'),
            sentNotificationToUser;

        for (var i = 0; i < recipientsNotification.length; i++) {
            sentNotificationToUser = data.usersCollection.get(recipientsNotification[i]);
            sentNotificationToUser.set('sendFriendInv', true);
        }
    }
};

var PostNotificationServices = {
    sharePost: function(postId, data){
        var post = data.itemsCollection.get(postId),
            friendsCount = data.friendsCollection.length,
            currentUser,
            postNotification = {},
            notificationModel,
            sentPostArr = [];

        for (var i = 0; i < friendsCount; i++) {
            currentUser = data.friendsCollection.at(i);
            postNotification.sender = Parse.User.current().id;
            postNotification.recipient = currentUser;
            postNotification.content = post;
            notificationModel = new PostRequest(postNotification);
            notificationModel.save().then(function(){
                data.sentPostNotification.add(sentPostArr);
            });
        }
        vent.trigger('showMessageBox', 'Post was shared');
    },
    processingSuggestionPost: function(data){
        var incPostNot = data.incomingPostNotification.pluck('content');

        data.suggestionPostCollection = new ItemCollection();
        data.suggestionPostCollection.add(incPostNot);
        console.log('processingSuggestionPost', incPostNot);
    }
};

var ItemService = {
    addItem: function(newItemData, itemsCollection) {
        var newItemModel;

        newItemData.user = Parse.User.current();
        newItemModel = new ItemModel();
        if (newItemModel.set(newItemData)) {
            newItemModel.save(null, {
                success: function () {
                    itemsCollection.add(newItemModel);
                    vent.trigger('showMessageBox', 'Item is added');
                },
                error: function (error) {
                    vent.trigger('showMessageBox', 'Error: ' + error.message)
                }
            });
        }
    },
    removeItem: function(modelId, itemsCollection){
        var itemModel;

        itemModel = itemsCollection.get(modelId);
        itemsCollection.remove(itemModel);
        itemModel.destroy({
            error: function (error) {
                vent.trigger('showMessageBox', 'Error: ' + error.message)
            }
        });
    },
    editItemModel: function(item, newItemData){
        var itemModel = item;

        if (!!itemModel){
            itemModel.save(newItemData, {
                success: function () {
                    vent.trigger('showMessageBox', 'Ok: data is updated')
                },
                error: function (error) {
                    vent.trigger('showMessageBox', 'Error: ' + error.message)
                }
            });
        }
    },
    changeItemStatus:function(modelId, itemsCollection){
        var itemModel = itemsCollection.get(modelId);

        if (itemModel.get('status') == 'planned'){
            itemModel.save({status: 'bought'});
        }else{
            itemModel.save({status: 'planned'});
        }
    }
};

var ParseServices = {
    getAllData: function(data, callback, self){
        var itemsQuery = new Parse.Query(ItemModel),
            sentFriendsRequest = new Parse.Query(FriendRequest),
            incFriendsRequest = new Parse.Query(FriendRequest),
            sentPostRequest = new Parse.Query(PostRequest),
            incPostRequest = new Parse.Query(PostRequest),
            users = Parse.User.current(),
            relation = users.relation('Friends');

        data.itemsCollection = new ItemCollection();
        data.usersCollection = new UsersCollection();
        data.friendsCollection = new UsersCollection();
        data.sentFriendsNotif = new FriendsNotificationCollection();
        data.incomingFriendsNotif = new FriendsNotificationCollection();
        data.sentPostNotification = new PostNotificationCollection();
        data.incomingPostNotification = new PostNotificationCollection();

        console.log('--- Start get data  ---');
        console.time('time');
        itemsQuery.equalTo("user", Parse.User.current());
        itemsQuery.find().then(function(usersItems) {
            data.itemsCollection.add(usersItems);
        console.log('get item >>>');
            return data.usersCollection.fetch();
            }).then(function(){
                sentFriendsRequest.equalTo("sender", Parse.User.current().id);
        console.log('get sent friend notif >>>');
                return sentFriendsRequest.find();
            }).then(function(friendsRequest){
                data.sentFriendsNotif.add(friendsRequest);
        console.log('get friend >>>');
                return relation.query().find();
            }).then(function(friends){
                data.friendsCollection.add(friends);
                incFriendsRequest.equalTo("recipient", Parse.User.current().id);
        console.log('get inc friend notif >>>');
                return incFriendsRequest.find();
            }).then(function(incFriendsRequest){
                data.incomingFriendsNotif.add(incFriendsRequest);
                sentPostRequest.equalTo("sender", Parse.User.current().id);
        console.log('get sent post notif >>>');
                return sentPostRequest.find();
            }).then(function(sentPost){
                data.sentPostNotification.add(sentPost);
                incPostRequest.equalTo('recipient', Parse.User.current());
                incPostRequest.include('content');
        console.log('get inc post notif >>>');
                return incPostRequest.find();
            }).then(function(incPostRequest){
                data.incomingPostNotification.add(incPostRequest);
        console.log('post for me', incPostRequest);
                NotificationService.processingOfRequestsInFriend(data);
                NotificationService.processingOfConfirmedOrders(data);
                PostNotificationServices.processingSuggestionPost(data);
                console.log('--- Data received ---');
                console.timeEnd('time');
                if (typeof callback === "function"){
                    callback(self);
                }
            })
    }
};