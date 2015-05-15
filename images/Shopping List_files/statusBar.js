var StatusBar = BaseView.extend({
    className: 'status_bar',
    templateUrl: 'script/views/appView/statusBar/statusBar.html',
    events: {
        'click .menu_icon': 'toggleMenu'
    },
    toggleMenu: function () {
        this.vent.trigger('toggleMenu');
    }
});
