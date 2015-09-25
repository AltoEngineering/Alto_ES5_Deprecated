// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2015 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// Version:   1.2.1(pre)
// ==========================================================================

Alto.RouterDatasourceInverse = Alto.Mixin.create({

    verifyRouteObjectsForDatasourceInverseExists: function (routeObjects) {
        if (Alto.isPresent(routeObjects)) {
            this.displayLoadingPaneInverse(routeObjects.objectAt(0), routeObjects);
        } else {
            // Boom! No more datasources needed for the incoming inversed route
            window[Alto.applicationName].loadingPane.remove();
            this.verifyRouteObjectsForStatesInverseExists(this.get('routeObjectsForInverseRoute'));
        }
    },

    displayLoadingPaneInverse: function (routeObject, routeObjects) {
        if (!window[Alto.applicationName].loadingPane) {
            window[Alto.applicationName].loadingPane = window[Alto.applicationName].LoadingPane.create({
                status: routeObject.datasource.loadingMessage
            });
        } else {
            window[Alto.applicationName].loadingPane.set('status', routeObject.datasource.loadingMessage);
        }

        this.checkForRouteObjectMasterDatasource(routeObject, routeObjects);
    },

    checkForRouteObjectMasterDatasource: function (routeObject, routeObjects) {
        if (routeObject.controller) {
            this.checkControllerContentInverse(routeObject, routeObjects);
        } else if (!routeObject.controller) {
            // unknown datasource name given in routeObject
            Alto.Logger.error('A controller named', routeObject.controller, 'not found.');
        } else {
            this.checkDatasourceForNameInverse(routeObject, routeObjects);
        }
    },

    checkControllerContentInverse: function (routeObject, routeObjects) {
        // short circuit for master datasource w/ controller content and repeat cycle
        if (Alto.isPresent(window[Alto.applicationName][routeObject.controller].get('content'))) {
            var _routeObjects = routeObjects.removeAt(0);
            this.verifyRouteObjectsForDatasourceInverseExists(_routeObjects);
        } else {
            this.checkDatasourceForNameInverse(routeObject, routeObjects);
        }
    },

    checkDatasourceForNameInverse: function (routeObject, routeObjects) {
        if (routeObject.datasource.name) {
            this.verifyDatasourceClassExistsInverse(routeObject, routeObjects);
        } else {
            // unknown datasource name given in routeObject
            Alto.Logger.error('A datasource named', routeObject.datasource.name, 'not found.');
        }
    },

    verifyDatasourceClassExistsInverse: function (routeObject, routeObjects) {
        if (!window[Alto.applicationName][routeObject.datasource.name.classify()]) {
            Alto.Logger.error('DataSource', routeObject.datasource.name, 'not found.');
        } else {
            this.fetchRelatedResources(routeObject, routeObjects)
        }
    },

    fetchRelatedResources: function (routeObject, routeObjects) {
        var that = this,
            datasource = window[Alto.applicationName][routeObject.datasource.name.classify()].create();

        datasource[routeObject.datasource.method]().then(function (success) {
            that.flushCurrentRouteObjectInverse(routeObjects);
        }, function (error) {
            that.netWorkCallDidFail(error);
        })
    },

    flushCurrentRouteObjectInverse: function (routeObjects) {
        var _routeObjects = routeObjects.removeAt(0);

        this.verifyRouteObjectsForDatasourceInverseExists(_routeObjects);
    }

});