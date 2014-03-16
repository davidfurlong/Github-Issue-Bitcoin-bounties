define(["common", 
], function(common) {

    require([
        "bootstrap",
        "jquery" 
    ], function(bootstrap, $) {
        $(function() {
            var maxHeight = $("#well1").height();
            maxHeight = Math.max(maxHeight, $("#well2").height());
            console.log(maxHeight);
            $("#well1").height(maxHeight);
            $("#well2").height(maxHeight);
            console.log($("#well1").height());
        });
    });

});