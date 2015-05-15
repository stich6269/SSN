var NewFriendsView = BaseView.extend({
    className:'friends_view',
    templateUrl: 'script/views/appView/content/friendsView/newFriendsView.html',
    onInitialize: function(){
        var self = this;
        this.model.on('add change remove', function(){
            self.render();
        }, this);
    },
    events:{
        'click .accept':'acceptToFriends',
        'click .reject':'rejectToFriends'
    },
    acceptToFriends: function(event) {
        var userId = this.getUserId(event);
        this.vent.trigger('acceptToFriends', userId)
    },
    rejectToFriends:function(event) {
        var userId = this.getUserId(event);
        this.vent.trigger('rejectToFriends', userId)
    },
    getUserId: function(event){
        return $(event.currentTarget).parent().parent().attr('id');
    }
});
