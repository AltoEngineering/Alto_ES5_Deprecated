import Alto from '../../../core.js';
import Bindings from '../../foundation/bindings.js';
import CoreObject from '../../foundation/core_object.js';
import generateGuid from '../../foundation/guid.js';

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2017 The Code Boutique, LLC
// License:   MIT License (see license for details)
// Author: Chad Eubanks
// ==========================================================================

let ObjectController = class ObjectController extends CoreObject {

    static toString() {
        return 'Alto.ObjectController'
    }

    static create(...args) {
        const instance = Object.assign(new ObjectController(), this, ...args);
        delete instance.create;
        instance.guid = generateGuid();
        instance.init();
        return instance;
    }

    static extend(...args) {
        const instance = new ObjectController();
        instance.create = this.create;
        return Object.assign(instance, ...args);
    }

    set(key, value) {
        if (Alto.isEqual(this.get(key), value)) {
            return this
        }

        this[key] = value;

        let {bindingTree} = Bindings;

        if (Alto.isPresent(bindingTree[this.guid]) && Alto.isPresent(bindingTree[this.guid][key])) {
            bindingTree[this.guid][key].connections.forEach(function (connection) {
                if (!Alto.isEqual(connection.to.get(connection.property), value)) {

                    if (connection.to[`${connection.property}WillChange`]) {
                        connection.to[`${connection.property}WillChange`]()
                    }

                    connection.to.set(connection.property, value);

                    if (connection.to[`${connection.property}DidChange`]) {
                        connection.to[`${connection.property}DidChange`]()
                    }
                }
            });
        }

        return this;
    }

};

ObjectController = ObjectController.extend({

    record: null,

    nestedRecord: null,

});

export default ObjectController;