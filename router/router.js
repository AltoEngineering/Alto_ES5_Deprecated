// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2015 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// Version:   1.2(pre)
// ==========================================================================

Alto.RouterProperties = Alto.Mixin.create({

    applicationRoute: null,

    // computed properties
    location: function () {
        var _location = location.hash;

        return _location === ('#/' || '#' || '') ? '' : _location;
    }.property().volatile(),

    applicationRoutePropertyPath: function () {
        var path = this.get('location');

        if (path.charAt(0) === '#') {
            path = path.slice(1, path.length)
        }

        if (path.charAt(0) === '/') {
            path = path.slice(1, path.length)
        }

        if (path.contains('?')) {
            path = path.substr(0, path.indexOf('?'));
        }

        return path;
    }.property('location').volatile()
});

Alto.Router = Alto.Object.extend(Alto.RouterProperties, {

    init: function () {
        if (window.addEventListener) {
            window.addEventListener("hashchange", this.hashDidChange, false);
        } else if (window.attachEvent) {
            window.attachEvent("hashchange", this.hashDidChange, false);
        }
    },

    routerDidBecomeActive: function () {
        this.checkForIndexRoute();
    },

    checkForIndexRoute: function () {
        if (Alto.isEqual(this.get('applicationRoutePropertyPath'), '')) {
            this.pairWithApplicationIndexRoute();
        } else {
            this.pairWithApplicationHashRoute();
        }
    },

    pairWithApplicationIndexRoute: function () {
        this.set('applicationRoute', this.index);
        this.checkForSecureRoute(this.index);
    },

    pairWithApplicationHashRoute: function () {
        var path = this.get('applicationRoutePropertyPath').split('/'),
            propertyPath,
            routeObject,
            count = 0;

        while (count < path.length) {
            //todo refactor: logic block start
            // the first iteration
            if (!propertyPath) {
                propertyPath = [path[count]]
                routeObject = this[propertyPath];
            }
            // route not found... lets assume it is a unique_id being passed in
            else if (!this[path[count]] && !routeObject[path[count]]) {
                routeObject = routeObject['unique_id'];
            } else {
                routeObject = routeObject[path[count]];
            }
            //todo refactor: logic block end

            //todo refactor: logic block start
            if (!routeObject && this.unauthorizedRoute.route === this.get('location')) {
                this.set('applicationRoute', this.unauthorizedRoute);
                this.checkForSecureRoute(this.unauthorizedRoute);
            } else if (!routeObject) {
                this.unknownRoute(this.get('location'));
            } else {
                this.set('applicationRoute', routeObject);
                this.checkForSecureRoute(routeObject);
            }
            //todo refactor: logic block end
            count++
        }

    },

    checkForSecureRoute: function (routeObject) {
        if (routeObject.hasOwnProperty('isSecure') && routeObject.isSecure) {
            var cookieName = window[Alto.applicationName].get('COOKIENAME');
            this.verifyApplicationHasValidSession(Alto.Cookie.find(cookieName), routeObject);
        } else {
            this.checkRouteForDataSource(routeObject);
        }
    },

    checkRouteForDataSource: function (routeObject) {
        if (routeObject.hasOwnProperty('datasource')) {
            this.checkControllerContentAssociatedToRoute(routeObject);
        } else {
            this.checkRouteForState(routeObject);
        }
    },

    checkRouteForState: function (routeObject) {
        if (Alto.isPresent(routeObject.state)) {
            this.verifyStateClassExists(routeObject);
        } else {
            this.malformedStateGiven(routeObject);
        }

    },

    verifyStateClassExists: function (routeObject) {
        if (window[Alto.applicationName][routeObject.state.classify()]) {
            this.checkForCurrentState();
        } else {
            this.malformedStateGiven(routeObject);
        }
    },

    checkForCurrentState: function () {
        if (!Alto.isPresent(window[Alto.applicationName].statechart)) {
            window[Alto.applicationName].statechart = Alto.Statechart.createWithMixins();
        }

        if (Alto.isPresent(window[Alto.applicationName].statechart.get('currentState'))) {
            this.exitCurrentState();
        } else {
            this.enterStateAssociatedToRoute(this.get('applicationRoute'));
        }
    },

    exitCurrentState: function () {
        if (window[Alto.applicationName].LogStateTransitions) {
            var message = "Exiting " + window[Alto.applicationName].statechart.get("currentState");
            Alto.Console.log(message, Alto.Console.warnColor);
        }
        window[Alto.applicationName][window[Alto.applicationName].statechart.get('currentState')].exitState();
        Alto.Object.destroyInstance(Alto.applicationName + '.' + [window[Alto.applicationName].statechart.get('currentState')]);
        this.enterStateAssociatedToRoute(this.get('applicationRoute'));
    },

    enterStateAssociatedToRoute: function (routeObject) {
        window[Alto.applicationName][routeObject.state] = window[Alto.applicationName][routeObject.state.classify()].create();
        window[Alto.applicationName].statechart.set('currentState', routeObject.state);
        if (window[Alto.applicationName].LogStateTransitions) {
            var message = "Entering " + window[Alto.applicationName].statechart.get("currentState");
            Alto.Console.log(message, Alto.Console.messageColor);
        }
        window[Alto.applicationName][routeObject.state].enterState();
    },

    malformedStateGiven: function (routeObject) {
        //todo missing logic
    },

    checkControllerContentAssociatedToRoute: function (routeObject) {
        if (Alto.isPresent(routeObject.datasource.controller)) {

            if (!window[Alto.applicationName][routeObject.datasource.controller]) {
                Alto.Logger.error('Controller', routeObject.datasource.controller, 'not found.');
                return;
            }

            // check if the controller has content else fetch content
            if (Alto.isPresent(window[Alto.applicationName][routeObject.datasource.controller].get('content'))) {
                this.checkRouteForState(routeObject);
            } else {
                this.fetchResourceAssocitedToRoute(routeObject);
            }

        } else {
            //todo missing logic
        }
    },

    fetchResourceAssocitedToRoute: function (routeObject) {
        var datasource,
            that = this;

        if (routeObject.datasource.name) {

            if (!window[Alto.applicationName][routeObject.datasource.name.classify()]) {
                Alto.Logger.error('DataSource', routeObject.datasource.name, 'not found.');
                return;
            }

            datasource = window[Alto.applicationName][routeObject.datasource.name.classify()].create();

            datasource[routeObject.datasource.method]().then(function (success) {
                that.checkRouteForState(routeObject);
            }, function (error) {
                this.netWorkCallDidFail(error);
            })

        } else {
            //todo missing logic
        }
    },

    netWorkCallDidFail: function (error) {
        //todo missing logic
    },

    verifyApplicationHasValidSession: function (applicationSessionCookie, routeObject) {
        if (applicationSessionCookie) {
            this.checkRouteForDataSource(routeObject);
        } else {
            this.replaceRouteWithUnauthorizedRoute();
        }
    },

    replaceRouteWithUnauthorizedRoute: function () {
        this.replaceRoute(this.unauthorizedRoute.route);
        Alto.run.next(this, function () {
            location.reload();
        });
    },

    goToRoute: function(route) {
        this.pushRoute(route);
        this.checkForIndexRoute();
    },

    pushRoute: function (route) {
        history.pushState('', '', route);
    },

    replaceRoute: function (route) {
        history.replaceState('', '', route);
    },

    unknownRoute: function (path) {
        Alto.Logger.error('Route', path, 'not found.');
        //todo handle unknown route
    },

    hashDidChange: function () {
        window[Alto.applicationName].router.checkForIndexRoute();
    }

});