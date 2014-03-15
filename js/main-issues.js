define(["common", "jquery", "server/ServerAPI"], function(common, $, ServerAPI) {
    
    var API = new ServerAPI();
    console.log(API.getAllIssues());
});