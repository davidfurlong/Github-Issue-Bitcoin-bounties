class ServerAPI {
    private static SERVER_URI = "https://git-spur.herokuapp.com/api/";
    private static ISSUES_EXT = "issues/";
    private static BOUNTIES_EXT = "bounties/";
    
    public static getAllIssues(): Issue[] {
        var query = new ServerQuery();
        return this.getIssues(query);
    }
    
    public static getIssues(query: ServerQuery): Issue[] {
        var requestURI = this.SERVER_URI;
        requestURI += this.ISSUES_EXT;
        requestURI += query.toString;
        
        // make AJAX request
        
        var dummyIssue = new Issue(1, "Remake PHP", "https://david.smel.ls", 100);
        
        return [dummyIssue];
    }
    
    public static getBountiesForIssue(issueId: number): Bounty[] {
        var requestURI = this.SERVER_URI;
        requestURI += this.ISSUES_EXT;
        requestURI += "?issueId=" + issueId;
        
        // make AJAX request
        
        return [];
    }
}