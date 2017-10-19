import Alto from '../../core.js';
import CoreObject from '../foundation/core_object.js';
import generateGuid from './guid.js';

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2017 The Code Boutique, LLC
// License:   MIT License (see license for details)
// Author: Chad Eubanks
// ==========================================================================

let Binding = class Bindings extends CoreObject {

    static toString() {
        return 'Alto.Binding'
    }

    static create(...args) {
        const instance = Object.assign(new Binding(), ...args);
        instance.guid = generateGuid();
        instance.init();
        return instance;
    }

};

Binding = Binding.create({

    bindingTree: {},

    createTwoWayBinding: function (from, property, connection) {
        let bindingTree = this.bindingTree,
            {guid} = connection.to;

        if (!bindingTree[guid]) {
            bindingTree[guid] = {}
        }

        if (!bindingTree[guid][connection.property]) {
            bindingTree[guid][connection.property] = {
                status: 'isReady',
                connections: [],
                connectionsLookup: {}
            }
        }

        if (Alto.isNone(bindingTree[guid][connection.property].connectionsLookup[from.guid])) {
            bindingTree[guid][connection.property].connectionsLookup[from.guid] = true;
            bindingTree[guid][connection.property].connections.push(this.connect(from, property));
        }

        if (Alto.isPresent(from[`${property}Binding`].property)) {

            let defaultValue = from[`${property}Binding`].to.get(from[`${property}Binding`].property);

            if (Alto.isEqual(from.value, defaultValue)) {
                return;
            }

            if (from[`${property}WillChange`]) {
                from[`${property}WillChange`]()
            }

            from.set(property, defaultValue);

            if (from[`${property}DidChange`]) {
                from[`${property}DidChange`]()
            }
        }

    },

    connect: function (to, property, isOneWay = false) {
        return {to, property, isOneWay};
    },

    replaceStringPathWithObject: function (instance, connection, key) {
        let to = instance;

        connection.to.split('.').forEach(function (key) {
            to = to[key];
        });

        instance[`${key}Binding`] = null;
        instance[`${key}Binding`] = this.connect(to, connection.property, connection.isOneWay);
    }

});

export default Binding;