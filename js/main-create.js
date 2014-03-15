define(["common", 
], function(common) {
    require([
        "jquery",
        "bootstrap", 
        "server/ServerAPI"
    ], function($, bootstrap, ServerAPI) {
        $(function() {
            var serverAPI = new ServerAPI();
            $("#submitButton").click(function() {
                var githubURL = $("#url").val();
                var email = $("#email").val();
                var bounty = $("#bounty").val();
                var expirationDate = $("#expirationDate").val();

                // Validate
            });
        });
    });
});