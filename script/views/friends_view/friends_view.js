RAD.view("view.friends_view", RAD.Blanks.ScrollableView.extend({
    url: 'script/views/friends_view/friends_view.html',
    children: [
        {
            container_id: '.new_friends_view',
            content: "view.new_friends_view"
        },
        {
            container_id: '.my_friends_view',
            content: "view.my_friends_view"
        }
    ]
}));

