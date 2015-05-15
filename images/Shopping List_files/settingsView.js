var SettingsView = BaseView.extend({
    className: 'settingsView',
    templateUrl: 'script/views/appView/content/settings/settingsView.html',
    onInitialize: function(){
        var self = this;
        this.model.on('add change remove', function(){
            self.render();
        }, this);
    },
    events:{
        'click #save': 'addUserData',
        'click #preview': 'addUserData'
    },
    addUserData: function(evt){
        var currentUser = Parse.User.current(),
            self = this,
            newUser = {
                name: $('#names').val(),
                surname: $('#surname').val(),
                username: $('#username').val(),
                photoUrl: $('#photo_source').val(),
                sex: $('#sex').val(),
                age: $('#age').val(),
                setupStatus: 'complete'
            },
            buttonId = $(evt.currentTarget).attr('id');

        console.log('newUser', newUser, $('#name'));
        currentUser.set(newUser, {validate: true});
        if(buttonId == 'save'){
            currentUser.save(null, {
                success: function() {
                    self.vent.trigger('userFilledProfile');
                    self.vent.trigger('showMessageBox', 'OK: Data is updated)');
                },
                error: function(user, error) {
                    self.vent.trigger('showMessageBox', 'Error: ' + error.message)
                }
            });
        }


    }
});

