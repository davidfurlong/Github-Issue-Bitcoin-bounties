define(["common", 
], function(common) {
    require([
        "jquery",
        "bootstrap", 
        "server/ServerAPI",
        "github/GitHubAPI",
    ], function($, bootstrap, ServerAPI, GitHubAPI) {
        $(function() {
            $('#url').focus();
            var serverAPI = new ServerAPI();
            $("#submitButton").click(function(e) {
                e.preventDefault();
                var githubURL = $("#url").val();
                var email = $("#email").val();
                var bounty = $("#bounty").val();
                var expirationDate = $("#expirationDate").val();

                // Validate
                var issueRegex = /^https?\:\/\/github.com\/(((?!\/).)+)\/(((?!\/).)+)\/issues\/(\d+)($|\/.*|\s*)$/;
                var result = issueRegex.exec(githubURL);
                var api = new GitHubAPI();
                if (typeof result != "undefined" && result != null) {
                    var username = result[1];
                    var repoName = result[3];
                    var issueNumber = parseInt(result[5]);
                    api.issueExists(username, repoName, issueNumber, function(res) {
                        if (res) {
                            $('#submitButton').removeClass('btn-default');
                            $('#submitButton').addClass('btn-success');
                            $('#url').parent().addClass('has-success');
                            $('#submitButton').html('<i class="fa fa-refresh fa-spin"></i> Generating');
                        } else {
                            $('#url').parent().addClass('has-error');
                        }
                    });
                } else {
                    console.warn("failed");
                }
            });
            /*
            var timer=null;
            $('#url').keyup(function(){
                if(timer!=null)
                    clearTimeout(timer);
                timer = setTimeout(function(){
                    if(true){ // #TODO
                        $('#url').parent().addClass('has-success');
                    }
                    else {
                        $('#url').parent().addClass('has-error');
                    }
                },500);
            });
            */
            
            $('#bounty').keyup(function(){
                if($('#bounty').val().match(/^-?\d*(\.\d+)?$/) && $('#bounty').val()!=""){ // #TODO
                    $('#bounty').parent().removeClass('has-error');
                    $('#bounty').parent().addClass('has-success');
                }
                else {
                    $('#bounty').parent().removeClass('has-success');
                    $('#bounty').parent().addClass('has-error');
                }
            });
        });
    });
});