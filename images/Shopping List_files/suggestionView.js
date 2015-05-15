var SuggestView = BaseView.extend({
    className:'listsView',
    templateUrl: 'script/views/appView/content/suggestionView/suggestionView.html',
    onInitialize: function(){
        var self = this;
        this.model.on('add change remove', function(){
            self.render();
        }, this);
    },
    events:{
        'click .take' : '',
        'click .delete' : ''
    },
    getModelId: function (event) {
        return $(event.currentTarget).parent().parent().attr('id');
    }
});