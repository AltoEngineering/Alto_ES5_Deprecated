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

let ArrayController = class ArrayController extends CoreObject {

    static toString() {
        return 'Alto.ArrayController'
    }

    static create(...args) {
        const instance = Object.assign(new ArrayController(), this, ...args);
        delete instance.create;
        instance.guid = generateGuid();
        instance.init();
        return instance;
    }

    static extend(...args) {
        const instance = new ArrayController();
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

    addObject (obj) {
        let array = [];
        let records = this.get('records');

        array.push(obj);
        this.set('records', records.concat(array));
    }

};

ArrayController = ArrayController.extend({

    records: null,

    nestedRecords: null,

    state: 'ready' // loading, ready, error //

});

export default ArrayController;