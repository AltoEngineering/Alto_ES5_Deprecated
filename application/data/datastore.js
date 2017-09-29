import CoreObject from '../foundation/core_object.js';
import generateGuid from '../foundation/guid.js';

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2017 The Code Boutique, LLC
// License:   MIT License (see license for details)
// Author: Chad Eubanks
// ==========================================================================

let Datastore = class Datastore extends CoreObject{

    static toString() {
        return 'Alto.Datastore'
    }

    static create(...args) {
        const instance = Object.assign(new Datastore(), this, ...args);
        delete instance.create;
        instance.guid = generateGuid();
        instance.init();
        return instance;
    }

    static extend(...args) {
        const instance = new Datastore();
        instance.create = this.create;
        return Object.assign(instance, ...args);
    }

};

Datastore = Datastore.extend({

    objectController: null,

    arrayController: null,

    model: null,

    datasource: null,

    commitRecord: function (url, data) {

    },

    commitRecords: function (url, dataArray) {

    },

    saveRecord: function (url, data) {},

    saveRecords: function (url, dataArray) {},

    updateRecord: function (url, data) {},

    updateRecords: function (url, dataArray) {},

    fetchRecord: function (url, data) {},

    fetchRecords: function (url, dataArray) {},

});

export default Datastore;