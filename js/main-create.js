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