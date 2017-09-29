import generateGuid from './guid.js';

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2017 The Code Boutique, LLC
// License:   MIT License (see license for details)
// Author: Chad Eubanks
// ==========================================================================

let CoreObject = class CoreObject {

    static toString() {
        return `Alto.CoreObject`
    }

    static create(...args) {
        const instance = Object.assign(new CoreObject(), this, ...args);
        delete instance.create;
        instance.guid = generateGuid();
        instance.init();
        return instance;
    }

    static extend(...args) {
        const instance = new CoreObject();
        instance.create = this.create;
        return Object.assign(instance, ...args);
    }

    set(key, value) {
        this[key] = value;
        return this;
    }

    get(key) {
        return this[key];
    }

    init() {}

};

export default CoreObject;
