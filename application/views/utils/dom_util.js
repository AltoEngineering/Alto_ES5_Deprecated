import CoreObject from '../../foundation/core_object.js';

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2017 The Code Boutique, LLC
// License:   MIT License (see license for details)
// Author: Chad Eubanks
// ==========================================================================

let DomUtil = class DomUtil extends CoreObject {

    static toString() {
        return 'Alto.DomUtil'
    }

    static create(...args) {
        const instance = Object.assign(new DomUtil(), ...args);
        instance.init();
        return instance;
    }

};

DomUtil = DomUtil.create({

    removeAllChildren: function (element) {
        if (!element.firstChild) return;
        while (element.firstChild) element.removeChild(element.firstChild);
    }

});

export default DomUtil;