require.config({
    //baseUrl : '../../../../',
	paths: {
        'jquery' : '../../../../../jquery/jquery-2.0.3',
        //'jQueryUI' : '../../../../../jquery-ui/jquery-ui',
        'bootstrap': '../../../../../Durandal_HTMLStarterKit_Diagnostics/lib/bootstrap/js/bootstrap',
        'knockout' : '../../../../../knockout/knockout-3.1.0',
    },
    shim: {
    	'jqueryUI': {
            exports: '$',
            deps: ['jquery']
        },
    	'knockout': {
            exports: 'ko'
        },
    },
});

require(['knockout', 'appViewModel'], function(ko, appViewModel) {
    ko.applyBindings(new appViewModel());
});
