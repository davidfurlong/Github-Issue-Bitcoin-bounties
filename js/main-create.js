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
                var expirationDate = $("#expirationDate").get(0).valueAsDate;
                // Validate other fields first
                if(!$('#email').parent().hasClass('has-error') && email!=""){
                    // Validate GitHub URL
                    var issueRegex = /^https?\:\/\/github.com\/(((?!\/).)+)\/(((?!\/).)+)\/issues\/(\d+)($|\/.*|\s*)$/;
                    var result = issueRegex.exec(githubURL);
                    var githubAPI = new GitHubAPI();
                    if (typeof result != "undefined" && result != null) {
                        var username = result[1];
                        var repoName = result[3];
                        var issueNumber = parseInt(result[5]);
                        githubAPI.issueExists(username, repoName, issueNumber, function(wasValid, res) {
                            if (wasValid && res.status === "open") {
                                // SUCCESS
                                $('#submitButton').removeClass('btn-default');
                                $('#submitButton').addClass('btn-success');
                                $('#url').parent().addClass('has-success');
                                $('#submitButton').html('<i class="fa fa-refresh fa-spin"></i> Generating');
                                serverAPI.createBounty(githubURL, email, new Date(expirationDate), function(res, wasSuccessful) {
                                    if(wasSuccessful){
                                        $('#create-bounty').html('<form class="form-horizontal" role="form"><div class="form-group"><label class="col-sm-4 control-label">Bitcoin Address to send reward to</label><div class="col-sm-8"><p class="form-control-static">'+res.address+'</p></div></div></form>');
                                        $('#add-bounty-form').find('h3').text('Add Bounty (2/2)');
                                    }
                                    else {
                                        $('#create-bounty').prepend('<div class="row"><div class="col-md-12"><div class="alert alert-danger">Issue not found</div></div></div>');
                                        $('#submitButton').html('Proceed To Payment');
                                    }
                                });
                            } else if (wasValid) {
                                $('#create-bounty').prepend('<div class="row"><div class="col-md-12"><div class="alert alert-danger">Issue not open</div></div></div>');
                                $('#submitButton').html('Proceed To Payment');
                            } else {
                                // FAILURE
                                $('#url').parent().addClass('has-error');
                                $('#url').focus();
                            }
                        });
                    } else {
                        // FAILURE
                        $('#create-bounty').prepend('<div class="row"><div class="col-md-12"><div class="alert ">Invalid Issue URL</div></div></div>');
                        $('#submitButton').html('Proceed To Payment');
                    }
                }
                else {
                    $('#email').parent().addClass('has-error'); 
                    $('#email').focus();
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
            $('#email').change(function(){
                if(timer!=null)
                    clearTimeout(timer);
                if($('#email').val()!="" && ($('#email').val()).match(emailregex)){ // #TODO
                    $('#email').parent().removeClass('has-error');
                    $('#email').parent().addClass('has-success');
                }
                else {
                    $('#email').parent().removeClass('has-success');
                    $('#email').parent().addClass('has-error');
                }
            });
            var timer3=null;
            $('#expirationDate').keyup(function(){
                if(timer3!=null)
                    clearTimeout(timer3);
                timer3 = setTimeout(function(){

                    var x = $('#expirationDate').get(0).valueAsDate;

                    if((x!=null && x!=undefined) || typeof x == Date){ // #TODO
                        $('#email').parent().removeClass('has-error');
                        $('#email').parent().addClass('has-success');
                    }
                    else {
                        $('#email').parent().removeClass('has-success');
                        $('#email').parent().addClass('has-error');
                    }
                },500);
            });
            $('#expirationDate').change(function(){
                if($('#email').val()!="" && $('#email').val().match(emailregex)){ // #TODO
                    $('#email').parent().removeClass('has-error');
                    $('#email').parent().addClass('has-success');
                }
                else {
                    $('#email').parent().removeClass('has-success');
                    $('#email').parent().addClass('has-error');
                }
            });
            var timer2=null;
            $('#url').change(function(){
                if(timer2!=null)
                    clearTimeout(timer2);
                timer2 = setTimeout(function(){
                    var issueRegex = /^https?\:\/\/github.com\/(((?!\/).)+)\/(((?!\/).)+)\/issues\/(\d+)($|\/.*|\s*)$/;
                    var githubURL = $("#url").val();
                    var result = issueRegex.exec(githubURL);
                    var githubAPI = new GitHubAPI();
                    if (typeof result != "undefined" && result != null) {
                        var username = result[1];
                        var repoName = result[3];
                        var issueNumber = parseInt(result[5]);
                        githubAPI.issueExists(username, repoName, issueNumber, function(res) {
                            if (res) {
                                $('#url').parent().removeClass('has-error');
                                $('#url').parent().addClass('has-success');
                            }
                            else {
                                $('#url').parent().addClass('has-error');
                                $('#url').parent().removeClass('has-success');
                            }
                        });
                    }
                    else {
                        $('#url').parent().addClass('has-error');
                        $('#url').parent().removeClass('has-success');
                    }
                },500);
            });
        });
    });
});