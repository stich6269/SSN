RAD.view("view.option_popup", RAD.Blanks.ScrollableView.extend({
    url: 'script/views/items_view/option_popup/option_popup.html',
    events:{
        'tap #status' : 'statusItem',
        'tap #edit'   : 'editItem',
        'tap #share'  : 'shareItem',
        'tap #delete'  : 'deleteItem',
        'tap li': 'closePopup'
    },
    className: 'option',
    attributes: {
        'data-role': 'popup-view'
    },
    onNewExtras: function (extras) {
        this.modelId = extras.msg;
    },
    modelId: null,
    statusItem: function(){
        RAD.application.data.modelId = this.modelId ;
        this.publish('service.items.changeItemStatus',  RAD.application.data);
    },
    editItem: function(){
        RAD.application.showView('view.edit_view', RAD.application.data.ItemsCollection.get(this.modelId))
    },
    shareItem: function(){
        RAD.application.data.modelId = this.modelId;
        this.publish('service.post_notification.sharePost', RAD.application.data);
    },
    deleteItem: function(){
        RAD.application.data.modelId = this.modelId;
        this.publish('service.items.removeItem', RAD.application.data);
    },
    closePopup: function(){
        this.publish('navigation.popup.close', {content: this.viewID });
    }
}));
