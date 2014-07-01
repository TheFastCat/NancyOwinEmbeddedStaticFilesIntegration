define(['plugins/router', 'durandal/app'], function (router, app) {
    return {
        router: router,
        search: function() {
            //It's really easy to show a message box.
            //You can add custom options too. Also, it returns a promise for the user's response.
            app.showMessage('Search not yet implemented...');
        },
        activate: function () {
            router.map([
                { route: '', title:'Durandal Info', moduleId: 'viewmodels/welcome', nav: true },
                { route: 'flickr', moduleId: 'viewmodels/flickr', nav: true },
                { route: 'Diagnostics', moduleId: 'viewmodels/diagnostics', nav: true },
                { route: 'Application Logs', moduleId: 'viewmodels/applicationlogs', nav: true },
                { route: 'Practice page', moduleId: 'viewmodels/practice', nav: true },
            ]).buildNavigationModel();
            
            return router.activate();
        }
    };
});