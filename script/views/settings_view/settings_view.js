RAD.view("view.settings_view", RAD.Blanks.ScrollableView.extend({
    url: 'script/views/settings_view/settings_view.html',
    onInitialize: function(){
        this.bindModel(Parse.User.current());
    },
    onStartAttach: function(){
        this.changeModel(Parse.User.current());
    },
    onNewExtras: function (extras) {
        this.bindModel(extras.model);
    },
    events:{
        'click #save': 'addUserData',
        'click #preview': 'addUserData'
    },
    addUserData: function(evt){
        var newUser = {
                name: $('#names').val(),
                surname: $('#surname').val(),
                username: $('#username').val(),
                photoUrl: $('#photo_source').val(),
                sex: $('#sex').val(),
                age: $('#age').val(),
                setupStatus: 'complete'
            },
            buttonId = $(evt.currentTarget).attr('id');

        this.publish('service.network.updateUsersInfo', {
            newUser: newUser,
            buttonId: buttonId,
            currentUser: Parse.User.current()
        });
    }
}));
