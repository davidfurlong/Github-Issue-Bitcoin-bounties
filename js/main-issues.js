define(["common", 
], function(common) {

    require([
        "jquery",
        "bootstrap", 
        "tablesorter",
        "server/ServerAPI"
    ], function($, bootstrap, tablesorter, ServerAPI) {
        console.log("Loaded");

        var serverAPI = new ServerAPI();
        var issueList = serverAPI.getAllIssues();

        for (var i = 0; i < issueList.length; i++) {
            var issue = issueList[i];
            var html = "<tr>";
            html += "<td>" + issue.name + "</td>";
            html += "<td>" + issue.uri + "</td>";
            html += "<td>" + "$" + issue.bounty * 100 + "</td>";
            html += "<td>" + issue.bounty + "</td>";
            html += "</tr>";
            $('#issue-list > tbody:last').after(html);
            console.log(issue);
        }
    });

});