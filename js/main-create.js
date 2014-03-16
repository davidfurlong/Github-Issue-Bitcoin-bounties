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

                // Validate other fields first

                // Validate GitHub URL
                var issueRegex = /^https?\:\/\/github.com\/(((?!\/).)+)\/(((?!\/).)+)\/issues\/(\d+)($|\/.*|\s*)$/;
                var result = issueRegex.exec(githubURL);
                var githubAPI = new GitHubAPI();
                if (typeof result != "undefined" && result != null) {
                    var username = result[1];
                    var repoName = result[3];
                    var issueNumber = parseInt(result[5]);
                    githubAPI.issueExists(username, repoName, issueNumber, function(res) {
                        if (res) {
                            // SUCCESS
                            $('#submitButton').removeClass('btn-default');
                            $('#submitButton').addClass('btn-success');
                            $('#url').parent().addClass('has-success');
                            $('#submitButton').html('<i class="fa fa-refresh fa-spin"></i> Generating');
                            serverAPI.createBounty(githubURL, email, 20, new Date(Date.now()), function(res,wasSuccessful) {
                                alert(res);
                                $('#create-bounty').html('<form class="form-horizontal" role="form"><div class="form-group"><label class="col-sm-4 control-label">Bitcoin Address to send Reward to</label><div class="col-sm-8"><p class="form-control-static">'+res.address+'</p></div></div></form>');
                                $('#add-bounty-form').find('h3').text('Add Bounty (2/2)');
                            });
                        } else {
                            // FAILURE
                            $('#url').parent().addClass('has-error');
                            $('#url').focus();
                        }
                    });
                } else {
                    // FAILURE
                    $('#url').parent().addClass('has-error');
                    $('#url').focus();
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
            var timer=null;
            var emailregex = /[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]+/g;
            $('#email').keyup(function(){
                if(timer!=null)
                    clearTimeout(timer);
                timer = setTimeout(function(){
                    if($('#email').val()!="" && $('#email').val().match(emailregex)){ // #TODO
                        $('#email').parent().removeClass('has-error');
                        $('#email').parent().addClass('has-success');
                    }
                    else {
                        $('#email').parent().removeClass('has-success');
                        $('#email').parent().addClass('has-error');
                    }
                },500);
            });
        });
    });
});