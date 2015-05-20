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
        RAD.application.data.requestObj = {
            sender: null,
            response: 'none',
            recipient: this.getModelId(event)
        };
        this.publish('service.notification.sendFriendRequest', RAD.application.data);
    }
}));