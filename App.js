Ext.application({
    requires: ["Labirynt.view.Home"],
    views: [
        "Home"
    ],
    name: "Labirynt",
    init: function () {

        Ext.widget("home");
    }
});