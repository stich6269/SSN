RAD.view("view.parent_view", RAD.Blanks.View.extend({
    url: 'script/views/parent_view/parent_view.html',
    children: [
        {
            container_id: '.status_bar',
            content: "view.statusbar_view"
        },
        {
            container_id: '.menu',
            content: "view.menu_view"
        },
        {
            container_id: '.content',
            content: "view.items_view"
        }
    ],
    onEndAttach: function(){
       RAD.application.checkUserProfile();
    },
    events:{
        'click .menu_icon': 'toggleMenu',
        'click .menu': 'toggleMenu',
        'click .upd_icon': 'updateData'
    },
    toggleMenu: function(){
        this.publish('view.menu_view', 'update');
        this.$('.menu').toggle();
    },
    updateData: function(){
        RAD.application.loadSpin.start();
        this.publish('service.network.getUsersData', RAD.application.data);
    }
}));