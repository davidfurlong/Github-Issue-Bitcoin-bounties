define([
    "Issue", 
    "server/ServerQuery"
], function(Issue, ServerQuery) {
    function ServerAPI() {
    }

    ServerAPI.prototype.getAllIssues = function() {
        var query = new ServerQuery();
        return this.getIssues(query);
    };

    ServerAPI.prototype.getIssues = function(query) {
        var requestURI = this.SERVER_URI;
        requestURI += this.ISSUES_EXT;
        requestURI += query.toString;

        var dummyIssue = new Issue(1, "Remake PHP", "https://david.smel.ls", "JavaScript", 100);

        return [dummyIssue];
    };

    ServerAPI.prototype.getBountiesForIssue = function (issueId) {
        var requestURI = this.SERVER_URI;
        requestURI += this.ISSUES_EXT;
        requestURI += "?issueId=" + issueId;

        return [];
    };

    ServerAPI.prototype.SERVER_URI = "https://git-spur.herokuapp.com/api/";
    ServerAPI.prototype.ISSUES_EXT = "issues/";
    ServerAPI.prototype.BOUNTIES_EXT = "bounties/";
    
    return ServerAPI;
});
