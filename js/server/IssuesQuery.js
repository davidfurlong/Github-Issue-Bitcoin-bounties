define([
], function () {
    function ServerAPI() {
    }

    ServerAPI.prototype.getIssues = function () {
        var requestURI = this.SERVER_URI + this.ISSUES_EXT;
        return [];
    };

    ServerAPI.prototype.SERVER_URI = "https://git-spur.herokuapp.com/api/";
    ServerAPI.prototype.ISSUES_EXT = "issues/";
    
    return ServerAPI;
});