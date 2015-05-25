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
        var takePost = data.SuggestionPosts.get(data.modelId),
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
        var takePost = data.SuggestionPosts.get(data.modelId);

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