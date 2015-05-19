RAD.view("view.suggestion_view", RAD.Blanks.ScrollableView.extend({
    url: 'script/views/suggestion/suggestion_view.html',
    className: 'listsView',
    onInitialize: function(){
        this.bindModel(RAD.application.data.SuggestionPosts);
    },
    onStartAttach: function(){
        RAD.application.data.PostNotification.refresh();
    },
    onEndDetach: function(){
        RAD.application.data.PostNotification.refresh();
    },
    events:{
        'tap .take' : 'takePost',
        'tap .delete' : 'deletePost'
    },
    takePost: function(event){
        var postId = this.getModelId(event),
            data = {
                postId: postId,
                SuggestionPosts: RAD.model('SuggestionPosts')
            };

        this.publish('service.post_notification.takePost', data);
    },
    deletePost: function(event){
        var postId = this.getModelId(event);
        this.publish('service.post_notification.deletePost', postId);
    },
    getModelId: function (event) {
        return $(event.currentTarget).parent().parent().attr('id');
    }
}));