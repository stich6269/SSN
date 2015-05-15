var vent = _.extend({}, Backbone.Events);

var BaseView = Backbone.View.extend({
    template: null,
    templateUrl: null,
    model: null,
    initialize:function(){
        var self = this,
            request;

        this.vent = vent;

        if(typeof self.onInitialize === 'function'){
            self.onInitialize();
        }

        if (this.templateUrl){
            request = $.get(self.templateUrl, function(data){
                self.template = _.template(data);
                self.render();
            })
        }else{
            if(typeof this.onRender === 'function'){
                this.onRender();
                return this;
            }
        }

    },
    render: function(){
        if(!this.template){
            return false;
        }

        var data = null;

        if (this.model){
            data = this.model.toJSON();
        }

        var html = this.template({model: data});
        this.$el.html(html);
        return this;
    }
});