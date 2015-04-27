// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

Alto.Router = Alto.Object.extend({

    /**
     Do not override this method.
     Do not call directly
     */
    init: function () {
        this._super();

        var that = this;

        if (window.addEventListener) {
            window.addEventListener("hashchange", this._hashDidChange, false);
        } else if (window.attachEvent) {
            window.attachEvent("hashchange", this._hashDidChange, false);
        }

        if (location.hash === '') {
            this._createIndexRouteObjectInstances();
        } else {
            this._createCorrespondingObjectInstancesForRouteWithHash('');
        }

    },

    _createIndexRouteObjectInstances: function () {
        var state = this.index.state ? this.index.state : false,
            dataSource = this.index.dataSource ? this.index.dataSource : false;

        window[Alto.applicationName][state] = window[Alto.applicationName][Alto.String.capitalize(state)].create();

        if (dataSource) {
            window[Alto.applicationName][dataSource] = window[Alto.applicationName][Alto.String.capitalize(dataSource)].create();
        }

        this._goToState(state);
    },

    /**
     Pairs a URL to the corresponding State.
     */
    _createCorrespondingObjectInstancesForRouteWithHash: function (e, fromHashChange) {
        var path,
            count = 0,
            propertyPath,
            routeObject;

        if (e === '') {
            path = location.hash.substr(location.hash.indexOf('#'), location.hash.length);
        } else if (location.hash == '') {
            this._createIndexRouteObjectInstances();
            return;
        } else if (e.newURL) {
            path = e.newURL.substr(e.newURL.indexOf('#'), e.newURL.length);
        }

        path = this._cleansePath(path);

        if (path.contains('?')) {
            if (path.contains('/')) {
                var cleansedPath = '#';

                path = path.split('/');
                path.pop();

                path.forEach(function(pathString) {
                    cleansedPath += '/' + pathString;
                })

                path = this._cleansePath(cleansedPath);
            } else {
                this._createIndexRouteObjectInstances();
                return;
            }
        }

        while (count < path.split('/').length) {
            // the first iteration
            if (!propertyPath) {
                propertyPath = [path.split('/')[count]]
                routeObject = this[propertyPath];
            }
            // route not found... lets assume it is a unique_id being passed in
            else if (!this[path.split('/')[count]] && !routeObject[path.split('/')[count]]) {
                routeObject = routeObject['unique_id'];
            } else {
                routeObject = routeObject[path.split('/')[count]];
            }

            count++
        }

        if (!routeObject) {
            this._unknownRoute(path);
            return;
        }

        var state = routeObject.state ? routeObject.state : false,
            dataSource = routeObject.dataSource ? routeObject.dataSource : false;

        if (!window[Alto.applicationName][Alto.String.capitalize(state)]) {
            Alto.Logger.error('State:', '`' + Alto.String.capitalize(state) + '`', 'not found.  Check route definition.');
            return
        }

        if (!window[Alto.applicationName][state]) {

            window[Alto.applicationName][state] = window[Alto.applicationName][Alto.String.capitalize(state)].create();
        }

        if (dataSource) {
            window[Alto.applicationName][dataSource] = window[Alto.applicationName][Alto.String.capitalize(dataSource)].create();
        }

        this._goToState(state, fromHashChange);

    },

    /**
     When a hash change occurs, invoke _findMatchingingResources();
     */
    _hashDidChange: function (e) {
        window[Alto.applicationName].router._createCorrespondingObjectInstancesForRouteWithHash(e, true);
    },

    _goToState: function (state, fromHashChange) {
        // If we don't already have one.  Create an instance of our applications statehcart
        if (!window[Alto.applicationName].statechart) {
            window[Alto.applicationName].statechart = Alto.Statechart.create();
        }

        // Do nothing if the passed in state is the same as the current state
        // Occurs if two route objects are associated to the same state object
        if (window[Alto.applicationName].statechart.get("currentState") == state && !fromHashChange) {
            return;
        } else if (window[Alto.applicationName].statechart.get("currentState") == state && fromHashChange) {
            if (window[Alto.applicationName].LogStateTransitions) {
                var message = "ReEntering " + window[Alto.applicationName].statechart.get("currentState");
                Alto.Console.log(message, Alto.Console.warnColor);
            }
            window[Alto.applicationName][state].enterState();
            return;
        }

        // If we are already in a state, call is exitState before transitioning
        if (window[Alto.applicationName].statechart.get("currentState") != "") {

            if (window[Alto.applicationName].LogStateTransitions) {
                var message = "Exiting " + window[Alto.applicationName].statechart.get("currentState");
                Alto.Console.log(message, Alto.Console.warnColor);
            }

            window[Alto.applicationName][window[Alto.applicationName].statechart.get("currentState")].exitState();
        }

        if (!window[Alto.applicationName][state]) {
            window[Alto.applicationName][state] = window[Alto.applicationName][Alto.String.capitalize(state)].create();
        }

        window[Alto.applicationName].statechart.set("currentState", state);

        if (window[Alto.applicationName].LogStateTransitions) {
            var message = "Entering " + window[Alto.applicationName].statechart.get("currentState");
            Alto.Console.log(message, Alto.Console.messageColor);
        }
        window[Alto.applicationName][state].enterState();

    },

    _cleansePath: function (path) {
        if (!path) {
            return
        }
        path = path.charAt(0) === '#' ? path.slice(1, path.length) : path;
        path = path.charAt(0) === '/' ? path.slice(1, path.length) : path;

        return path;
    },

    _unknownRoute: function (routePath) {
        Alto.Logger.error('Route', routePath, 'not found.');
    },

    goToRoute: function (route) {
        var router = window[Alto.applicationName].router,
            count = 0,
            propertyPath,
            routeObject,
            cleansedRoute = this._cleansePath(route);

        while (count < cleansedRoute.split('/').length) {

            // the first iteration
            if (!propertyPath) {
                propertyPath = [cleansedRoute.split('/')[count]]
                routeObject = this[propertyPath];
            }
            // route not found... lets assume it is a unique_id being passed in
            else if (!this[cleansedRoute.split('/')[count]] && !routeObject[cleansedRoute.split('/')[count]]) {
                routeObject = routeObject['unique_id'];
            } else {
                routeObject = routeObject[cleansedRoute.split('/')[count]];
            }

            count++
        }

        if (!routeObject) {
            this._unknownRoute(cleansedRoute);
            return;
        }

        this.pushRoute(route);

        this._goToState(routeObject.state);
    },

    pushRoute: function (route) {
        history.pushState('', '', route);
    },

    replaceRoute: function (route) {
        history.replaceState('', '', route);
    },

    getCurrentRoute: function () {
        return window.location.hash;
    },

    getCurrentRouteLastId: function () {
        var route = this.getCurrentRoute(),
            routeSplit = route.split('/'),
            routeLength = routeSplit.length,
            lastRoutePath = routeSplit[routeLength - 1];

        return lastRoutePath
    }

});