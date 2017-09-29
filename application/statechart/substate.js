import CoreObject from '../foundation/core_object.js';
import generateGuid from '../foundation/guid.js';

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2017 The Code Boutique, LLC
// License:   MIT License (see license for details)
// Author: Chad Eubanks
// ==========================================================================

let Substate = class Substate extends CoreObject {

    static toString() {
        return 'Alto.Substate'
    }

    static create(...args) {
        const instance = Object.assign(new Substate(), this, ...args);
        instance.guid = generateGuid();
        delete instance.create;
        instance.init();
        return instance;
    }

    static extend(...args) {
        const instance = new Substate();
        instance.create = this.create;
        return Object.assign(instance, ...args);
    }

    enterState() {
        console.log('did enter substate');
    }

    exitState() {
        console.log('did exit substate');
    }

};

export default Substate;