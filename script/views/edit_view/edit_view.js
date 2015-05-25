RAD.view("view.edit_view", RAD.Blanks.ScrollableView.extend({
    url: 'script/views/edit_view/edit_view.html',
    onInitialize: function(){
        this.model = RAD.model.Item;
    },
    onNewExtras: function (extras) {
        this.bindModel(extras.model);
    },
    parseFile: null,
    events:{
        'click #cancel':'closeEditView',
        'click #save':'saveEditChange',
        'change #item_pic' : 'loadImage'
    },
    saveEditChange: function(){
        var self = this,
            newItem = {
            title: this.$('#title').val(),
            price: +this.$('#price').val()
        };

        RAD.application.data.newItemData = newItem;
        if(this.parseFile){
            this.$('.load').toggle();
            this.parseFile.save().then(function(){
                self.$('.load').toggle();
                newItem.photo = self.parseFile;
                self.$('form')[0].reset();
                self.$('.photo').attr('src', '');
                self.publish('service.items.editItemModel', {
                    item: self.model,
                    newItemData: newItem
                });
                RAD.application.showView('view.items_view')
                self.parseFile = null;
            });
        }
    },
    closeEditView: function(){
        RAD.application.showView('view.items_view')
    },
    loadImage: function(evt) {
        var file = evt.target.files[0],
            self = this;


        var reader = new FileReader();
        reader.onload = (function(theFile) {
            return function(e) {
                self.parseFile =  new Parse.File('photo.jpg', file);
                self.$('.photo').attr('src', e.target.result);
            };
        })(file);
        reader.readAsDataURL(file);
    }
}));
