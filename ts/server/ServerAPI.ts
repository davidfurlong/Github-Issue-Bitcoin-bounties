import is = require("ts/Issue");
import bo = require("ts/Bounty");
import sq = require("ts/server/ServerQuery");


export class ServerAPI {
    private static SERVER_URI = "https://git-spur.herokuapp.com/api/";
    private static ISSUES_EXT = "issues/";
    private static BOUNTIES_EXT = "bounties/";
    
    public static getAllIssues(): is.Issue[] {
        var query = new sq.ServerQuery();
        return this.getIssues(query);
    }
    
    public static getIssues(query: sq.ServerQuery): is.Issue[] {
        var requestURI = this.SERVER_URI;
        requestURI += this.ISSUES_EXT;
        requestURI += query.toString;
        
        // make AJAX request
        
        var dummyIssue = new is.Issue(1, "Remake PHP", "https://david.smel.ls", 100);
        
        return [dummyIssue];
    }
    
    public static getBountiesForIssue(issueId: number): bo.Bounty[] {
        var requestURI = this.SERVER_URI;
        requestURI += this.ISSUES_EXT;
        requestURI += "?issueId=" + issueId;
        
        // make AJAX request
        
        return [];
    }
}