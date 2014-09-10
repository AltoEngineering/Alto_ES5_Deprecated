// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Author: Chad Eubanks
// Copyright: @2014 The Code Boutique, LLC
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

Alto.Application = Alto.Object.extend ({

    init: function () {
        this._super();
        Alto.applicationName = this.NAMESPACE;
        this.applicationWillLoad();
    },

    applicationWillLoad: function () {},

    applicationDidLoad: function () {}

});