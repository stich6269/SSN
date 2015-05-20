RAD.view("view.my_friends_view", RAD.Blanks.View.extend({
    url: 'script/views/friends_view/my_friends/my_friends_view.html',
    onInitialize: function(){
        this.bindModel(RAD.application.data.FriendsCollection);
    },
    onStartAttach: function(){
        var self = this;
        this.model.refresh().then(function(data){
            self.model.reset(data);
        });
    },
    events:{
        'click .remove':'removeFriends'
    },
    removeFriends:function(event) {
        RAD.application.data.userId = this.getUserId(event);
        this.publish('service.notification.removeFriends', RAD.application.data);
    },
    getUserId: function(event){
        return $(event.currentTarget).parent().parent().attr('id');
    }
}));
