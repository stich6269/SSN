RAD.view('view.reg_view', RAD.Blanks.View.extend({
    url: 'script/views/registration/reg_view.html',
    events:{
        'tap .submit': 'signUpNewUser',
        'tap .link': 'showLoginView'
    },
    showLoginView: function(){
        this.publish('navigation.show', {
            container_id: '#screen',
            content: "view.login_view",
            animation: 'slide-out'
        });
    },
    signUpNewUser: function() {
        var newUser = {
                username: $('#login').val(),
                email: $('#email').val(),
                password: $('#password').val(),
                passwordRepeat: $('#password_repeat').val(),
                setupStatus: 'incomplete'
            };

        this.publish("service.network.registration", newUser);
    }
}));