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
       RAD.application.isFullUserProfile();
    },
    events:{
        'tap .menu_icon': 'toggleMenu',
        'tap .menu': 'toggleMenu'
    },
    toggleMenu: function(){
        this.publish('view.menu_view', 'update');
        this.$('.menu').toggle();
    }
}));