// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2015 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// Version:   1.2.1(pre)
// ==========================================================================

Alto.RouterStatesInverse = Alto.Mixin.create({

    verifyRouteObjectsForStatesInverseExists: function (routeObjects) {
        if (Alto.isPresent(routeObjects)) {
            this.checkForApplicationStatechartInstanceInverse(routeObjects.objectAt(0), routeObjects);
        } else {
            // Boom! No more states needed for the incoming inversed route
        }
    },

    checkForApplicationStatechartInstanceInverse: function (routeObject, routeObjects) {
        if (!Alto.isPresent(window[Alto.applicationName].statechart)) {
            window[Alto.applicationName].statechart = Alto.Statechart.createWithMixins();
        }

        this.verifyStateIsPresentInverse(routeObject, routeObjects);
    },

    verifyStateIsPresentInverse: function (routeObject, routeObjects) {
        if (routeObject.state) {
            this.verifyStateClassExistsInverse(routeObject, routeObjects);
        } else if (routeObject.substate) {
            this.verifySubstateClassExistsInverse(routeObject, routeObjects);
        } else {
            // unknown datasource name given in routeObject
            Alto.Logger.error('No state associated to route ', routeObject.route, ' Check your applications router.');
        }
    },

    verifyStateClassExistsInverse: function (routeObject, routeObjects) {
        if (!window[Alto.applicationName][routeObject.state.classify()]) {
            Alto.Logger.error('State', routeObject.state.classify(), 'not found.');
        } else {
            this.checkForStateInstanceInverse(routeObject, routeObjects)
        }
    },

    verifySubstateClassExistsInverse: function (routeObject, routeObjects) {
        if (!window[Alto.applicationName][routeObject.substate.classify()]) {
            Alto.Logger.error('Substate', routeObject.substate.classify(), 'not found.');
        } else {
            this.checkForSubstateInstanceInverse(routeObject, routeObjects)
        }
    },

    checkForStateInstanceInverse: function (routeObject, routeObjects) {
        if (!window[Alto.applicationName][routeObject.state]) {
            window[Alto.applicationName][routeObject.state] = window[Alto.applicationName][routeObject.state.classify()].create();
        }

        this.transitionToStateOrSubstateInverse(routeObject, routeObjects);
    },

    checkForSubstateInstanceInverse: function (routeObject, routeObjects) {
        if (!window[Alto.applicationName][routeObject.substate]) {
            window[Alto.applicationName][routeObject.substate] = window[Alto.applicationName][routeObject.substate.classify()].create();
        }

        this.transitionToStateOrSubstateInverse(routeObject, routeObjects);
    },

    transitionToStateOrSubstateInverse: function (routeObject, routeObjects) {
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

        this.flushCurrentRouteObjectStateInverse(routeObjects);
    },

    flushCurrentRouteObjectStateInverse: function (routeObjects) {
        var _routeObjects = routeObjects.removeAt(0);

        this.verifyRouteObjectsForStatesInverseExists(_routeObjects);
    }


});