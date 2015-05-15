var ListView = BaseView.extend({
    className:'listsView',
    templateUrl: 'script/views/appView/content/listsView/listsView.html',
    onInitialize: function(){
        var self = this;
        this.model.on('add change remove', function(){
            self.render();
        }, this);
    },
    events:{
        'click .delete' : 'removeItem',
        'click .status' : 'changeStatus',
        'click .edit'   : 'edit',
        'click .share'  : 'shareItem'
    },
    changeStatus:function(event){
        var modelId  = this.getModelId(event);
        this.vent.trigger('changeItemStatus', modelId);
    },
    shareItem:function(event){
        var modelId  = this.getModelId(event);
        this.vent.trigger('shareItem', modelId);
    },
    removeItem: function(event){
        var modelId  = this.getModelId(event);
        this.vent.trigger('removeItem', modelId);
    },
    edit: function(event){
        var modelId  = this.getModelId(event);
        this.vent.trigger('showEditItemView', modelId);
    },
    getModelId: function (event) {
        return $(event.currentTarget).parent().parent().attr('id');
    }
});