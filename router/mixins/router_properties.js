// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2015 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// Version:   1.2.1(pre)
// ==========================================================================

Alto.RouterProperties = Alto.Mixin.create({

    // the current route object
    routeObject: null,

    routeObjectsForInverseRoute: null,

    routeHasDatastore: false,

    routeIsSecure: false,

    routeIsParentState: false,

    routeIsSubstate: false,

    // computed properties
    location: Alto.computed(function () {
        var _location = parent.location.hash;

        return _location === ('#/' || '#' || '') ? '' : _location;
    }).volatile(),

    // a clean representation of the incoming route.  Removes '?', '/', and '#' from route.
    route: Alto.computed('location', function () {
        var path = this.get('location');

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
    }).volatile()

});