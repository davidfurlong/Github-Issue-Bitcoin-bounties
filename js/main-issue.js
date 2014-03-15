// http://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript
var getURLParameter = function(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

define(["common", 
], function(common) {

    require([
        "jquery",
        "bootstrap", 
        "tablesorter",
        "server/ServerAPI"
    ], function($, bootstrap, tablesorter, ServerAPI) {
        var issueId = getURLParameter("id");
        var serverAPI = new ServerAPI();
        
        serverAPI.getIssue(issueId, function(issue) {
            if (issue != null) {
                $("#name-text").text(issue.issueName + "@" + issue.repoName);
                $("#amount-text").text(issue.bounty);

                serverAPI.getBountiesForIssue(issue.id, function(bountyList) {
                    console.log(bountyList);
                    for (var i = 0; i < bountyList.length; i++) {
                        var bounty = bountyList[i];
                        var html = "<tr>";
                        html += "<td>" + bounty.amount + "</td>";
                        html += "<td>" + bounty.createdAt + "</td>";
                        html += "<td>" + bounty.expiresAt + "</td>";
                        html += "</tr>";
                        $('#bounty-list > tbody:last').after(html);
                    }
                });
            } else {
                alert("Issue not found");
            }
        });

    });

});