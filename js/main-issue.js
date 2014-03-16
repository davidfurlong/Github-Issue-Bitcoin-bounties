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
        "moment",
        "server/ServerAPI",
        "github/GitHubAPI"
    ], function($, bootstrap, tablesorter, moment, ServerAPI, GitHubAPI) {
        var issueId = getURLParameter("id");
        var serverAPI = new ServerAPI();
        var totalBounty = 0;
        serverAPI.getIssue(issueId, function(issue) {
            if (issue != null) {
                $("#name-text").text(issue.issueName + "@" + issue.repoName);
                $("#amount-text").text(issue.bounty);
                
                serverAPI.getBountiesForIssue(issue.id, function(bountyList) {
                    for (var i = 0; i < bountyList.length; i++) {
                        var bounty = bountyList[i];
                        var html = "<tr>";
                        totalBounty += parseInt(bounty.amount);
                        html += "<td>" + (bounty.amount/100000000) + "</td>";
                        html += "<td>" + moment(bounty.createdAt).format("MMM Do YYYY") + "</td>";
                        html += "<td>" + moment(bounty.expiresAt).format("MMM Do YYYY") + "</td>";
                        html += "</tr>";
                        $('#bounty-list > tbody:last').append(html);
                    }
                    $('#claim-bounty').html("Claim "+(totalBounty/100000000)+" <i class='fa fa-btc'></i> Bounty");

                });
            } else {
                $($('.outermost > .row:nth-child(2)').children()[1]).html('<div class="row"><div class="col-md-12"><div class="alert alert-danger">Issue not found</div></div></div>');
            }

            console.log(issue);

            var githubAPI = new GitHubAPI();
            var reg = /^https?\:\/\/github.com\/(((?!\/).)+)\/(((?!\/).)+)\/issues\/(\d+)($|\/.*|\s*)$/.exec(issue.uri);
            var username = reg[1];
            var issueNumber = reg[5];
            githubAPI.issueExists(username, issue.repoName, issueNumber, function(success, fullIssue) {
                if (success) {
                    $("#body").text(fullIssue.body);
                }
            });
        });
        

        $("#claim-bounty").click(function(e) {
            var bca = $('#bcaddress').val();
            e.preventDefault();
            document.location.href = serverAPI.CLAIM_URL + "/?issueId="+issueId+"&userwallet="+bca;
        });
    });

});