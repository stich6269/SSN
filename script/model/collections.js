RAD.model('ItemsCollection', Parse.Collection.extend({
    model: RAD.model('Item'),
    query: new Parse.Query(RAD.model('Item')),
    refresh: function () {
        this.query.equalTo('user', Parse.User.current());
        return this.fetch();
    }
}), false);

RAD.model('UsersCollection', Parse.Collection.extend({
    model: RAD.model('User'),
    refresh: function () {
         return this.fetch()
    }
}), false);

RAD.model('FriendsCollection', Parse.Collection.extend({
    model: RAD.model('User'),
    refresh: function () {
        var users = Parse.User.current(),
            relation = users.relation('Friends');

        return relation.query().find()
    }
}), false);

RAD.model('PostNotification', Parse.Collection.extend({
    model: RAD.model('PostRequest'),
    query: new Parse.Query(RAD.model('PostRequest')),
    refresh: function () {
        this.query.include('content');
        return this.fetch();
    }
}), false);

RAD.model('FriendNotification', Parse.Collection.extend({
    model: RAD.model('FriendRequest'),
    refresh: function () {
        return this.fetch();
    }
}), false);

RAD.model('SuggestionPosts', Parse.Collection.extend({
    model: RAD.model('Item')
}), false);

RAD.model('NewFriendsCollection', Parse.Collection.extend({
    model: RAD.model('User'),
}), false);
