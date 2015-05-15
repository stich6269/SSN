var MenuView = BaseView.extend({
    className: 'menuPage',
    templateUrl: 'script/views/appView/content/menuView/menuView.html',
    events: {
        'click #items': 'showItems',
        'click #add_items': 'showAddItemsForm',
        'click #people': 'showPeopleView',
        'click #settings': 'showSettingsView',
        'click #friends': 'showFriendsView',
        'click #suggestion': 'showSuggestionView',
        'click #logout': 'logOut',
        'click li': 'toggleMenu'
    },
    showAddItemsForm: function(){
        this.vent.trigger('showAddItemsView');
    },
    showItems: function(){
        this.vent.trigger('showItems');
    },
    showPeopleView: function(){
        this.vent.trigger('showUsersView');
    },
    showFriendsView: function(){
        this.vent.trigger('showFriendsView');
    },
    showSettingsView: function(){
        this.vent.trigger('showSettingsView');
    },

    showSuggestionView: function(){
        this.vent.trigger('showSuggestionView');
    },

    logOut: function(){
        this.vent.trigger('logOut');
    },
    toggleMenu: function(){
        console.log(111111111);
        this.vent.trigger('toggleMenu');
    }
});
