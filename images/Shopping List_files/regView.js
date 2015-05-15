var RegView = BaseView.extend({
    className: 'regView',
    templateUrl: 'script/views/regView/regView.html',
    events:{
        'click .submit': 'signUpNewUser',
        'click .link': 'showLoginView'
    },
    showLoginView: function(){
        this.vent.trigger('showLoginView');
    },
    signUpNewUser: function() {
        var regUser = new User(),
            self = this,
            newUser = {
                username: $('#login').val(),
                email: $('#email').val(),
                password: $('#password').val(),
                passwordRepeat: $('#password_repeat').val(),
                setupStatus: 'incomplete'
            };

        if (newUser.password === newUser.passwordRepeat && !!newUser.password){
            delete newUser.passwordRepeat;
            if (regUser.set(newUser, {validate: true})){
                regUser.signUp(newUser, {
                    success: function() {
                        self.vent.trigger('showLoginView');
                        self.vent.trigger('showMessageBox', 'User is created! Now, you can login');
                    },
                    error: function(user, error) {
                        self.vent.trigger('showMessageBox', "Error: " + error.message);
                    }
                });
            }
        }else{
            self.vent.trigger('showMessageBox', "Password and password repeat is not equal");
        }
    }
});