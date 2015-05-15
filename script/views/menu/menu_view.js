RAD.view("view.menu_view", RAD.Blanks.View.extend({
    url: 'script/views/menu/menu_view.html',
    className: 'menu_wrap',
    events:{
        'tap li':'showPage'
    },
    onInitialize: function(){
        this.bindModel(Parse.User.current());
    },
    onReceiveMsg: function(){
        this.changeModel(Parse.User.current());
    },
    showPage: function(event){
        var pageId = 'view.' + $(event.currentTarget).attr('id') + '_view';
        RAD.application.showView(pageId);
    }
}));