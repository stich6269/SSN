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
        'tap .option_but' : 'option'
    },
    getModelId: function (event) {
        return $(event.currentTarget).parent().parent().attr('id');
    },
    option: function(event){
        var modelId = $(event.currentTarget).attr('id'),
            searchStr = '.option_but' + '#' + modelId,
            target = this.$( searchStr)[0];

        this.publish('navigation.popup.show', {
            content: "view.option_suggestion_popup",
            target: target,
            width: 120,
            height: 55,
            gravity: 'left',
            outsideClose: true,
            extras: {
                msg: modelId
            }
        });
    }
}));