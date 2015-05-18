RAD.model('ItemsCollection', Parse.Collection.extend({
    model: RAD.model('Item'),
    query: new Parse.Query(RAD.model('Item')),
    refresh: function () {
        var self = this;

        this.query.equalTo('user', Parse.User.current());
        this.query.find().then(function(data){
            self.reset(data);
        });
    }
}), true);




RAD.model('SuggestionPosts', Parse.Collection.extend({
    model: RAD.model('Item')
}), true);

RAD.model('UsersCollection', Parse.Collection.extend({
    model: RAD.model('User'),
    onInitialize: function(){
        this.refresh();
    },
    refresh: function () {
         this.fetch()
    }
}), true);

RAD.model('FriendsCollection', Parse.Collection.extend({
    model: RAD.model('User'),
    refresh: function () {
        var users = Parse.User.current(),
            relation = users.relation('Friends'),
            self = this;

        relation.query().find().then(function(data){
            self.reset(data);
        });
    }
}), true);

RAD.model('IncFriendsRequest', Parse.Collection.extend({
    model: RAD.model('FriendRequest'),
    query: new Parse.Query(RAD.model('FriendRequest')),
    refresh: function () {
        var self = this;

        this.query.equalTo("recipient", Parse.User.current().id);
        this.query.find().then(function(data){
            self.reset(data);
        });
    }
}), true);

RAD.model('SentFriendsNotification', Parse.Collection.extend({
    model: RAD.model('FriendRequest'),
    query: new Parse.Query(RAD.model('FriendRequest')),
    refresh: function () {
        var self = this;

        this.query.equalTo("sender", Parse.User.current().id);
        this.query.find().then(function(data){
            self.reset(data);
            RAD.core.publish('service.notification.processingOfConfirmedOrders');
        });
    }
}), true);


RAD.model('SentPostNotification', Parse.Collection.extend({
    model: RAD.model('PostRequest'),
    query: new Parse.Query(RAD.model('PostRequest')),
    refresh: function () {
        var self = this;

        this.query.equalTo("sender", Parse.User.current().id);
        this.query.find().then(function(data){
            self.reset(data);
        });
    }
}), true);

RAD.model('IncomingPostNotification', Parse.Collection.extend({
    model: RAD.model('PostRequest'),
    query: new Parse.Query(RAD.model('PostRequest')),
    refresh: function () {
        var self = this;

        this.query.equalTo('recipient', Parse.User.current());
        this.query.include('content');
        this.query.find().then(function(data){
            self.reset(data);
            RAD.core.publish('service.post_notification.processingSuggestionPost')
        });
    }
}), true);


RAD.model('NewFriendsCollection', Parse.Collection.extend({
    model: RAD.model('User'),
    refresh: function () {
        var recipientArr = RAD.model('IncFriendsRequest').pluck("sender"),
            sendAnApplicationUser;

        for (var i = 0; i < recipientArr.length; i++) {
            sendAnApplicationUser = RAD.model('UsersCollection').get(recipientArr[i]);
            if(RAD.model('IncFriendsRequest').at(i).get('response') === 'none'){
                this.add(sendAnApplicationUser);
            }
        }
    }
}), true);