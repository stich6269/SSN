var LoginView = BaseView.extend({
    className: 'loginView',
    templateUrl: 'script/views/loginView/loginView.html',
    events:{
        'click .submit': 'loginIn',
        'click .link': 'showRegView'
    },
    loginIn: function(){
        var self = this,
            username = $('#login').val(),
            password = $('#password').val();

        Parse.User.logIn(username, password, {
            success: function() {
                self.vent.trigger('userIsLogged')
            },
            error: function(user, error) {
                self.vent.trigger('showMessageBox', "Error: " + error.message);
            }
        });
    },
    showRegView: function(){
        this.vent.trigger('showRegView');
    }
});