RAD.view("view.new_friends_view", RAD.Blanks.View.extend({
    url: 'script/views/friends_view/new_friends/new_friends_view.html',
    onInitialize: function(){
        this.bindModel(RAD.model('NewFriendsCollection'));
    },
    onStartAttach: function(){
        this.model.refresh();
    },
    onEndDetach: function(){
        this.model.refresh();
    },
    events:{
        'click .accept':'acceptToFriends',
        'click .reject':'rejectToFriends'
    },
    acceptToFriends: function(event) {
        var userId = this.getUserId(event);
        this.publish('service.notification.acceptToFriends', userId);
    },
    rejectToFriends:function(event) {
        var userId = this.getUserId(event);
        this.publish('service.notification.rejectToFriends', userId);
    },
    getUserId: function(event){
        return $(event.currentTarget).parent().parent().attr('id');
    }
}));