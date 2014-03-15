var ServerAPI = (function () {
    function ServerAPI() {
    }
    ServerAPI.getIssues = function () {
        var requestURI = this.SERVER_URI + this.ISSUES_EXT;

        return [];
    };
    ServerAPI.SERVER_URI = "https://git-spur.herokuapp.com/api/";
    ServerAPI.ISSUES_EXT = "issues/";
    return ServerAPI;
})();
