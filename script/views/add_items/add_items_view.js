RAD.view("view.add_items_view", RAD.Blanks.ScrollableView.extend({
    url: 'script/views/add_items/add_items_view.html',
    events : {
        'click #addNewItem' : 'addNewItem',
        'change #item_pic' : 'loadImage'
    },
    addNewItem: function() {
        var date = new Date(),
            newItem = {
                status: 'planned',
                title: this.$el.find('#title').val(),
                price: +this.$el.find('#price').val(),
                date: date.getDay() + '/' + (date.getMonth()+1) +'/'+ date.getFullYear(),
                photoUrl: this.$el.find('#photoUrl').val()
            };


        this.$el.find('form')[0].reset();
        RAD.application.data.newItemData = newItem;
        this.publish('service.items.addItem', RAD.application.data);
    },
    loadImage: function(evt) {
        var file = evt.target.files;
        console.log(file);

        $('#name').html(file[0].name);
        $('#size').html((file[0].size/1000000).toFixed(3) + ' mb');
        $('#types').html(file[0].type);


        //todo

 /*       if (!file.type.match('image.*')) {
            continue;
        }


        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                // Render thumbnail.
                var span = document.createElement('span');
                span.innerHTML = ['<img class="thumb" src="', e.target.result,
                    '" title="', escape(theFile.name), '"/>'].join('');
                document.getElementById('list').insertBefore(span, null);
            };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);

    }*/
    }
}));
