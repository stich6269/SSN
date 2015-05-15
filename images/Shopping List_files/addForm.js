var AddForm = BaseView.extend({
    templateUrl : 'script/views/appView/content/addForm/addForm.html',
    className: 'addForm',
    itemsType:['Immovables', 'Transport', 'Home & Garden',
        'Electronics', 'Clothing', 'Hobby', 'Foodstuffs'],
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
                date: date.getDay() + '/' + (date.getMonth()+1) +'/'+ date.getFullYear()
            };

        this.$el.find('#title').val('');
        this.$el.find('#price').val('');
        this.vent.trigger('addItem', newItem);
    }
});