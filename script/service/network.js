RAD.service("service.network", RAD.Blanks.Service.extend({
    onReceiveMsg: function(channel, data) {
        var parts = channel.split("."),
            func = parts[2];
        if (_.isFunction(this[func])) {
            this[func](data);
        }
    },
    registration: function(newUser){
        var regUser = new RAD.models.User(),
            self = this;

        if (newUser.password === newUser.passwordRepeat && !!newUser.password){
            delete newUser.passwordRepeat;

            if (regUser.set(newUser, {validate: true})){
                regUser.signUp(newUser, {
                    success: function() {
                        self.publish('navigation.show', {
                            content: "view.login_view",
                            container_id: '#screen',
                            animation: 'slide-out',
                            extras:{
                                login: newUser.username,
                                password: newUser.password
                            }
                        });
                    },
                    error: function(user, error) {
                        self.publish('service.show_error', "Error: " + error.message);
                    }
                });
            }
        }else{
            this.publish('service.show_error', "Password and password repeat is not equal");
        }
    },
    login: function(user){
        var self = this;

        Parse.User.logIn(user.username, user.password, {
            success: function() {
                RAD.application.checkUser();
            },
            error: function(user, error) {
                self.publish('service.show_error', "Error: " + error.message)
            }
        });
    },
    updateUsersInfo: function(data){
        var self = this;

        data.currentUser.set(data.newUser, {validate: true});
        if(data.buttonId == 'save'){
            data.currentUser.save(null, {
                success: function() {
                    self.publish('service.show_error', 'OK: Your profile is updated! )');
                    RAD.application.userFilledProfile();
                },
                error: function(user, error) {
                    self.publish('service.show_error', 'Error: ' + error.message)
                }
            });
        }
    },
    getUsersData: function(data){
        var promArr = [],
            self = this,
            updColl = [
                'ItemsCollection',
                'UsersCollection',
                'PostNotification',
                'FriendNotification'
            ];

        for (var i = 0; i < updColl.length; i++) {
            promArr.push(data[updColl[i]].refresh());
        }

        console.log('data start');
        data.FriendsCollection.refresh().then(function(friends){
            data.FriendsCollection.reset(friends);
            Parse.Promise.when(promArr).then(function(){
                self.publish('service.post_notification.getSuggestionPosts', data);
                self.publish('service.friend_notification.markPeopleWithNotification', data);
                self.publish('service.friend_notification.getIncomingFriendNotification', data);
                self.publish('service.friend_notification.getConfirmedFriend', data);
                RAD.application.loadSpin.stop();
                console.log('data end');
            })
        });
    }
}));