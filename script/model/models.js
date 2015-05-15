RAD.model('User', Parse.User.extend({
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

        for (var key in regExp) {
            if (regExp.hasOwnProperty(key)){
                if (!(regExp[key].test(user[key])) || !user[key]){
                    errArr.push(key + ' is not valid');
                }
            }
        }

        if (errArr.length){
            errStr = 'User is not created, because you made next errors: ' + errArr.join(', ');
            window.RAD.core.publish('service.show_error', errStr);
            return errStr;
        }

    }
}), false);

RAD.model('Item', Parse.Object.extend({
    className: 'Item',
    defaults:{
        title: null,
        price: null,
        date: null,
        status: null,
        photoUrl: null
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
            window.RAD.core.publish('service.show_error', errStr);
            return errStr
        }
    }
}), false);

RAD.model('FriendRequest', Parse.Object.extend({
    className: 'Friends',
    defaults: {
        sender: null,
        response: null,
        recipient: null
    }
}), false);

RAD.model('PostRequest', Parse.Object.extend({
    className: 'Posts',
    defaults: {
        sender: null,
        recipient: null,
        content: null
    }
}), false);


var MessageModel = Backbone.Model.extend({
    defaults: {
        message: null
    }
});