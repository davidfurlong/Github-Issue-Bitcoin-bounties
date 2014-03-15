define(["require", "exports", "ts/Issue", "ts/server/ServerQuery"], function(require, exports, is, sq) {
    var ServerAPI = (function () {
        function ServerAPI() {
        }
        ServerAPI.getAllIssues = function () {
            var query = new sq.ServerQuery();
            return this.getIssues(query);
        };

        ServerAPI.getIssues = function (query) {
            var requestURI = this.SERVER_URI;
            requestURI += this.ISSUES_EXT;
            requestURI += query.toString;

            var dummyIssue = new is.Issue(1, "Remake PHP", "https://david.smel.ls", 100);

            return [dummyIssue];
        };

        ServerAPI.getBountiesForIssue = function (issueId) {
            var requestURI = this.SERVER_URI;
            requestURI += this.ISSUES_EXT;
            requestURI += "?issueId=" + issueId;

            return [];
        };
        ServerAPI.SERVER_URI = "https://git-spur.herokuapp.com/api/";
        ServerAPI.ISSUES_EXT = "issues/";
        ServerAPI.BOUNTIES_EXT = "bounties/";
        return ServerAPI;
    })();
    exports.ServerAPI = ServerAPI;
});
