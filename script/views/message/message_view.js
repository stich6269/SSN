RAD.view("view.popup", RAD.Blanks.View.extend({
    url: 'script/views/message/message_view.html',
    onInitialize: function () {
        this.model = new Backbone.Model();
    },
    events: {
        'click .error_box': 'closeDialog',
        'click #close': 'closeDialog'
    },
    attributes: {
        'data-role': 'popup-view'
    },
    onNewExtras: function (extras) {
        this.model.set({msg: extras.msg});
    },
    closeDialog: function () {
        this.publish('navigation.popup.close', {content: this.viewID });
    }
}));
