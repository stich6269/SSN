RAD.view("view.edit_view", RAD.Blanks.ScrollableView.extend({
    url: 'script/views/edit_view/edit_view.html',
    onInitialize: function(){
        this.model = RAD.model.Item;
    },
    onNewExtras: function (extras) {
        this.bindModel(extras.model);
    },
    events:{
        'click #cancel':'closeEditView',
        'click #save':'saveEditChange'
    },
    saveEditChange: function(){
        var self = this,
            newItem = {
            title: this.$el.find('#title').val(),
            price: +this.$el.find('#price').val(),
            date: this.$el.find('#date').val(),
            photoUrl: this.$el.find('#photoUrl').val() || 'http://cs14107.vk.me/c7002/v7002030/6c04/bcWAEBRPHVw.jpg'
        };

        this.publish('service.items.editItemModel', {
            item: self.model,
            newItemData: newItem
        });
        RAD.application.showView('view.items_view')
    },
    closeEditView: function(){
        RAD.application.showView('view.items_view')
    }
}));
