define([

], function() {
    function Issue(id, issueName, repoName, uri, language, bounty, expiresAt) {
        this.id = id;
        this.issueName = issueName;
        this.repoName = repoName;
        this.uri = uri;
        this.language = language;
        this.bounty = bounty;
        this.expiresAt = expiresAt;
    }
    return Issue;
});
