RAD.view("view.my_friends_view", RAD.Blanks.View.extend({
    url: 'script/views/friends_view/my_friends/my_friends_view.html',
    onInitialize: function(){
        this.bindModel(RAD.model('FriendsCollection'));
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
        var userId = this.getUserId(event),
            data = {
                userId: userId,
                FriendsCollection: RAD.model('FriendsCollection')
            };
        this.publish('service.notification.removeFriends', data);
    },
    getUserId: function(event){
        return $(event.currentTarget).parent().parent().attr('id');
    }
}));
