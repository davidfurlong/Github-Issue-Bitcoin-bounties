define(["common", 
], function(common) {

    require([
        "jquery",
        "bootstrap", 
        "tablesorter",
        "server/ServerAPI"
    ], function($, bootstrap, tablesorter, ServerAPI) {
        
        $("#issue-list").tablesorter({ 
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

        serverAPI.getAllIssues(function(issueList) {
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

        $('#searchIssues').keyup(function(){
            searchIssues($('#searchIssues').val());
        });

        function searchIssues(query){
            // show all issues
            var x = $('#issue-list > tbody').children();

            for(var i=0;i<x.length;i++){
                $(x[i]).removeClass('hidden');
            }

            var hashtagregex = /#[A-Za-z0-9]+/g;
            var atregex = /@[A-Za-z0-9]+/g;
            var mh = query.match(hashtagregex);
            var ma = query.match(atregex);
            // remove common words
            var terms = query.trim().toLowerCase().replace(/\b(?:(the)|(it)|(is)|(we)|(all)|(a)|(an)|(by)|(to)|(you)|(me)|(he)|(she)|(they)|(we)|(how)|(it)|(i)|(are)|(to)|(for)|(of)|(with))\b/ig, '').replace(',',' ').replace('.',' ');
            terms = terms.split(' ');

            //TODO hide certain issues
            var isMatch = false;
            for(var i=0;i<x.length;i++){
                isMatch = false;
                var t = $(x[i].children[0]).text() + " " + $(x[i].children[1]).text()+ " "+$(x[i].children[2]).text();
                t = t.toLowerCase();
                var l = $(x[i].children[2]).text();
                l = l.toLowerCase();

                /* Unnecessary
                if(ma!=null){ // found @ symbol
                    for(var k=0;k<ma.length;k++){
                        var temp = ma[k];
                        if(temp.length>1 && l.indexOf(temp.substr(1,temp.length-1))>=0){
                            isMatch = true;
                        }
                    }
                }
                */

                for(var j=0;j<terms.length;j++){
                    if(t.indexOf(terms[j])>=0)
                        isMatch = true;
                }
                if(!isMatch)
                    $(x[i]).addClass('hidden');
            }   
        }
    });
});