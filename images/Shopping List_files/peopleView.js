var PeopleView = BaseView.extend({
    className: 'people_view',
    templateUrl: 'script/views/appView/content/peopleView/peopleView.html',
    onInitialize: function(){
        var self = this;
        this.model.on('add change remove', function(){
            self.render();
        }, this);
    },
    events:{
        'click .add_users' : 'sendFriendRequest'
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

        this.vent.trigger('sendFriendsNotification', requestObj);
    }
});
