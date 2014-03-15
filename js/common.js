// http://requirejs.org/docs/api.html#config
require.config({
    baseUrl: 'js',

    paths: {
        jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min',
        moment: "lib/moment-with-langs",
        bootstrap: 'http://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min',
        tablesorter: "lib/jquery.tablesorter.min"
    },

    shim: {
        'jquery': {
            exports: ['$', 'jQuery']
        },

        'bootstrap': {
            deps: ["jquery"],
        },

        "tablesorter": {
            deps: ["jquery"],
        }
    }
});

define([
    "jquery"
], function($) {
    $(document).ready(function(){
        $('#add-bounty').click(function(){
            document.location.href = "create.html";
        }); 
    })
});
