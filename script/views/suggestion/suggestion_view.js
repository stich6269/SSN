RAD.view("view.suggestion_view", RAD.Blanks.ScrollableView.extend({
    url: 'script/views/suggestion_view/suggestion_view.html',
    className: 'listsView',
    onInitialize: function(){
        this.model = window.RAD.application.data.newPostCollection;
    },
    onReceiveMsg: function(chanel, data){
        this.bindModel(data);
    },
    events:{
        'tap .delete' : 'removeItem',
        'tap .status' : 'changeStatus',
        'tap .edit'   : 'edit',
        'tap .share'  : 'shareItem'
    },
    changeStatus:function(event){
        console.log(5555);
        var modelId  = this.getModelId(event);
        this.publish('service.items.changeItemStatus', modelId);
    },
    shareItem:function(event){
        var modelId  = this.getModelId(event);
        this.publish('service.items.changeItemStatus', modelId);
    },
    removeItem: function(event){
        var modelId  = this.getModelId(event);
        this.publish('service.items.removeItem', modelId);
    },
    edit: function(event){
        var modelId  = this.getModelId(event);
        window.RAD.application.showEditView(modelId);
    },
    getModelId: function (event) {
        return $(event.currentTarget).parent().parent().attr('id');
    }
}));