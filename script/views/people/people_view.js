RAD.view("view.people_view", RAD.Blanks.ScrollableView.extend({
    url: 'script/views/people/people_view.html',
    events:{
        'click .add_users' : 'sendFriendRequest'
    },
    onInitialize: function(){
        this.bindModel(RAD.application.data.UsersCollection);
    },
    getModelId: function (event) {
        return $(event.currentTarget).parent().attr('id');
    },
    sendFriendRequest:function(event){
        var recipient = this.getModelId(event),
            requestObj = {
                sender: null,
                response: 'none',
                recipient: recipient
            },
            data = {
                requestObj: requestObj,
                UsersCollection: RAD.model('UsersCollection'),
                FriendsCollection: RAD.model('FriendsCollection'),
                FriendNotification: RAD.model('FriendNotification')
            };

        this.publish('service.notification.sendFriendRequest', data);
    }
}));