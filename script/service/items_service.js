RAD.service("service.show_error", RAD.Blanks.Service.extend({
    onReceiveMsg: function (channel, message) {
        this.publish('navigation.toast.show', {
            content: "view.popup",
            showTime: 2000,
            extras: {
                msg: message
            }
        });
    }
}));

RAD.service("service.items",  RAD.Blanks.Service.extend({
    onReceiveMsg: function(channel, data) {
        var parts = channel.split("."),
            func = parts[2];
        if (_.isFunction(this[func])) {
            this[func](data);
        }
    },
    addItem: function(data) {
        var newItemModel,
            self = this;

        data.newItemData.user = Parse.User.current();
        newItemModel = new RAD.models.Item();
        if (newItemModel.set(data.newItemData)) {
            newItemModel.save(null, {
                success: function () {
                    data.ItemsCollection.add(newItemModel);
                    self.publish('service.show_error', 'Item is added to your list');
                },
                error: function (error) {
                    self.publish('service.show_error', 'Error: ' + error.message)
                }
            });
        }
    },
    removeItem: function(data){
        var itemModel = data.ItemsCollection.get(data.modelId),
            currentNotification,
            promArr = [];

        for (var i = 0; i < data.PostNotification.length; i++) {
            currentNotification = data.PostNotification.at(i).get('content');
            if(data.modelId == currentNotification.id){
                promArr.push(data.PostNotification.at(i).destroy());
                data.PostNotification.remove(currentNotification);
            }
        }
        Parse.Promise.when(promArr).then(function() {
            data.ItemsCollection.remove(itemModel);
            itemModel.destroy();
        });


    },
    editItemModel: function(data){
        var itemModel = data.item,
            self = this;

        if (!!itemModel){
            itemModel.save(data.newItemData, {
                success: function () {
                    self.publish('service.show_error', 'Ok: data is updated')
                },
                error: function (error) {
                    self.publish('service.show_error', 'Error: ' + error.message)
                }
            });
        }
    },
    changeItemStatus:function(data){
        var itemModel = data.ItemsCollection.get(data.modelId);

        if (itemModel.get('status') == 'planned'){
            itemModel.save({status: 'bought'});
        }else{
            itemModel.save({status: 'planned'});
        }
    }
}));





