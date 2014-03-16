define([

], function() {
    function GitHubAPI() {
    }
    GitHubAPI.prototype.GITHUB_URI = "https://api.github.com/";
    GitHubAPI.prototype.REPOS_EXT = "repos/";

    GitHubAPI.prototype.issueExists = function(username, repoName, issueNumber, callback) {
        var requestURI = this.GITHUB_URI;
        requestURI += this.REPOS_EXT;
        requestURI += username + "/";
        requestURI += repoName + "/";
        requestURI += "issues/"
        requestURI += issueNumber;

        $.ajax({
            url: requestURI
        })
        .done(function(result){
            callback(true);
        })
        .fail(function(jqXHR, status) {
            callback(false);
        })
    };

    return GitHubAPI;
});
