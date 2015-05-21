RAD.service("service.friend_notification",  RAD.Blanks.Service.extend({
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
            newFriend.set('sendFriendInv', 'send');
            newNotification.save().then(
                function() {
                    newFriend.set('sendFriendInv', true);
                    data.FriendNotification.add(newNotification);
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
        data.NewFriendsCollection.reset(newFriends);
        if(data.NewFriendsCollection.length){
            this.publish('service.show_error', 'Your friends sent you '
            + data.NewFriendsCollection.length + ' new friend request')
        }
    },
    rejectToFriends: function(data){
        var user = data.NewFriendsCollection.get(data.userId),
            notification;

        notification = this.findNotificationModelForMe({
            FriendNotification: data.FriendNotification,
            userId: data.userId
        });

        notification.destroy().then(function () {
            data.NewFriendsCollection.remove(user);
        });
    },
    acceptToFriends: function(data){
        var user = Parse.User.current(),
            friend = data.NewFriendsCollection.get(data.userId),
            relation = user.relation('Friends'),
            notification;

        notification = this.findNotificationModelForMe({
            FriendNotification: data.FriendNotification,
            userId: data.userId
        });

        notification.set('response', 'ok');
        notification.save().then(function() {
            if(!data.FriendsCollection.get(data.userId)){
                relation.add(friend);
                user.save().then(function () {
                    data.FriendsCollection.add(friend);
                });
            }
            data.NewFriendsCollection.remove(friend);
        });
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
                console.log('new friend', newFriend, data.FriendsCollection.length);
                data.FriendsCollection.add(newFriend);
                console.log('after add', data.FriendsCollection.length);
                promArr.push(data.FriendNotification.at(i).destroy());
                relation.add(newFriend);
                count ++;
            }
        }

        if(promArr.length){
            Parse.Promise.when(promArr).then(function() {
                user.save().then(function(){
                    if(count){
                        self.publish('service.show_error', 'Yo have are ' + count + ' new friends!');
                        count = 0;
                    }
                });
            });
        }
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
            if (data.userId == currentSender && currentRecipient == myId) {
                return data.FriendNotification.at(i)
            }
        }
        return false;
    }
}));