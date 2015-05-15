RAD.view("view.my_friends_view", RAD.Blanks.View.extend({
    url: 'script/views/friends_view/my_friends/my_friends_view.html',
    onInitialize: function(){
        this.bindModel(RAD.model('FriendsCollection'));
    },
    onStartAttach: function(){
        this.model.refresh();
    },
    onEndDetach: function(){
        this.model.refresh();
    },
    events:{
        'click .remove':'removeFriends'
    },
    removeFriends:function(event) {
        var userId = this.getUserId(event);
        this.publish('service.notification.removeFriends', userId);
    },
    getUserId: function(event){
        return $(event.currentTarget).parent().parent().attr('id');
    }
}));
