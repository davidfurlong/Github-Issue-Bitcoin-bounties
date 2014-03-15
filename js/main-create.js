define(["common", 
], function(common) {

    require([
        "jquery",
        "bootstrap",
        "server/ServerAPI", 
    ], function($,bootstrap,ServerAPI) {
        var timer=null;
        $('#create-issue-url').keyup(function(){
            alert('test');
            if(timer!=null)
                clearTimeout(timer);
            timer = setTimeout(function(){
                $(this).parent().addClass('has-success');
            },1000);
        });
        /*
        $('#create-bounty-button').click(function(){
            if($(this).is(':disabled'))
                alert('test');
        });
        */
    });

});