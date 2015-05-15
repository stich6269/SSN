RAD.view("view.people_view", RAD.Blanks.ScrollableView.extend({
    url: 'script/views/people/people_view.html',
    events:{
        'click .add_users' : 'sendFriendRequest'
    },
    onInitialize: function(){
        this.bindModel(RAD.model('UsersCollection'));
    },
    onStartAttach: function(){
        this.publish('service.notification.markPeopleWithNotification');
    },
    getModelId: function (event) {
        return $(event.currentTarget).parent().attr('id');
    },
    sendFriendRequest:function(event){
        var addressee = this.getModelId(event),
            requestObj = {
                sender: null,
                type:'Friend',
                response: 'none',
                recipient: addressee
            };

        this.publish('service.notification.sendFriendRequest', requestObj);
    }
}));