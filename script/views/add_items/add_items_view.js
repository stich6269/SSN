RAD.view("view.add_items_view", RAD.Blanks.ScrollableView.extend({
    url: 'script/views/add_items/add_items_view.html',
    events : {
        'click #addNewItem' : 'addNewItem',
        'change #item_pic' : 'loadImage'
    },
    parseFile: null,
    addNewItem: function() {
       var self = this,
           newItem = {
            status: 'planned',
            title: this.$('#title').val(),
            price: +this.$('#price').val()
        };


        if(this.parseFile){
            this.$('.load').toggle();
            this.parseFile.save().then(function(){
                self.$('.load').toggle();
                newItem.photo = self.parseFile;
                self.$('form')[0].reset();
                self.$('.photo').attr('src', '');
                self.parseFile = null;
            });
        }
        RAD.application.data.newItemData = newItem;
        self.publish('service.items.addItem', RAD.application.data);
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
