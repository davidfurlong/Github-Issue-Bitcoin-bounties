define(["common", 
], function(common) {

    require([
        "jquery",
        "bootstrap", 
        "tablesorter",
        "server/ServerAPI"
    ], function($, bootstrap, tablesorter, ServerAPI) {
        $("#bounty-list").tablesorter({ 
            // define a custom text extraction function 
            textExtraction: function(node) { 
                // extract data from markup and return it
                console.log(x=node) 
                if(node.childNodes.length==2)
                    return node.childNodes[0].innerHTML;
                return node.innerHTML; 
            } 
        });

        var serverAPI = new ServerAPI();
        var issueList = serverAPI.getAllIssues();

        for (var i = 0; i < issueList.length; i++) {
            var issue = issueList[i];
            var html = "<tr>";
            html += "<td>" + issue.bounty + "</td>";
            html += "<td>" + issue.name + "</td>";
            //html += "<td>" + "$" + issue.bounty * 100 + "</td>";
            html += "<td>" + issue.language + "</td>";
            html += "</tr>";
            $('#issue-list > tbody:last').after(html);
        }
    });

});