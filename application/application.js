import CoreObject from '../application/foundation/core_object.js';
import Statechart from '../application/statechart/statechart.js';
import Window from '../application/views/window.js';

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2017 The Code Boutique, LLC
// License:   MIT License (see license for details)
// Author: Chad Eubanks
// ==========================================================================

let Application = class Application extends CoreObject{

    static toString() {
        return 'Alto.Application'
    }

    static create(...args) {
        const application = Object.assign(new Application(), this, ...args);
        delete application.create;
        window.Alto.applicationInstance = application;
        application.init();
        return application;
    }

    static extend(...args) {
        const instance = new Application();
        instance.create = this.create;
        return Object.assign(instance, ...args);
    }

};

Application = Application.extend({

    version: null,

    milestone: null,

    router: null,

    statechart: Statechart,

    logStateTransitions: true,

    window: Window,

    init: function () {
        this.applicationWillLoad();
    },

    applicationWillLoad: function () {
        console.log('applicationWillLoad');
        this.verifyRouterIsPresent();
    },

    verifyRouterIsPresent: function () {
        const router = this.get('router');

        if (router) {
            this.wakeRouter(router);
        } else {
            this.malformedRouterProvided();
        }
    },

    malformedRouterProvided: function () {
        throw new Error('Malformed router provided.')
    },

    wakeRouter: function (router) {
        this.fetchLocStrings();
        router.routerDidBecomeActive();
    },

    fetchLocStrings: function () {
        this.fetchLocStringsSuccess()
    },

    applicationDidLoad: function () {
        console.log('applicationDidLoad');
    },

    fetchLocStringsSuccess: function () {
        this.applicationDidLoad();
    },

    fetchLocStringsFail: function () {

    }

});

export default Application;