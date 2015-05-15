var FriendsView = BaseView.extend({
    className:'friends_view',
    templateUrl: 'script/views/appView/content/friendsView/friendsView.html',
    onInitialize: function(){
        var self = this;
        this.model.on('add change remove', function(){
            self.render();
        }, this);
    },
    events:{
        'click .reject':'rejectToFriends'
    },
    rejectToFriends:function(event) {
        var userId = this.getUserId(event);
        this.vent.trigger('rejectWithFriends', userId)
    },
    getUserId: function(event){
        return $(event.currentTarget).parent().parent().attr('id');
    }
});
