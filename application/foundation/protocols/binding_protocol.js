import CoreObject from '../../foundation/core_object.js';
import Alto from '../../../core.js';

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2017 The Code Boutique, LLC
// License:   MIT License (see license for details)
// Author: Chad Eubanks
// ==========================================================================

let BindingProtocol = class BindingProtocol extends CoreObject {

    static toString() {
        return 'Alto.BindingProtocol'
    }

    static create(...args) {
        const instance = Object.assign(new BindingProtocol(), ...args);
        instance.init();
        return instance;
    }

}

BindingProtocol = BindingProtocol.create({

    hasBindings: true,

    initWithBindings: function (instance) {
        let keys = Object.keys(instance), self = this;

        keys.forEach(function (key) {
            let connection = self[`${key}Binding`];

            if (connection) {
                if (Alto.isEqual(typeof connection.to, "string")) {
                    Alto.Binding.replaceStringPathWithObject(self, connection,  key);
                }
                let {isOneWay} = connection;

                if (!isOneWay) {
                    Alto.Binding.createTwoWayBinding(self, key, connection);
                }
            }
        });

        instance.init(instance);
    },

    set(key, value) {
        if (Alto.isEqual(this.get(key), value)) {
            return this
        }

        this[key] = value;

        let connection = this[`${key}Binding`];

        if (connection) {
            let {to, property, isOneWay} = connection;

            if (!isOneWay) {
                Alto.Binding.createTwoWayBinding(this, key, connection);
            }

            if (!Alto.isEqual(to.get(property), value)) {
                if (to[`${property}WillChange`]) {to[`${property}WillChange`]()};
                to.set(property, value);
                if (to[`${property}DidChange`]) {to[`${property}DidChange`]()};
            }
        }

        return this;
    }
});

export default BindingProtocol;