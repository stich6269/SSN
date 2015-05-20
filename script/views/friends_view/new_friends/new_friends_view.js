RAD.view("view.new_friends_view", RAD.Blanks.View.extend({
    url: 'script/views/friends_view/new_friends/new_friends_view.html',
    onInitialize: function(){
        this.bindModel(RAD.application.data.NewFriendsCollection);
    },
    onStartAttach: function(){

    },
    events:{
        'click .accept':'acceptToFriends',
        'click .reject':'rejectToFriends'
    },
    acceptToFriends: function(event) {
        RAD.application.data.userId = this.getUserId(event);
        this.publish('service.friend_notification.acceptToFriends', RAD.application.data);
    },
    rejectToFriends:function(event) {
        RAD.application.data.userId = this.getUserId(event);
        this.publish('service.friend_notification.rejectToFriends', RAD.application.data);
    },
    getUserId: function(event){
        return $(event.currentTarget).parent().parent().attr('id');
    }
}));