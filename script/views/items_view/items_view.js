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
        'tap .option_but' : 'option'
    },
    onNewExtras: function (extras) {
        this.modelId = extras.msg;
    },
    modelId: null,
    option: function(event){
        var modelId = $(event.currentTarget).attr('id'),
            searchStr = '.option_but' + '#' + modelId,
            target = this.$( searchStr)[0];

        this.publish('navigation.popup.show', {
            content: "view.option_popup",
            target: target,
            width: 120,
            height: 117,
            gravity: 'left',
            outsideClose: true,
            extras: {
                msg: modelId
            }
        });
    }
}));