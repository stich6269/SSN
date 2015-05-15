RAD.view("view.login_view", RAD.Blanks.View.extend({
    url: 'script/views/login/loqin_view.html',
    events: {
        'tap .submit': 'logIn',
        'tap .link':'goToRegView'
    },
    onInitialize: function () {
        this.model = new Backbone.Model();
    },
    onNewExtras: function (extras) {
        this.model.set(extras);
    },
    logIn: function() {
        var username = $('#login').val(),
            password = $('#password').val();


       this.publish('service.network.login', {username: username, password: password});
    },
    goToRegView: function(){
        this.publish('navigation.show', {
            container_id: '#screen',
            content: "view.reg_view",
            animation: 'slide'
        });
    }
}));