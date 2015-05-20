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
        'click .take' : 'takePost',
        'click .delete' : 'deletePost'
    },
    takePost: function(event){
        RAD.application.data.postId = this.getModelId(event);
        this.publish('service.post_notification.takePost', RAD.application.data);
    },
    deletePost: function(event){
        RAD.application.data.postId = this.getModelId(event);
        this.publish('service.post_notification.deletePost', RAD.application.data);
    },
    getModelId: function (event) {
        return $(event.currentTarget).parent().parent().attr('id');
    }
}));