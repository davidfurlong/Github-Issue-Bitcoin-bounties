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

        $.ajax({
            url: requestURI
        })
        .done(function(result){
            var issueList = [];
            var data = result.data;
            for (var i = 0; i < data.length; i++) {
                var datum = data[i];
                console.log(datum);
                var id = datum.id;
                var issueName = datum.issueName;
                var repoName = datum.repo;
                var uri = datum.uri;
                var language = datum.language;
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
            callback([]);
        });
    };

    ServerAPI.prototype.getIssue = function(id, callback) {
        var requestURI = this.SERVER_URI;
        requestURI += this.ISSUES_EXT;
        requestURI += id + "/";

        $.ajax({
            url: requestURI
        })
        .done(function(result){
            console.log()
            var datum = result.data;
            console.log(datum);
            var id = datum.id;
            var issueName = datum.issueName;
            var repoName = datum.repo;
            var uri = datum.uri;
            var language = datum.language;
            var bounty = datum.bounty;
            var expiresAt = datum.expiresAt;
            var issue = new Issue(id, issueName, repoName, uri, language, bounty, expiresAt);
            console.log(issue);
            callback(issue);
        })
        .fail(function(jqXHR, status) {
            console.error(status);
            callback(null);
        })
    };

    ServerAPI.prototype.getBountiesForIssue = function(issueId, callback) {
        var requestURI = this.SERVER_URI;
        requestURI += this.ISSUES_EXT;
        requestURI += issueId;
        requestURI += "/bounties/"

        $.ajax({
            url: requestURI
        })
        .done(function(result, status, jqXHR){
            var bountyList = [];
            var data = result.data;
            for (var i = 0; i < data.length; i++) {
                var datum = data[i];
                console.log(datum);
                var id = datum.id;
                var issueId = datum.IssueId;
                var expiresAt = datum.expiresAt;
                var amount = parseInt(datum.amount);
                var email = datum.email;
                var createdAt = datum.createdAt;
                var updatedAt = datum.updatedAt;
                var bounty = new Bounty(id, issueId, createdAt, updatedAt, expiresAt, amount, email, true);
                bountyList.push(bounty);
                console.log(bounty);
            }

            callback(bountyList);
        })
        .fail(function(jqXHR, status) {
            console.error(status);
            callback([]);
        });
    };

    ServerAPI.prototype.createBounty = function(issueURL, email, amount, expiresDate, callback) {
        var data = {};
        data.issueUri = issueURL;
        data.amount = amount;
        data.email = email;
        data.expiresAt = expiresDate.toISOString();

        var postURL = this.SERVER_URI;
        postURL += this.BOUNTIES_EXT;
        console.log(data);
        $.ajax({
            url: postURL,
            data: data,
            type: "POST",
        })
        .done(function(result, status, jqXHR){
            console.log(result);
            callback(result,true);
        })
        .fail(function(jqXHR, status) {
            console.log("FAIL");
            console.log(jqXHR);
            console.log(status);
            callback(null,false);
        });
    };

    return ServerAPI;
});
