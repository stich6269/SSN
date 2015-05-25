RAD.view("view.items_view", RAD.Blanks.ScrollableView.extend({
    url: 'script/views/items_view/items_view.html',
    className: 'listsView',
    onInitialize: function(){
        this.bindModel(RAD.application.data.ItemsCollection);
    },
    onStartAttach: function(){
        this.model.refresh();
    },
    onEndDetach: function(){
        if (Parse.User.current()){
            this.model.refresh();
        }
    },
    events:{
        'tap .delete' : 'removeItem',
        'tap .status' : 'changeStatus',
        'tap .edit'   : 'edit',
        'tap .share'  : 'shareItem'
    },
    changeStatus:function(event){
        RAD.application.data.modelId = this.getModelId(event);
        this.publish('service.items.changeItemStatus',  RAD.application.data);
    },
    shareItem:function(event){
        RAD.application.data.modelId = this.getModelId(event);
        this.publish('service.post_notification.sharePost', RAD.application.data);
    },
    removeItem: function(event){
        RAD.application.data.modelId = this.getModelId(event);
        this.publish('service.items.removeItem', RAD.application.data);
    },
    edit: function(event){
        var modelId  = this.getModelId(event);
        RAD.application.showView('view.edit_view', RAD.application.data.ItemsCollection.get(modelId))
    },
    getModelId: function (event) {
        return $(event.currentTarget).parent().parent().attr('id');
    }
}));