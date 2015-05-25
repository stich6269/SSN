RAD.view("view.option_suggestion_popup", RAD.Blanks.ScrollableView.extend({
    url: 'script/views/suggestion/option_popup/option_suggestion_popup.html',
    events:{
        'tap #take' : 'takeItem',
        'tap #delete'   : 'deleteItem',
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
    takeItem: function(){
        RAD.application.data.modelId = this.modelId;
        this.publish('service.post_notification.takePost', RAD.application.data);
    },
    deleteItem: function(){
        RAD.application.data.modelId = this.modelId;
        this.publish('service.post_notification.deletePost', RAD.application.data);
    },
    closePopup: function(){
        this.publish('navigation.popup.close', {content: this.viewID });
    }
}));
