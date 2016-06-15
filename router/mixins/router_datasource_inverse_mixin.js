// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2015 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// Version:   1.2.1(pre)
// ==========================================================================

Alto.RouterDatasourceInverse = Alto.Mixin.create({

    verifyRouteObjectsForDatastoreInverseExists: function (routeObjects) {
        if (Alto.isPresent(routeObjects)) {
            this.displayLoadingPaneInverse(routeObjects.objectAt(0), routeObjects);
        } else {
            // Boom! No more datasources needed for the incoming inversed route
            if(LW.loadingPane){
                LW.loadingPane.remove();
            }
            this.verifyRouteObjectsForStatesInverseExists(this.get('routeObjectsForInverseRoute'));
        }
    },

    displayLoadingPaneInverse: function (routeObject, routeObjects) {
        if (!LW.loadingPane) {
            LW.loadingPane = LW.LoadingPane.create({
                instanceName: 'LW.loadingPane'
            });
        }

        this.checkForRouteObjectMasterDatastore(routeObject, routeObjects);
    },

    checkForRouteObjectMasterDatastore: function (routeObject, routeObjects) {
        if (routeObject.datastore) {
            this.checkControllerContentInverse(routeObject, routeObjects);
        } else if (!routeObject.datastore) {
            Alto.Logger.error('Route datastore inverse is missing a datastore.');
        } else {
            this.checkDatastoreForNameInverse(routeObject, routeObjects);
        }
    },

    checkControllerContentInverse: function (routeObject, routeObjects) {
        //todo need to check for an array or not, isPresent thinks {} is true;  Yet, [] is false;
        if (Alto.isPresent(routeObject.controller.get('content')) && !routeObject.isLocalQuery) {
            var _routeObjects = routeObjects.removeAt(0);
            this.verifyRouteObjectsForDatastoreInverseExists(_routeObjects);
        } else {
            this.checkDatastoreForNameInverse(routeObject, routeObjects);
        }
    },

    checkDatastoreForNameInverse: function (routeObject, routeObjects) {
        if (routeObject.datastore) {
            this.verifyDatasourceClassExistsInverse(routeObject, routeObjects);
        } else {
            // unknown datasource name given in routeObject
            Alto.Logger.error('A datasource named', routeObject.datastore, 'not found.');
        }
    },

    verifyDatasourceClassExistsInverse: function (routeObject, routeObjects) {
        if (!routeObject.datastore) {
            Alto.Logger.error('DataSource on route object %@', routeObject, 'not found.');
        } else {
            this.fetchRelatedResources(routeObject, routeObjects)
        }
    },

    fetchRelatedResources: function (routeObject, routeObjects) {
        var that = this,
            datasource = routeObject.datastore.createWithMixins();

        datasource[routeObject.method]().then(function (success) {
            that.flushCurrentRouteObjectInverse(routeObjects);
        }, function (error) {
            that.netWorkCallDidFail(error);
        })
    },

    flushCurrentRouteObjectInverse: function (routeObjects) {
        var _routeObjects = routeObjects.removeAt(0);

        this.verifyRouteObjectsForDatastoreInverseExists(_routeObjects);
    }

});