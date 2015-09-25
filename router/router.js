// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2015 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// Version:   1.2.1(pre)
// ==========================================================================

Alto.Router = Alto.Object.extend(Alto.RouterProperties, Alto.RouterDatasourceInverse, Alto.RouterStatesInverse, {

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
        if (Alto.isEqual(this.get('route'), '')) {
            this.pairWithApplicationIndexRoute();
        } else {
            this.checkForDefaultUnauthorizedRoute();
        }
    },

    pairWithApplicationIndexRoute: function () {
        this.set('routeObject', this.index);
        this.parseRouteObject(this.get('routeObject'));
    },

    parseRouteObject: function (routeObject) {
        routeObject.datasource ? this.set('routeHasDatasource', true) : this.set('routeHasDatasource', false);
        routeObject.isSecure ? this.set('routeIsSecure', true) : this.set('routeIsSecure', false);
        routeObject.state ? this.set('routeIsParentState', true) : this.set('routeIsParentState', false);
        routeObject.substate ? this.set('routeIsSubstate', true) : this.set('routeIsSubstate', false);

        this.checkForSecureRoute(routeObject);
    },

    checkForDefaultUnauthorizedRoute: function () {
        if (this.unauthorizedRoute.route === this.get('location')) {
            this.pairWithDefaultUnauthorizedRoute();
        } else {
            this.checkIncomingRoutePairsWithRouteObject();
        }
    },

    pairWithDefaultUnauthorizedRoute: function () {
        this.set('routeObject', this.unauthorizedRoute);
        this.parseRouteObject(this.get('routeObject'));
    },

    checkIncomingRoutePairsWithRouteObject: function () {
        var path = this.get('route').split('/'),
            routeObject,
            count = 0;

        while (count < path.length) {
            // (if) the first iteration: no route object... so lets assign one
            // (else if) continue walking the route object path
            // (else if) route not found... but we did find a potential path... lets assume it is a unique_id being passed in
            if (count === 0) {
                routeObject = this[path[count]];
            } else if (routeObject[path[count]]) {
                routeObject = routeObject[path[count]];
            } else if (!this[path[count]] && !routeObject[path[count]]) {
                routeObject = routeObject['unique_id'];
            }

            count++;
        }

        if (Alto.isPresent(routeObject)) {
            this.set('routeObject', routeObject);
            this.parseRouteObject(this.get('routeObject'));
        } else {
            this.unknownRoute(this.get('location'));
        }

    },

    checkForSecureRoute: function (routeObject) {
        if (routeObject.isSecure) {
            var cookieName = window[Alto.applicationName].get('COOKIENAME');
            this.verifyApplicationHasValidSession(Alto.Cookie.find(cookieName), routeObject);
        } else {
            this.checkRouteForDataSource(routeObject);
        }

    },

    verifyApplicationHasValidSession: function (sessionCookie, routeObject) {
        if (sessionCookie) {
            this.checkRouteForDataSource(routeObject);
        } else {
            this.replaceRouteWithUnauthorizedRoute();
        }
    },

    checkRouteForDataSource: function (routeObject) {
        if (routeObject.datasource) {
            this.checkDatasourceForInverse(routeObject);
        } else {
            this.checkForApplicationStatechartInstance(routeObject);
        }
    },

    checkDatasourceForInverse: function (routeObject) {
        if (routeObject.datasource.inverse) {
            this.walkDatasourceInverse(routeObject);
        } else {
            this.fetchResourceAssocitedToRoute(routeObject);
        }
    },

    walkDatasourceInverse: function (routeObject) {
        var datasources = [routeObject],
            routeObjectsForInverseRoute = [routeObject],
            currentRouteObject = routeObject;

        while (currentRouteObject.datasource.inverse) {
            datasources.insertAt(0, Enrollee.router[routeObject.datasource.inverse]);
            routeObjectsForInverseRoute.insertAt(0, Enrollee.router[routeObject.datasource.inverse]);
            currentRouteObject = Enrollee.router[routeObject.datasource.inverse];
        }

        this.set('routeObjectsForInverseRoute', routeObjectsForInverseRoute);
        this.verifyRouteObjectsForDatasourceInverseExists(datasources);
    },

    fetchResourceAssocitedToRoute: function (routeObject) {
        var datasource,
            that = this,
            datasource = window[Alto.applicationName][routeObject.datasource.name.classify()].create();

        // display loading pane
        if (!window[Alto.applicationName].loadingPane) {
            window[Alto.applicationName].loadingPane = window[Alto.applicationName].LoadingPane.create({status: routeObject.datasource.loadingMessage});
        } else {
            window[Alto.applicationName].loadingPane.set('status', routeObject.datasource.loadingMessage);
        }

        // check for datasource name
        if (routeObject.datasource.name) {

            if (!window[Alto.applicationName][routeObject.datasource.name.classify()]) {
                Alto.Logger.error('DataSource', routeObject.datasource.name, 'not found.');
                return;
            }

            // hit the network
            datasource[routeObject.datasource.method]().then(function (success) {
                window[Alto.applicationName].loadingPane.remove();
                that.checkForApplicationStatechartInstance(routeObject);
            }, function (error) {
                that.netWorkCallDidFail(error);
            })

        } else {
            // unknown datasource name given in routeObject
            Alto.Logger.error('A datasource named', routeObject.datasource.name, 'not found.');
        }
    },

    netWorkCallDidFail: function (error) {
        window[Alto.applicationName].loadingPane.renderError(error);
    },

    checkForApplicationStatechartInstance: function (routeObject) {
        if (!Alto.isPresent(window[Alto.applicationName].statechart)) {
            window[Alto.applicationName].statechart = Alto.Statechart.createWithMixins();
        }

        this.checkRouteForState(routeObject);
    },

    checkRouteForState: function (routeObject) {
        if (Alto.isPresent(routeObject.state)) {
            this.verifyStateClassExists(routeObject);
        } else if (Alto.isPresent(routeObject.substate)) {
            this.verifySubstateClassExists(routeObject);
        } else {
            this.malformedStateGiven(routeObject);
        }
    },

    verifyStateClassExists: function (routeObject) {
        
        if (window[Alto.applicationName][routeObject.state.classify()]) {
            this.checkForStateInstance(routeObject);
        } else {
            this.malformedStateGiven(routeObject);
        }
    },

    verifySubstateClassExists: function (routeObject) {
        if (window[Alto.applicationName][routeObject.substate.classify()]) {
            this.checkForSubstateInstance(routeObject);
        } else {
            this.malformedStateGiven(routeObject);
        }
    },

    checkForStateInstance: function (routeObject) {
        if (!window[Alto.applicationName][routeObject.state]) {
            window[Alto.applicationName][routeObject.state] = window[Alto.applicationName][routeObject.state.classify()].create();
        }

        this.transitionToStateOrSubstate(routeObject);
    },

    checkForSubstateInstance: function (routeObject) {
        if (!window[Alto.applicationName][routeObject.substate]) {
            window[Alto.applicationName][routeObject.substate] = window[Alto.applicationName][routeObject.substate.classify()].create();
        }

        this.transitionToStateOrSubstate(routeObject);
    },

    transitionToStateOrSubstate: function (routeObject) {
        var currentState = window[Alto.applicationName].statechart.get('currentState'),
            currentSubstate = window[Alto.applicationName].statechart.get('currentSubState');

        if (routeObject.state && currentState === routeObject.state) {
            // do nothing
        } else if (routeObject.state) {
            window[Alto.applicationName].statechart.goToState(routeObject.state);
            window[Alto.applicationName].statechart.set('currentSubState', '');
        }

        if (routeObject.substate && currentSubstate === routeObject.substate) {
            // do nothing
        } else if (routeObject.substate) {
            window[Alto.applicationName].statechart.goToSubState(routeObject.substate);
        }
    },

    malformedStateGiven: function (routeObject) {
        //todo missing logic
        Alto.Logger.error('State', routeObject.state, 'not found.');
    },

    replaceRouteWithUnauthorizedRoute: function () {
        this.replaceRoute(this.unauthorizedRoute.route);
        Alto.run.next(this, function () {
            location.reload();
        });
    },

    goToRoute: function (route) {
        if (this.get('location').split('/')[this.get('location').split('/').length - 1] === route.split('/')[route.split('/').length - 1]) {
            route = route.split('/').removeAt(route.split('/').length - 1).join('/')
        }
        this.pushRoute(route);
        this.checkForIndexRoute();
    },

    pushRoute: function (route) {
        history.pushState('', '', route);
    },

    replaceRoute: function (route) {
        if (this.get('location').split('/')[this.get('location').split('/').length - 1] === route.split('/')[route.split('/').length - 1]) {
            route = route.split('/').removeAt(route.split('/').length - 1).join('/')
        }
        history.replaceState('', '', route);
        this.checkForIndexRoute();
    },

    unknownRoute: function (path) {
        Alto.Logger.error('Route', path, 'not found.');
        //todo handle unknown route
    },

    hashDidChange: function () {
        window[Alto.applicationName].router.checkForIndexRoute();
    }

});