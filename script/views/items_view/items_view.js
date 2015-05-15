RAD.view("view.items_view", RAD.Blanks.ScrollableView.extend({
    url: 'script/views/items_view/items_view.html',
    className: 'listsView',
    onInitialize: function(){
        this.bindModel(RAD.model('ItemsCollection'));
    },
    onStartAttach: function(){
        this.model.refresh();
    },
    onEndRender: function(){
        console.log(this.mScroll);
    },
    onEndDetach: function(){
        this.model.refresh();
    },
    events:{
        'tap .delete' : 'removeItem',
        'tap .status' : 'changeStatus',
        'tap .edit'   : 'edit',
        'tap .share'  : 'shareItem'
    },
    changeStatus:function(event){
        var modelId  = this.getModelId(event);
        this.publish('service.items.changeItemStatus', modelId);
    },
    shareItem:function(event){
        var modelId  = this.getModelId(event);
        this.publish('service.post_notification.sharePost', modelId);
    },
    removeItem: function(event){
        var modelId  = this.getModelId(event);
        this.publish('service.items.removeItem', modelId);
    },
    edit: function(event){
        var modelId  = this.getModelId(event);
        RAD.application.showView('view.edit_view', RAD.model('ItemsCollection').get(modelId))
    },
    getModelId: function (event) {
        return $(event.currentTarget).parent().parent().attr('id');
    }
}));