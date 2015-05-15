RAD.view("view.add_items_view", RAD.Blanks.ScrollableView.extend({
    url: 'script/views/add_items/add_items_view.html',
    events : {
        'click #addNewItem' : 'addNewItem'
    },
    addNewItem: function() {
        var date = new Date(),
            newItem = {
                status: 'planned',
                title: this.$el.find('#title').val(),
                price: +this.$el.find('#price').val(),
                type: this.$el.find('#type').val(),
                date: date.getDay() + '/' + (date.getMonth()+1) +'/'+ date.getFullYear(),
                photoUrl: this.$el.find('#photoUrl').val()
            };

        this.$el.find('form')[0].reset();
        this.publish('service.items.addItem', newItem);
    }
}));
