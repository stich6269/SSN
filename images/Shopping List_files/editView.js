var EditView = BaseView.extend({
    templateUrl: 'script/views/appView/content/editView/editView.html',
    className: 'editView',
    events:{
        'click #cancel':'closeEditView',
        'click #save':'saveEditChange'
    },
    saveEditChange: function(){
        var newItem = {
            title: this.$el.find('#title').val(),
            price: +this.$el.find('#price').val(),
            date: this.$el.find('#date').val()
        };

        this.vent.trigger('hideEditView', newItem);
    },
    closeEditView: function(){
        this.vent.trigger('hideEditView');
    }
});