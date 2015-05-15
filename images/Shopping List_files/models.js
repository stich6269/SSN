var ItemModel = Parse.Object.extend({
    className: 'Item',
    defaults:{
        title: null,
        price: null,
        date: null,
        status: null
    },
    validate: function(attr){
        var newModel = attr,
            errArr = [],
            errStr = '';

        for (var key in newModel) {
            if (newModel.hasOwnProperty(key)){
                if (!newModel[key]){
                    errArr.push(key);
                }
            }
        }

        if(errArr.length){
            errStr = 'New item is not created: ' + errArr.join(', ') + ' is not valid.';
            vent.trigger('showMessageBox', errStr);
            return errStr
        }
    }
});
var ItemCollection = Parse.Collection.extend({
    model: ItemModel
});


var User = Parse.User.extend({
    defaults:{
        username: null,
        password: null,
        email: null,
        name: 'unknow',
        surname: 'unknow',
        photoUrl:'unknow',
        sex: 'unknow',
        age: '18'
    },
    validate:function(user){
        var errArr = [],
            errStr = '',
            regExp = {
                username: /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/,
                password: /^[a-zA-Z0-9]+$/,
                email: /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/
            };

        if (user.setupStatus == 'complete'){
            delete regExp.password;
            regExp.name = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
            regExp.surname = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
            regExp.sex = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
        }

        console.log(user);
        for (var key in regExp) {
            if (regExp.hasOwnProperty(key)){
                if (!(regExp[key].test(user[key])) || !user[key]){
                    console.log(regExp[key], user[key], key);
                    errArr.push(key + ' is not valid');
                }
            }
        }

        if (errArr.length){
            errStr = 'User is not created, because you made next errors: ' + errArr.join(', ');
            vent.trigger('showMessageBox', errStr);
            return errStr;
        }

    }
});
var UsersCollection = Parse.Collection.extend({
    model: User
});



var FriendRequest = Parse.Object.extend({
    className: 'Friends',
    defaults: {
        sender: null,
        response: null,
        recipient: null
    }
});
var FriendsNotificationCollection = Parse.Collection.extend({
    model: FriendRequest
});



var PostRequest = Parse.Object.extend({
    className: 'Posts',
    defaults: {
        sender: null,
        recipient: null,
        content: null
    }
});
var PostNotificationCollection = Parse.Collection.extend({
    model:  PostRequest
});



var MessageModel = Backbone.Model.extend({
    defaults: {
        message: null
    }
});