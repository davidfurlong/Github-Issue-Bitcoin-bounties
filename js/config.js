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