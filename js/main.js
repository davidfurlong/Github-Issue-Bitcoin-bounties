// http://requirejs.org/docs/api.html#config
require.config({
    baseUrl: 'js',

    paths: {
        jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min',
    },

    shim: {
        'jquery': {
            exports: ['$', 'jQuery']
        },
    }
});

// load AMD module main.ts (compiled to main.js)
// and include shim: $

define(["jquery", "server/ServerAPI"], function($, ServerAPI) {
    var API = new ServerAPI();
    console.log(API.getAllIssues());
});