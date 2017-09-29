import CoreObject from '../foundation/core_object.js';
import generateGuid from '../foundation/guid.js';

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2017 The Code Boutique, LLC
// License:   MIT License (see license for details)
// Author: Chad Eubanks
// ==========================================================================

let Console = class Console extends CoreObject {

    static toString() {
        return 'Alto.Console'
    }

    static create(...args) {
        const instance = Object.assign(new Console(), this, ...args);
        delete instance.create;
        instance.guid = generateGuid();
        instance.init();
        return instance;
    }

    static extend(...args) {
        const instance = new Console();
        instance.create = this.create;
        return Object.assign(instance, ...args);
    }

}

Console = Console.create({

    warnColor: '#FFA500',

    errorColor: '#ff0000',

    messageColor: '#0099FF',

    log: function (msg, color) {
        console.log("%c" + msg, "color:" + color + ";");
    },

    error: function(msg) {
        throw Error.call(this, msg);
    }

});

export default Console;