(function (document, window) {
    'use strict';
    Parse.initialize("pukUnPDScNQT17FUeRKSOTORttWTKyuaAXAeqfWJ", "byqAhnQpojl1BhEREz7a2YbS1V67K6zs3AKK51QJ");
    var scripts = [
        "script/model/models.js",
        "script/model/collections.js",
        "libs/iscroll-lite.js",
        "script/service/items_service.js",
        "script/service/network_service.js",
        "script/service/post_notification_service.js",
        "script/service/friend_notification_service.js",

        "script/views/message/message_view.js",
        "script/views/login/login_view.js",
        "script/views/registration/reg_view.js",

        "script/views/menu/menu_view.js",
        "script/views/suggestion/suggestion_view.js",

        "script/views/items_view/items_view.js",
        "script/views/people/people_view.js",
        "script/views/add_items/add_items_view.js",
        "script/views/settings_view/settings_view.js",
        "script/views/friends_view/new_friends/new_friends_view.js",
        "script/views/friends_view/my_friends/my_friends_view.js",
        "script/views/friends_view/friends_view.js",
        "script/views/edit_view/edit_view.js",
        "script/views/statusbar/statusbar_view.js",

        "script/views/parent_view/parent_view.js",
        "script/application/applications.js"
    ];

    function onEndLoad() {

        var core = window.RAD.core,
            application = window.RAD.application;

        core.initialize(application);
        application.start();
    }

    window.RAD.scriptLoader.loadScripts(scripts, onEndLoad);
}(document, window));