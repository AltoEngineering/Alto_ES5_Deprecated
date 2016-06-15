// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2015 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// Version:   1.2.1(pre)
// ==========================================================================

Alto.Router = Alto.Object.extend(Alto.RouterProperties, Alto.RouterDatasourceInverse, Alto.RouterStatesInverse, {

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
        routeObject.datastore ? this.set('routeHasDatastore', true) : this.set('routeHasDatastore', false);
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
            this.checkRouteForDataStore(routeObject);
        }

    },

    verifyApplicationHasValidSession: function (sessionCookie, routeObject) {
        if (sessionCookie) {
            this.checkRouteForDataStore(routeObject);
        } else {
            this.replaceRouteWithUnauthorizedRoute();
        }
    },

    checkRouteForDataStore: function (routeObject) {
        if (routeObject.datastore) {
            this.checkDataStoreForInverse(routeObject);
        } else if (routeObject.inverse) {
            this.walkDataStoreInverse(routeObject, true);
        } else {
            this.checkForApplicationStatechartInstance(routeObject);
        }
    },

    checkDataStoreForInverse: function (routeObject) {
        if (routeObject.inverse) {
            this.walkDataStoreInverse(routeObject);
        } else {
            this.fetchResourceAssociatedToRoute(routeObject);
        }
    },

    walkDataStoreInverse: function (routeObject, skipDataStore) {
        var routeObjects = [],
            datasources = [],
            routeObjectsForInverseRoute = [], that = this, updatedRouteObject, routeObjectsReversed;

        if (routeObject.inverse) {
            var path = this.get('route').split('/');

            path.forEach(function (route) {
                if (Alto.isNone(updatedRouteObject)) {
                    // this should be the role part of our routes hash
                    updatedRouteObject = that[route];
                } else {
                    if (updatedRouteObject[route]) {
                        updatedRouteObject = updatedRouteObject[route]
                    } else if (updatedRouteObject.unique_id) {
                        updatedRouteObject = updatedRouteObject.unique_id
                    } else {
                        Alto.warn('something odd was given to the route inverse');
                    }
                }

                routeObjects.insertAt(0, updatedRouteObject);

            })

        }

        // great we collected ALL of the routes down to our last nested route but we might not need them all
        // lets iterate through them and start with the inner most inverse and walk up to the master.

        routeObjects.some(function (rt) {
            datasources.insertAt(0, rt);
            routeObjectsForInverseRoute.insertAt(0, rt);

            if (rt.isMaster) {return true}
        });

        this.set('routeObjectsForInverseRoute', routeObjectsForInverseRoute);

        if (skipDataStore) {
            this.verifyRouteObjectsForStatesInverseExists(this.get('routeObjectsForInverseRoute'));
        } else {
            this.verifyRouteObjectsForDatastoreInverseExists(datasources);
        }
    },

    fetchResourceAssociatedToRoute: function (routeObject) {
        var datastore = routeObject.datastore.create(),
            that = this;
        if (!LW.loadingPane) {
            LW.loadingPane = LW.LoadingPane.create({
                instanceName: 'LW.loadingPane',
            });
        }

        // check for datasource name
        if (routeObject.method) {

            //todo: refactor

            if (Alto.isPresent(datastore.get('url'))) {
                var url = datastore.get('url');
            } else {
                console.log('missing url from datastore')
            }

            // hit the network
            datastore[routeObject.method](url).then(function (success) {
                if (LW.loadingPane) {
                    LW.loadingPane.remove();
                }
                that.checkForApplicationStatechartInstance(routeObject);
            }, function (error) {
                that.netWorkCallDidFail(error);
            })

        } else {
            // unknown datasource name given in routeObject
            Alto.Logger.error('A datastore method was not provided.');
        }
    },

    netWorkCallDidFail: function (error) {
        if(window[Alto.applicationName].loadingPane){
            window[Alto.applicationName].loadingPane.renderError(error);
        }
    },

    checkForApplicationStatechartInstance: function (routeObject) {
        if (!Alto.isPresent(window[Alto.applicationName].statechart)) {
            window[Alto.applicationName].statechart = Alto.Statechart.createWithMixins();
        }

        this.checkRouteForStateOrSubstate(routeObject);
    },

    checkRouteForStateOrSubstate: function (routeObject) {
        if (Alto.isPresent(routeObject.state)) {
            this.verifyStateClassExists(routeObject);
        } else if (Alto.isPresent(routeObject.substate)) {
            this.verifySubstateClassExists(routeObject);
        } else {
            this.malformedStateGiven(routeObject);
        }
    },

    verifyStateClassExists: function (routeObject) {

        if (window[Alto.applicationName][Alto.String.classify(routeObject.state)]) {
            this.checkForStateInstance(routeObject);
        } else {
            this.malformedStateGiven(routeObject);
        }
    },

    verifySubstateClassExists: function (routeObject) {
        if (window[Alto.applicationName][Alto.String.classify(routeObject.substate)]) {
            this.checkForSubstateInstance(routeObject);
        } else {
            this.malformedStateGiven(routeObject);
        }
    },

    checkForStateInstance: function (routeObject) {
        if (!window[Alto.applicationName][routeObject.state]) {
            window[Alto.applicationName][routeObject.state] = window[Alto.applicationName][Alto.String.classify(routeObject.state)].create();
        }

        this.transitionToStateOrSubstate(routeObject);
    },

    checkForSubstateInstance: function (routeObject) {
        if (!window[Alto.applicationName][routeObject.substate]) {
            window[Alto.applicationName][routeObject.substate] = window[Alto.applicationName][Alto.String.classify(routeObject.substate)].create();
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
            parent.location.reload();
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
        parent.history.pushState('', '', route);
    },

    replaceRoute: function (route) {
        if (this.get('location').split('/')[this.get('location').split('/').length - 1] === route.split('/')[route.split('/').length - 1]) {
            route = route.split('/').removeAt(route.split('/').length - 1).join('/')
        }
        parent.history.replaceState('', '', route);
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