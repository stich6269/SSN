RAD.view("view.new_friends_view", RAD.Blanks.View.extend({
    url: 'script/views/friends_view/new_friends/new_friends_view.html',
    onInitialize: function(){
        this.bindModel(RAD.model('NewFriendsCollection'));
    },
    events:{
        'click .accept':'acceptToFriends',
        'click .reject':'rejectToFriends'
    },
    acceptToFriends: function(event) {
        var userId = this.getUserId(event),
            data = {
                userId: userId,
                NewFriendsCollection: RAD.model('NewFriendsCollection'),
                FriendNotification: RAD.model('FriendNotification'),
                FriendsCollection: RAD.model('FriendsCollection')
            };

        this.publish('service.notification.acceptToFriends', data);
    },
    rejectToFriends:function(event) {
        var userId = this.getUserId(event),
            data = {
                userId: userId,
                NewFriendsCollection: RAD.model('NewFriendsCollection'),
                FriendNotification: RAD.model('FriendNotification')
            };

        this.publish('service.notification.rejectToFriends', data);
    },
    getUserId: function(event){
        return $(event.currentTarget).parent().parent().attr('id');
    }
}));