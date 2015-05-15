var ErrView = BaseView.extend({
    templateUrl: 'script/views/errView/errView.html',
    className: 'error_box',
    events:{
        'click #close':'closeErrBox'
    },
    closeErrBox:function(){
        this.vent.trigger('hideMessageBox');
    }

});