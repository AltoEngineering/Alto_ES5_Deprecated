import CoreObject from '../foundation/core_object.js';
import generateGuid from '../foundation/guid.js';

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2017 The Code Boutique, LLC
// License:   MIT License (see license for details)
// Author: Chad Eubanks
// ==========================================================================


let State = class State extends CoreObject {

    static toString() {
        return 'Alto.State'
    }

    static create(...args) {
        const instance = Object.assign(new State(), this, ...args);
        instance.guid = generateGuid();
        delete instance.create;
        instance.init();
        return instance;
    }

    static extend(...args) {
        const instance = new State();
        instance.create = this.create;
        return Object.assign(instance, ...args);
    }

    enterState() {
        console.log('did enter state');
    }

    exitState() {
        console.log('did exit state');
    }

};

export default State;