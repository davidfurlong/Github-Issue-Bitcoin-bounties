define([
    "Issue", 
    "Bounty",
    "server/ServerQuery"
], function(Issue, Bounty, ServerQuery) {
    function ServerAPI() {
    }
    ServerAPI.prototype.SERVER_URI = "https://git-spur.herokuapp.com/api/";
    ServerAPI.prototype.ISSUES_EXT = "issue/";
    ServerAPI.prototype.ISSUES_EXT = "issues/";
    ServerAPI.prototype.BOUNTIES_EXT = "bounties/";

    ServerAPI.prototype.getAllIssues = function(callback) {
        var query = new ServerQuery();
        this.getIssues(query, callback);
    };

    ServerAPI.prototype.getIssues = function(query, callback) {
        var requestURI = this.SERVER_URI;
        requestURI += this.ISSUES_EXT;
        requestURI += query.toString();

        var dummyIssue = new Issue(1, "Remake PHP", "https://david.smel.ls", "JavaScript", 100);
        $.ajax({
            url: requestURI
        })
        .done(function(result){
            var issueList = [];
            console.log(result);
            var data = result.data;
            for (var i = 0; i < data.length; i++) {
                var datum = data[i];
                var id = datum.id;
                var issueName = datum.issueName;
                var repoName = datum.repoName;
                var uri = datum.uri;
                var language = datum.langage;
                var bounty = datum.bounty;
                var expiresAt = datum.expiresAt;
                var issue = new Issue(id, issueName, repoName, uri, language, bounty, expiresAt);
                issueList.push(issue);
                console.log(issue);
            }

            callback(issueList);
        })
        .fail(function(jqXHR, status) {
            console.error(status);
            return [];
        })
    };

    ServerAPI.prototype.getIssue = function(id, callback) {
        if (id != 1)
            callback(null);

        var requestURI = this.SERVER_URI;
        requestURI += this.ISSUE_EXT;
        requestURI += id;

        // TODO: AJAX

        var dummyIssue = new Issue(1, "Remake PHP", "PHP", "https://david.smel.ls", "JavaScript", 100, Date.now());

        console.log(dummyIssue);
        callback(dummyIssue);      
    };

    ServerAPI.prototype.getBountiesForIssue = function(issueId, callback) {
        if (issueId != 1)
            callback([]);

        var requestURI = this.SERVER_URI;
        requestURI += this.ISSUES_EXT;
        requestURI += "?issueId=" + issueId;

        // TODO: AJAX

        var dummyBounties = [];
        dummyBounties.push(new Bounty(1, 1, Date.now(), Date.now(), Date.now(), 1, "greg@gmail.com"));
        dummyBounties.push(new Bounty(2, 1, Date.now(), Date.now(), Date.now(), 3, "ed@gmail.com")); 

        callback(dummyBounties);
    };

    
    return ServerAPI;
});
