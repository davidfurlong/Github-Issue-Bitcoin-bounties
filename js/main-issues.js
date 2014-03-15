define(["common", 
], function(common) {

    require([
        "jquery",
        "bootstrap", 
        "server/ServerAPI"
    ], function($, bootstrap, ServerAPI) {
        var API = new ServerAPI();
        console.log(API.getAllIssues());
    });

});