RAD.view("view.suggestion_view", RAD.Blanks.ScrollableView.extend({
    url: 'script/views/suggestion/suggestion_view.html',
    className: 'listsView',
    onInitialize: function(){
        this.bindModel(RAD.model('SuggestionPosts'));
    },
    onStartAttach: function(){
        RAD.model('IncomingPostNotification').refresh();
    },
    onEndDetach: function(){
        RAD.model('IncomingPostNotification').refresh();
    },
    events:{
        'tap .take' : 'takePost',
        'tap .delete' : 'deletePost'
    },
    takePost: function(event){
        var postId = this.getModelId(event);
        this.publish('service.post_notification.takePost', postId);
    },
    deletePost: function(event){
        var postId = this.getModelId(event);
        this.publish('service.post_notification.deletePost', postId);
    },
    getModelId: function (event) {
        return $(event.currentTarget).parent().parent().attr('id');
    }
}));