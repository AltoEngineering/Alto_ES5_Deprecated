import CoreObject from '../foundation/core_object.js';
import State from '../statechart/state.js';
import Substate from '../statechart/substate.js';
import generateGuid from '../foundation/guid.js';
import Alto from '../../core.js';

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2017 The Code Boutique, LLC
// License:   MIT License (see license for details)
// Author: Chad Eubanks
// ==========================================================================

let Router = class Router extends CoreObject{

    static toString() {
        return 'Alto.Router'
    }

    static create(...args) {
        const instance = Object.assign(new Router(), this, ...args);
        delete instance.create;
        instance.guid = generateGuid();
        instance.init();
        return instance;
    }

    static extend(...args) {
        const instance = new Router();
        instance.create = this.create;
        return Object.assign(instance, ...args);
    }

};

Router = Router.extend({

    route: function () {
        var path = window.location.pathname;

        if (path.charAt(0) === '#') {
            path = path.slice(1, path.length)
        }

        if (path.charAt(0) === '/') {
            path = path.slice(1, path.length)
        }

        if (path.indexOf('?') > -1) {
            path = path.substr(0, path.indexOf('?'));
        }

        return path;
    },

    init: function () {
        this.connectRouteEventListeners();
    },

    connectRouteEventListeners: function() {
        window.addEventListener("popstate", this.routerDidBecomeActive, true);
    },

    routerDidBecomeActive: function() {
        if(this.checkIncomingRoutePairsWithRouteObject) {
            this.checkIncomingRoutePairsWithRouteObject();
        } else {
            Alto.applicationInstance.router.checkIncomingRoutePairsWithRouteObject();
        }
    },

    checkIncomingRoutePairsWithRouteObject: function() {
        let path = this.route().split('/'),
            routeObject,
            count = 0;

        if (this.route() === "") {
            path = ["index"]
        }

        while (count < path.length) {
            // (if) the first iteration: no route object... so lets assign one
            // (else if) continue walking the route object path
            // (else if) route not found... but we did find a potential path... lets assume it is a unique_id being passed in
            if (count === 0) {
                routeObject = this.routes[path[count]];
            } else if (routeObject[path[count]]) {
                routeObject = routeObject[path[count]];
            } else if (!this[path[count]] && !routeObject[path[count]]) {
                routeObject = routeObject['uniqueId'];
            }

            count++;
        }

        if (routeObject) {
            this.set('routeObject', routeObject);
            this.parseRouteObject(this.get('routeObject'));
        } else {
            this.malformRouteProvided(this.get('location'));
        }

    },

    malformRouteProvided: function() {
        let location = window.location.pathname;
        throw new Error(`Route ${location} not found`);
    },

    parseRouteObject: function(routeObject) {
        routeObject.datastore ? this.set('routeHasDatastore', true) : this.set('routeHasDatastore', false);
        routeObject.isInverse ? this.set('routeIsInverse', true) : this.set('routeIsInverse', false);
        routeObject.isSecure ? this.set('routeIsSecure', true) : this.set('routeIsSecure', false);
        routeObject.state ? this.set('routeIsParentState', true) : this.set('routeIsParentState', false);
        routeObject.substate ? this.set('routeIsSubstate', true) : this.set('routeIsSubstate', false);
        this.set('routeObject', routeObject);

        this.checkForSecureRoute();
    },

    checkForSecureRoute: function() {
        if (this.get('isSecure')) {
            //todo:  Handle secure route logic
        } else {
            this.checkRouteForInverse();
        }

    },

    checkRouteForInverse: function() {
        if (this.get('routeIsInverse')) {
            this.walkRouteInverse();
        } else {
            this.transitionToStateOrSubstate(this.get('routeObject'), []);
        }
    },

    walkRouteInverse: function() {
        var skipDataStore = !this.get('routeHasDatastore') ? true : false,
            routeIsInverse = this.get('routeIsInverse'),
            routeObjects = [],
            datasources = [],
            routeObjectsForInverseRoute = [], that = this, updatedRouteObject;

        if (routeIsInverse) {
            var path = this.route().split('/');

            path.forEach(function (route) {
                if (!updatedRouteObject) {
                    updatedRouteObject = that.routes[route];
                } else {
                    if (updatedRouteObject[route]) {
                        updatedRouteObject = updatedRouteObject[route]
                    } else if (updatedRouteObject.uniqueId) {
                        updatedRouteObject = updatedRouteObject.uniqueId
                    } else {
                        throw new Error('something odd was given to the route inverse');
                    }
                }

                routeObjects.push(updatedRouteObject);

            })

        }

        // great we collected ALL of the routes down to our last nested route but we might not need them all
        // lets iterate through them and start with the inner most inverse and walk up to the master.
        routeObjects.reverse().some(function (rt) {
            datasources.push(rt);
            routeObjectsForInverseRoute.splice(0, 0, rt);

            if (rt.isMaster) {
                return true
            }

            return false;
        });

        this.set('routeObjectsForInverseRoute', routeObjectsForInverseRoute);

        if (skipDataStore) {
            this.verifyStatesInverseExists(routeObjectsForInverseRoute);
        } else {
            this.verifyDatastoreInverseExists(datasources);
        }
    },

    flushCurrentRouteObjectFromRouteObjects: function(routeObjects) {
        this.verifyStatesInverseExists(routeObjects.slice(1));
    },

    // states inverse //
    verifyStatesInverseExists: function(routeObjects) {
        if (routeObjects.length > 0) {
            this.verifyStateOrSubstateExists(routeObjects[0], routeObjects);
        } else {
            // Boom! No more states needed for the incoming inversed route
        }
    },

    verifyStateOrSubstateExists: function(routeObject, routeObjects) {
        if (routeObject.state) {
            this.verifyStateIsOfTypeClass(routeObject, routeObjects);
        } else if (routeObject.substate) {
            this.verifySubstateIsOfTypeClass(routeObject, routeObjects);
        } else {
            // unknown state given in routeObject
            throw new Error(`No state associated to route ${routeObject.route} Check your applications router.`);
        }
    },

    verifyStateIsOfTypeClass: function(routeObject, routeObjects) {
        if (routeObject.state instanceof State) {
            this.transitionToStateOrSubstate(routeObject, routeObjects);
        }
    },

    verifySubstateIsOfTypeClass: function(routeObject, routeObjects) {
        if (routeObject.substate instanceof Substate) {
            this.transitionToStateOrSubstate(routeObject, routeObjects);
        }
    },

    transitionToStateOrSubstate: function(routeObject, routeObjects) {
        if (routeObject.state) {
            window.Alto.applicationInstance.statechart.goToState(routeObject.state);
        }

        if (routeObject.substate) {
            window.Alto.applicationInstance.statechart.goToSubState(routeObject.substate);
        }

        this.flushCurrentRouteObjectFromRouteObjects(routeObjects);
    },

    // datastore inverse //

    verifyDatastoreInverseExists: function(routeObjects) {
        if (routeObjects.length > 0) {
            this.fetchRelatedResources(routeObjects[0], routeObjects);
        } else {
            // Boom! No more states needed for the incoming inversed route
        }
    },

    fetchRelatedResources: function(routeObject, routeObjects) {
        var datasource = routeObject.datastore.create();

        datasource[routeObject.method]().then(function (success) {
            // that.flushCurrentRouteObjectInverse(routeObjects);
        }, function (error) {
            // that.netWorkCallDidFail(error);
        })
    },

    goToRoute: function(route) {
        if (Alto.isEqual(`/${route}`, window.location.pathname)) {return}
        window.history.pushState(null, route, route);
        this.routerDidBecomeActive();
    }

})

export default Router;